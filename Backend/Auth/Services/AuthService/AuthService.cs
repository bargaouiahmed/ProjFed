using System;
using System.Security.Claims;
using Backend.Admin.Entities;
using Backend.Auth.DataTransferObjects.Requests;
using Backend.Auth.DataTransferObjects.Responses;
using Backend.Auth.Entities;
using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Auth.Services;

public class AuthService(AppDbContext db, IEmailService emailService, IWebHostEnvironment env) :IAuthService
{
    public async Task EnsureSuperAdminExistsAsync()
    {
        var superAdminEmail = Environment.GetEnvironmentVariable("SUPER_ADMIN_EMAIL") ?? throw new InvalidOperationException("SUPER_ADMIN_EMAIL not defined");
        var superAdminPassword = Environment.GetEnvironmentVariable("SUPER_ADMIN_PASSWORD") ?? throw new InvalidOperationException("SUPER_ADMIN_PASSWORD not defined");


        var identity = await db.AdminUsers.Include(a=>a.Identity).AnyAsync(a=>a.Identity.Email==superAdminEmail && a.Identity.Role=="super_admin");

        if (!identity)
        {
            var newIdentity = new AuthIdentity()
            {
                Email=superAdminEmail,
                Role="super_admin",
                Status ="active"
            };
            newIdentity.HashPassword(superAdminPassword);
            var newSuperAdmin = new AdminUser()
            {
                Identity=newIdentity
            };



            db.Add(newIdentity);
            db.Add(newSuperAdmin);
            await db.SaveChangesAsync();
        }
    }





    public async Task RegisterNewInstituteHead(RegisterNewInstituteRequest request)
    {
        if(await db.Identities.AnyAsync(i=>i.Email == request.AdminEmail))throw new InvalidOperationException("This email already exists");
        if(await db.Institutes.AnyAsync(i=>i.Name.ToLower() == request.Name.ToLower()))throw new InvalidOperationException("It appears this institute is already registered");
        
        
        //first we upload the documents
        var identityDocumentPath=string.Empty;
         var proofDocumentPath   =string.Empty;
        try
        {
             identityDocumentPath+= await UploadDocument(request.IdentityDocument,request.Name);
              proofDocumentPath+= await UploadDocument(request.ProofDocument,request.Name);

        }catch(Exception Ex)
        {
            throw new InvalidDataException(Ex.Message);
        }
        //initialize the identity and the join request
        AuthIdentity identity = new()
        {
            Email=request.AdminEmail,
            Role="uni_admin",
            Status="pending",
            IsActive=false
        };
        if(!identity.HashPassword(request.AdminPassword))throw new InvalidOperationException("An error occured trying to create your account");
        PendingJoinRequest joinRequest = new()
        {
            Identity=identity,
            Message="",
            ProofDocumentUrl=proofDocumentPath,
            IdentityDocumentUrl=identityDocumentPath,
            InstituteName=request.Name,
            InstituteCountry=request.Country,
            InstituteCity=request.City,
            InstitutePostalCode=request.PostalCode
        };
        //then we create the UniUser user and save everything to the database
        UniUser uniAdmin = new()
        {
            Identity = identity,
            Firstname = request.AdminFirstname,
            Lastname = request.AdminLastname
        };
        db.Add(identity);
        db.Add(joinRequest);
        db.Add(uniAdmin);
        await db.SaveChangesAsync();
    }


    //helper for file uploads
    private async Task<string> UploadDocument(IFormFile document, string instituteName)
    {
        var allowedExtensions=new[] {".jpg",".jpeg",".png",".pdf"};
        var fileExtension = Path.GetExtension(document.FileName).ToLowerInvariant();
        if(!allowedExtensions.Contains(fileExtension))throw new InvalidDataException("Unsupported file type");
        if(document.Length>25 *1024 *1024) throw new InvalidDataException("Document size limit exceeded, make sure the uploaded document is less than 25 mbs");
        var webRootPath = env.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
        }

        var relativeUploadDir = Path.Combine("uploads", "institutes", instituteName, "admindocuments", "proofdocuments");
        var uploadDir = Path.Combine(webRootPath, relativeUploadDir);
        Directory.CreateDirectory(uploadDir);

