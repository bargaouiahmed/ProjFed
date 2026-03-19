using System;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;
using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;

namespace Backend.Account.Services;

public class AccountService(AppDbContext db, IWebHostEnvironment env): IAccountService
{

        public async Task<SerializedUser> GetUserByIdAsync(GetUserByIdRequest request)
    {
        var user = new SerializedUser();

        if(request.Role == "student")
        {
            
            user = await db.Students.Include(s=>s.Identity).Where(s=>s.Identity.Id==request.UserId)
            .Select(s=> new SerializedUser
            {
                Id = s.Id,
                IdentityId = s.Identity.Id,
                Firstname = s.Firstname,
                Lastname = s.Lastname,
                Email = s.Identity.Email,
                Role = "student",
                CreatedAt = s.Identity.CreatedAt,
                UpdatedAt = s.Identity.UpdatedAt,
                PfpUrl = s.PfpUrl
            }).FirstOrDefaultAsync()??throw new InvalidOperationException("No matching user found");
            
            return user;
        }

        else if (request.Role == "professor")
        {


            user = await db.Professors.Include(p=>p.Identity).Where(p=>p.Identity.Id==request.UserId)
            .Select(p=>new SerializedUser
            {
                Id=p.Id,
                IdentityId=p.Identity.Id,
                Email=p.Identity.Email,
                Firstname=p.Firstname,
                Lastname=p.Lastname,
                CreatedAt=p.Identity.CreatedAt,
                UpdatedAt=p.Identity.UpdatedAt,
                PfpUrl=p.PfpUrl
                
            }).FirstOrDefaultAsync() ?? throw new InvalidOperationException("No matching user found");
            
            return user;
        }

        else if(new string[] { "admin", "super_admin" }.Contains(request.Role))
        {

            user = await db.AdminUsers.Include(au=>au.Identity)
            .Where(au=>au.Identity.Id==request.UserId)
            .Select(au=>new SerializedUser
            {
                Id=au.Id,
                IdentityId=au.Identity.Id,
                Firstname=au.Firstname,
                Lastname=au.Lastname,
                Email=au.Identity.Email,
                CreatedAt=au.Identity.CreatedAt,
                UpdatedAt=au.Identity.UpdatedAt,
                Role = au.Identity.Role,
                PfpUrl=au.PfpUrl
            })
            .FirstOrDefaultAsync()??throw new InvalidOperationException("No matching user found");
           
            return user;
        }

        else if(new string[] { "uni_admin", "uni_staff" }.Contains(request.Role))
        {
            
            user = await db
            .UniUsers
            .Include(uu=>uu.Identity)
            .Where(uu=>uu.Identity.Id==request.UserId)
            .Select(uu=>new SerializedUser
            {
                Id=uu.Id,
                IdentityId=uu.Identity.Id,
                Firstname=uu.Firstname,
                Lastname=uu.Lastname,
                Email=uu.Identity.Email,
                CreatedAt=uu.Identity.CreatedAt,
                UpdatedAt=uu.Identity.UpdatedAt,
                PfpUrl=uu.PfpUrl
            }).FirstOrDefaultAsync()??throw new InvalidOperationException("No matching user found");
            
            return user;
        }

        throw new InvalidOperationException("Invalid role provided");
    }






    public async Task<SerializedUser> UpdateAccountAsync(UpdateAccountRequest request, Guid identityId, string role)
    {
        var user = await db.Identities
        .Include(i=>i.Student)
        .Include(i=>i.Professor)
        .Include(i=>i.AdminUser)
        .Include(i=>i.UniUser)
        .FirstOrDefaultAsync(i=>i.Id==identityId)??throw new InvalidOperationException("User not found");

        if(role == "student" && user.Student != null)
        {
            if(request.Firstname != null) user.Student.Firstname = request.Firstname;
            if(request.Lastname != null) user.Student.Lastname = request.Lastname;
            if(request.Email != null) user.Email = request.Email;
            if(request.Pfp != null) user.Student.PfpUrl = await SavePfpAsync(request.Pfp,role);
        }
        else if(role == "professor" && user.Professor != null)
        {
            if(request.Firstname != null) user.Professor.Firstname = request.Firstname;
            if(request.Lastname != null) user.Professor.Lastname = request.Lastname;
            if(request.Email != null) user.Email = request.Email;
            if(request.Pfp != null) user.Professor.PfpUrl = await SavePfpAsync(request.Pfp,role);
        }
        else if(new string[] { "admin", "super_admin" }.Contains(role) && user.AdminUser != null)
        {
            if(request.Firstname != null) user.AdminUser.Firstname = request.Firstname;
            if(request.Lastname != null) user.AdminUser.Lastname = request.Lastname;
            if(request.Email != null) user.Email = request.Email;
            if(request.Pfp != null) user.AdminUser.PfpUrl = await SavePfpAsync(request.Pfp,role);
        }
        else if(new string[] { "uni_admin", "uni_staff" }.Contains(role) && user.UniUser != null)
        {
            if(request.Firstname != null) user.UniUser.Firstname = request.Firstname;
            if(request.Lastname != null) user.UniUser.Lastname = request.Lastname;
            if(request.Email != null) user.Email = request.Email;
            if(request.Pfp != null) user.UniUser.PfpUrl = await SavePfpAsync(request.Pfp, role);
        }
        else
        {
            throw new InvalidOperationException("Invalid role or user type");
        }
        await db.SaveChangesAsync();
        return await GetUserByIdAsync(new GetUserByIdRequest{UserId=identityId, Role=role});


    }


    private async Task<string> SavePfpAsync(IFormFile pfp, string role)
    {
        var roleMap = new Dictionary<string,string>
        {
            {"student", "students"},
            {"professor", "professors"},
            {"admin", "admins"},
            {"super_admin", "superadmins"},
            {"uni_admin", "uniadmins"},
            {"uni_staff", "uniadmins"}
        };
        var folderName = roleMap.ContainsKey(role) ? roleMap[role] : "others";
        var fileExtension = Path.GetExtension(pfp.FileName);
        
        if(!new string[] { ".jpg", ".jpeg", ".png", ".webp",".svg" }.Contains(fileExtension.ToLower()))
        {
            throw new InvalidOperationException("Invalid file type. Only image files are allowed.");
        }
        
        if(pfp.Length > 5 * 1024 * 1024)
        {
            throw new InvalidOperationException("File size exceeds the limit of 5MB.");
        }
        var webRootPath = env.WebRootPath;
        if(string.IsNullOrEmpty(webRootPath))
        {
            webRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
        }
        var relativeUploadDir = Path.Combine("uploads","users", folderName);
        var uploadDir = Path.Combine(webRootPath, relativeUploadDir);
        Directory.CreateDirectory(uploadDir);
        var filename =  Guid.NewGuid().ToString()+fileExtension;
        var filePath = Path.Combine(uploadDir,filename);
        using(var stream=new FileStream(filePath, FileMode.Create))
        {
            await pfp.CopyToAsync(stream);
        }

        return "/"+Path.Combine(relativeUploadDir, filename).Replace("\\","/");
    }



}
