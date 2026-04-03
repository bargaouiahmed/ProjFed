using System;
using Backend.Administration.DataTransferObjects.Requests;
using Backend.Administration.DataTransferObjects.Responses;
using Backend.Administration.Entities;
using Backend.Auth.Entities;
using Backend.Auth.Services;
using Backend.Database.Auth;
using Backend.StudentSpace.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;


namespace Backend.Administration.Services;
    public record UniId(Guid Id);

public class AdministrationService(AppDbContext db, IEmailService smtp) : IAdministrationService
{


    public async Task AddNewClassMetaData(NewClassMetaDataRequest request, Guid uniAdminIdentityId)
    {
        var institute = await db.Institutes.Include(u => u.Admins).FirstOrDefaultAsync(i => i.Id == request.InstituteId) ?? throw new InvalidOperationException("Institute not found");
        if (!institute.Admins.Any(a => a.IdentityId == uniAdminIdentityId))
        {
            throw new InvalidOperationException("Only institute admins can add class metadata");
        }
        List<ClassMetadata> classes = [];
        for (int i = 1; i <= request.MaxYears; i++)
        {
            var newClassMetaData = new ClassMetadata
            {
                InstituteId = request.InstituteId,
                LevelOfStudies = request.LevelOfStudies,
                Specialty = request.Specialty,
                MaxYears = request.MaxYears,
                MaxTerms = request.DefaultMaxTerms,
                CurrentTerm = 1,
                Level = i
            };
            classes.Add(newClassMetaData);

        }
        db.ClassMetadata.AddRange(classes);

        await db.SaveChangesAsync();

    }

    public async Task<UniId> GetInstituteIdForStaffMember(Guid uniStaffIdentityId)
    {
        var uniStaffMember = await db.UniUsers.Include(uu => uu.Identity).FirstOrDefaultAsync(u => u.IdentityId == uniStaffIdentityId) ?? throw new InvalidOperationException("No staff member with given id found");
        if (!uniStaffMember.InstituteId.HasValue) throw new InvalidOperationException("This staff member does not belong to any institute");
        return new UniId(uniStaffMember.InstituteId.Value);
    }
    public async Task<List<SerializedClassMetaData>> GetAllClassMetaData(Guid instituteId, Guid uniAdminIdentityId, int pageNumber = 1, int pageSize = 10)
    {
        int skip = (pageNumber - 1) * pageSize;
        int take = pageSize;
        if (!await db.UniUsers.AnyAsync(au => au.IdentityId == uniAdminIdentityId && au.InstituteId == instituteId)) throw new InvalidOperationException("Only administration members may consult this resource");
        var classMetaDatas = await db.ClassMetadata.Include(u => u.Classes).Where(c => c.InstituteId == instituteId).Select(c => new SerializedClassMetaData
        {
            MetadataId = c.Id,
            LevelOfStudies = c.LevelOfStudies,
            MaxYears = c.MaxYears,
            Level = c.Level,
            Specialty = c.Specialty,
            MaxTerms = c.MaxTerms,
            NumberOfClasses = c.Classes.Count()
        }).Skip(skip).Take(take).ToListAsync();
        return classMetaDatas;

    }
    public async Task<ClassPrettyName> AddClassToMetadataType(Guid uniAdminIdentityId, Guid metadataId)
    {
        await using var transaction = await db.Database.BeginTransactionAsync();

        var metadata = await db.ClassMetadata
            .Include(cm => cm.Institute)
            .ThenInclude(i => i.Admins)
            .FirstOrDefaultAsync(cm => cm.Id == metadataId && cm.Institute.Admins.Any(a => a.IdentityId == uniAdminIdentityId))
            ?? throw new InvalidOperationException("Invalid ClassMetaData or UnauthorizedAccessAttempt");

        var lockKey = BitConverter.ToInt64(metadataId.ToByteArray(), 0);
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT pg_advisory_xact_lock({lockKey})");

        var nextClassNumber = (await db.UniClasses
            .Where(uc => uc.MetadataId == metadataId)
            .Select(uc => (int?)uc.Number)
            .MaxAsync() ?? 0) + 1;

        var newClass = new UniClass
        {
            Number = nextClassNumber,
            MetadataId = metadataId
        };

        newClass.CreateClassCode();
        while (await db.UniClasses.AnyAsync(uc => uc.ClassCode == newClass.ClassCode))
        {
            newClass.CreateClassCode();
        }

        db.UniClasses.Add(newClass);
        await db.SaveChangesAsync();
        await transaction.CommitAsync();

        var number = newClass.Number.ToString();
        var speciality = metadata.Specialty;
        var year = metadata.Level.ToString();
        var levelOfStudies = metadata.LevelOfStudies.ToString();
        return new ClassPrettyName($"{year}{levelOfStudies}{speciality}{number}");

    }