        var filename = Guid.NewGuid().ToString()+fileExtension;
        var filePath = Path.Combine(uploadDir, filename);
        using(var stream=new FileStream(filePath, FileMode.Create))
        {
            await document.CopyToAsync(stream);
        }
        return "/" + Path.Combine(relativeUploadDir, filename).Replace("\\", "/");
        
    }
    public async Task RegisterStudent(RegisterStudentRequest request)
    {
        if(await db.Identities.AnyAsync(i=>i.Email==request.Email))throw new InvalidOperationException("This email is already associated with a different account");

        AuthIdentity identity = new()
        {
            Email=request.Email,
            Role="student",
            Status="active",
            IsActive=false
        };
        if(!identity.HashPassword(request.Password))throw new InvalidOperationException("An error occured trying to create your account");
        Student student = new()
        {
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            Identity = identity
        };

        var activationCode = identity.GenerateActivateAccountToken();
      
        db.Add(identity);
        db.Add(student);
        await db.SaveChangesAsync();
          string email = request.Email;
        string subject = "Account Activation";
        string message = $"Your account has been successfully created, to activate it, visit the following link: {Environment.GetEnvironmentVariable("CLIENT_URL")}/activate-account?token={activationCode}&id={identity.Id.ToString()}";
        var result =await emailService.SendEmail(email, subject, message);
        if (!result) {
            throw new InvalidOperationException("An error occured trying to send the activation email, please try again later");       
        }
    }
    



    public async Task ResendActivationEmail(string email)
    {
        var identity = await db.Identities.FirstOrDefaultAsync(i => i.Email == email);
        if (identity == null || identity.IsDeleted) throw new InvalidOperationException("No account associated with this email");
        if (identity.IsActive) throw new InvalidOperationException("This account is already active");

        var activationCode = identity.GenerateActivateAccountToken();
        identity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        string subject = "Account Activation";
        string message = $"Your account has been successfully created, to activate it, visit the following link: {Environment.GetEnvironmentVariable("CLIENT_URL")}/activate-account?token={activationCode}&id={identity.Id.ToString()}";
        var result =await emailService.SendEmail(email, subject, message);
        if (!result) {
            throw new InvalidOperationException("An error occured trying to send the activation email, please try again later");       
        }
    }


    public async Task<TokenPairResponse> Login(LoginRequest request)
    {
        var identity = await db.Identities.FirstOrDefaultAsync(i => i.Email == request.Email);
        
 
        if (identity == null || !identity.CompareHash(request.Password) || identity.Status!="active" || !identity.IsActive || identity.IsDeleted) throw new InvalidOperationException("Invalid credentials or account not active or deleted");

        //Generate tokens
        var accessToken = GenerateJwtToken(identity.Id, identity.Email, identity.Role);
        var refreshToken = identity.GenerateRefreshToken(128);
        identity.UpdatedAt = DateTime.UtcNow;

        

        await db.SaveChangesAsync();

        return new TokenPairResponse()
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }
    

    public async Task ActivateAccount(Guid identityId, string activationToken)
    {
        Console.WriteLine($"Activating account for IdentityId: {identityId}, ActivationToken: {activationToken}");
        var identity = await db.Identities.FirstOrDefaultAsync(i => i.Id == identityId);
        if(identity==null) throw new InvalidOperationException("Invalid activation link");
        if(identity.IsActive) throw new InvalidOperationException("This account is already active");
        if(identity.ActivateAccountToken != activationToken || identity.ActivateAccountTokenExpiresAt <DateTime.UtcNow) throw new InvalidOperationException("Invalid activation token or token expired");

        identity.IsActive = true;
        identity.ActivateAccountToken = null;
        identity.ActivateAccountTokenExpiresAt = null;
        identity.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
    }





    public async Task RequestPasswordReset(string email)
    {
        var identity = await db.Identities.FirstOrDefaultAsync(i => i.Email == email);

        if (identity == null || identity.IsDeleted) throw new InvalidOperationException("No account associated with this email");

        var resetToken = identity.GeneratePasswordResetToken();
        identity.UpdatedAt = DateTime.UtcNow;

        string subject = "Password Reset Request";
        string message = $"A password reset request has been initiated for your account. To reset your password, please visit the following link: {Environment.GetEnvironmentVariable("CLIENT_URL")}/reset-password?token={resetToken}&id={identity.Id}";

        var result = await emailService.SendEmail(email, subject, message);
        if (!result) throw new InvalidOperationException("An error occured trying to send the password reset email, please try again later");

        await db.SaveChangesAsync();
    }
    


    public async Task ResetPassword(ResetPasswordRequest request)
    {        var identity = await db.Identities.FirstOrDefaultAsync(i => i.Id == request.IdentityId); 
        if (identity == null || identity.PasswordResetToken != request.ResetToken || identity.PasswordResetTokenExpiresAt < DateTime.UtcNow) throw new InvalidOperationException("Invalid password reset token or token expired");
        if(!identity.HashPassword(request.NewPassword))
        {
            throw new InvalidOperationException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }
        identity.PasswordResetToken = null;
        identity.PasswordResetTokenExpiresAt = null;
        identity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }





    public async Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request)
    {
        var identity = await db.Identities.FirstOrDefaultAsync(i => i.RefreshToken == request.RefreshToken);
        if (identity == null || identity.RefreshTokenExpiresAt < DateTime.UtcNow) throw new InvalidOperationException("Invalid refresh token or token expired");

        var newAccessToken = GenerateJwtToken(identity.Id, identity.Email, identity.Role);
        var newRefreshToken = identity.GenerateRefreshToken(128);
        identity.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return new RefreshTokenResponse()
        {
            AccessToken = newAccessToken
        };
    }

        private string GenerateJwtToken(Guid identityId, string email, string role)
    {
        var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new InvalidOperationException("jwt_secret_key not found in environment variables.");
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new InvalidOperationException("jwt_issuer not found in environment variables.");
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new InvalidOperationException("jwt_audience not found in environment variables.");

        var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var key = System.Text.Encoding.ASCII.GetBytes(secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, identityId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
            }),
            Expires = DateTime.UtcNow.AddMinutes(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    }  