    public async Task<SerializedClassMetaData> UpdateClassMetaData(SerializedClassMetaData request, Guid uniAdminIdentityId)
    {

        var response = await db.ClassMetadata.Include(cm => cm.Institute).ThenInclude(i => i.Admins).FirstOrDefaultAsync(cm => cm.Id == request.MetadataId) ?? throw new InvalidOperationException("invalid metadata id");
        if (!response.Institute.Admins.Any(a => a.IdentityId == uniAdminIdentityId)) throw new InvalidOperationException("unauthorized access");

        response.Level = request.Level;
        response.LevelOfStudies = request.LevelOfStudies;
        response.MaxTerms = request.MaxTerms;
        response.Specialty = request.Specialty;
        await db.SaveChangesAsync();
        return request;

    }

    public async Task RegisterUniStaff(Guid uniAdminIdentityId, RegisterUniStaffRequest request)
    {
        if(!request.Validate())throw new InvalidDataException("Invalid request");
        var uniAdmin = await db.Identities.Include(i => i.UniUser)
        .ThenInclude(u => u!.Institute)
        .FirstOrDefaultAsync(i => i.Id == uniAdminIdentityId && i.UniUser!=null && i.UniUser!.Institute!=null) ?? throw new InvalidOperationException("Invalid data");
        int randomNumber = new Random().Next(100000, 999999);
        string password = $"{request.Lastname}-{request.Firstname[0]}-EduAdmin{randomNumber}";
        var existingIdentity = await db.Identities.Include(i=>i.UniUser).FirstOrDefaultAsync(i => i.Email == request.Email);
        if(existingIdentity != null)
        {
            if(existingIdentity.UniUser != null)
            {
                if (existingIdentity.UniUser.InstituteId.HasValue)
                {
                    if (existingIdentity.UniUser.InstituteId.Value != uniAdmin.UniUser!.InstituteId!.Value)
                    {
                        throw new InvalidOperationException("A user with this email belongs to a different institute, please contact them to fix this");
                    }
                    throw new InvalidOperationException("This user already exists and belongs to your institute");
                    
                }
                else
                {
                    existingIdentity.UniUser.InstituteId = uniAdmin!.UniUser!.Institute!.Id;
                    await db.SaveChangesAsync();
                    return;
                }
            }
       
        }
        AuthIdentity newIdentity = new()
        {
            Email = request.Email,
            Role = "uni_staff",
            Status="accepted"
        };
        if (!newIdentity.HashPassword(password))
        {
            throw new InvalidOperationException("Password must be at least 8 characters long, with uppercase, lowercase, numbers and symbols");
        }
        UniUser newUniUser = new()
        {
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            Identity = newIdentity
        };
        db.Add(newUniUser);
        UniStaffInvitation invitation = new()
        {
            Identity=newIdentity,
            Institute=uniAdmin!.UniUser!.Institute!
        };
        db.Add(invitation);
        List<Task> tasks = [smtp.SendEmail(request.Email, "Welcome to EduAdmin",$"Welcome to EduAdmin, you've been invited to join our platform as a staff member by {uniAdmin!.UniUser.Lastname} {uniAdmin!.UniUser.Firstname}, your automatically generated password is {password}, make sure to change it as soon as you sign in and checkout your invitations to accept or reject. this account will remain viable for 30 days if never logged into"), db.SaveChangesAsync()];
        await Task.WhenAll(tasks);
        

    }
    public async Task AddNewProfessor(Guid uniStaffIdentityId,  Guid courseId, AddNewProfessorRequest request)
    {
        if(!request.Validate())throw new InvalidDataException("Invalid request");

        var uniStaffMember = await db.UniUsers.Include(uu=>uu.Identity).FirstOrDefaultAsync(u=>u.IdentityId == uniStaffIdentityId)??throw new InvalidOperationException("No staff member with given id found");
        var course = await db.Courses.Include(c=>c.UniClass).ThenInclude(c=>c.Metadata).FirstOrDefaultAsync(c=>c.Id == courseId)??throw new InvalidOperationException("No course with given id found");
        string courseClassPrettyName = $"{course.UniClass.Metadata.Level}{course.UniClass.Metadata.LevelOfStudies}{course.UniClass.Metadata.Specialty}{course.UniClass.Number}-term:{course.Term}";
        if(course.UniClass.Metadata.InstituteId != uniStaffMember.InstituteId)throw new InvalidOperationException("You may assign only to classes that belong to the institute you administrate");

        var existingProfessor = await db.Professors.Include(p=>p.Identity).Include(p=>p.Courses).ThenInclude(c=>c.UniClass).ThenInclude(uc=>uc.Metadata).FirstOrDefaultAsync(p=>p.Identity.Email==request.Email);
        if (existingProfessor != null)
        {
            if (existingProfessor.Courses.Any(c => c.UniClass.Metadata.InstituteId == uniStaffMember.InstituteId))
            {   
                course.Professor = existingProfessor;
                Notification notification = new()
                {
                  Identity = existingProfessor.Identity,
                  Message = $"You've been added as the professor in charge of {course.Name} for the class {courseClassPrettyName}"  
                };
                db.Add(notification);
                await db.SaveChangesAsync();
                return;
            }
            else
            {
                ProfessorInvitation invitation = new()
                {
                    Identity = existingProfessor.Identity,
                    ClassPrettyName=courseClassPrettyName,
                    Course = course
                };
                db.Add(invitation);
                await db.SaveChangesAsync();
                return;
            }
            
        }
        else
        {
            var identity = new AuthIdentity
            {
                Email=request.Email,
                Role="professor",
                Status="accepted"
                
            };
                    int randomNumber = new Random().Next(100000, 999999);
        string password = $"{request.Lastname}-{request.Firstname[0]}-EduAdmin{randomNumber}";
        if(!identity.HashPassword(password))throw new InvalidOperationException("error occured when hashing password");
        
        var professor = new Professor
        {
            Firstname=request.Firstname,
            Lastname=request.Lastname,
            Identity=identity
        };
 ProfessorInvitation invitation = new()
                {
                    Identity = identity,
                    ClassPrettyName=courseClassPrettyName,
                    Course = course
                };        
            db.Add(identity);
            db.Add(professor);
            db.Add(invitation);
            List<Task> tasks = [smtp.SendEmail(identity.Email, "Invitation to join EduAdmin", $"You've been invited to join EduAdmin by {uniStaffMember.Lastname} {uniStaffMember.Firstname}")];
            await db.SaveChangesAsync();
            await Task.WhenAll(tasks);
        }

    }

    public async Task AddExistingProfessor(Guid uniStaffIdentityId, Guid courseId, AddExistingProfessorRequest request)
    {
        var uniStaffMember = await db.UniUsers.Include(uu => uu.Identity).FirstOrDefaultAsync(u => u.IdentityId == uniStaffIdentityId) ?? throw new InvalidOperationException("No staff member with given id found");
        var course = await db.Courses.Include(c => c.UniClass).ThenInclude(c => c.Metadata).FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new InvalidOperationException("No course with given id found");
        string courseClassPrettyName = $"{course.UniClass.Metadata.Level}{course.UniClass.Metadata.LevelOfStudies}{course.UniClass.Metadata.Specialty}{course.UniClass.Number}-term:{course.Term}";
        if (course.UniClass.Metadata.InstituteId != uniStaffMember.InstituteId) throw new InvalidOperationException("You may assign only to classes that belong to the institute you administrate");

        var existingProfessor = await db.Professors.Include(p => p.Identity).Include(p => p.Courses).ThenInclude(c => c.UniClass).ThenInclude(uc => uc.Metadata).FirstOrDefaultAsync(p => p.Identity.Email == request.Email) ?? throw new InvalidOperationException("No professor with given email found");
        if (existingProfessor.Courses.Any(c => c.UniClass.Metadata.InstituteId == uniStaffMember.InstituteId))
        {
            course.Professor = existingProfessor;
            Notification notification = new()
            {
                Identity = existingProfessor.Identity,
                Message = $"You've been added as the professor in charge of {course.Name} for the class {courseClassPrettyName}"
            };
            db.Add(notification);
            await db.SaveChangesAsync();
            return;
        }

        ProfessorInvitation invitation = new()
        {
            Identity = existingProfessor.Identity,
            ClassPrettyName = courseClassPrettyName,
            Course = course
        };
        db.Add(invitation);
        await db.SaveChangesAsync();
    }

    public async Task AddExistingUniStaff(Guid uniAdminIdentityId, AddExistingUniStaffRequest request)
    {
        var uniAdmin = await db.Identities.Include(i => i.UniUser)
        .ThenInclude(u => u!.Institute)
        .FirstOrDefaultAsync(i => i.Id == uniAdminIdentityId && i.UniUser != null && i.UniUser!.Institute != null) ?? throw new InvalidOperationException("Invalid data");

        var existingIdentity = await db.Identities.Include(i => i.UniUser).FirstOrDefaultAsync(i => i.Email == request.Email) ?? throw new InvalidOperationException("No user with given email found");
        if (existingIdentity.UniUser == null)
        {
            throw new InvalidOperationException("This user is not a university staff member");
        }
        if (existingIdentity.UniUser.InstituteId.HasValue)
        {
            if (existingIdentity.UniUser.InstituteId.Value != uniAdmin.UniUser!.InstituteId!.Value)
            {
                throw new InvalidOperationException("A user with this email belongs to a different institute, please contact them to fix this");
            }
            throw new InvalidOperationException("This user already exists and belongs to your institute");
        }

        existingIdentity.UniUser.InstituteId = uniAdmin.UniUser!.Institute!.Id;
        UniStaffInvitation invitation = new()
        {
            Identity = existingIdentity,
            Institute = uniAdmin.UniUser!.Institute!
        };
        db.Add(invitation);
        await db.SaveChangesAsync();
    }


}
