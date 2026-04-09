using System;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;
using Backend.Administration.Entities;
using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;

namespace Backend.Account.Services;

public class AccountService(AppDbContext db, IWebHostEnvironment env) : IAccountService
{

    public async Task<SerializedUser> GetUserByIdAsync(GetUserByIdRequest request)
    {
        var user = new SerializedUser();

        if (request.Role == "student")
        {

            user = await db.Students.Include(s => s.Identity).Where(s => s.Identity.Id == request.UserId)
            .Select(s => new SerializedUser
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
            }).FirstOrDefaultAsync() ?? throw new InvalidOperationException("No matching user found");

            return user;
        }

        else if (request.Role == "professor")
        {


            user = await db.Professors.Include(p => p.Identity).Where(p => p.Identity.Id == request.UserId)
            .Select(p => new SerializedUser
            {
                Id = p.Id,
                IdentityId = p.Identity.Id,
                Email = p.Identity.Email,
                Firstname = p.Firstname,
                Lastname = p.Lastname,
                CreatedAt = p.Identity.CreatedAt,
                UpdatedAt = p.Identity.UpdatedAt,
                PfpUrl = p.PfpUrl

            }).FirstOrDefaultAsync() ?? throw new InvalidOperationException("No matching user found");

            return user;
        }

        else if (new string[] { "admin", "super_admin" }.Contains(request.Role))
        {

            user = await db.AdminUsers.Include(au => au.Identity)
            .Where(au => au.Identity.Id == request.UserId)
            .Select(au => new SerializedUser
            {
                Id = au.Id,
                IdentityId = au.Identity.Id,
                Firstname = au.Firstname,
                Lastname = au.Lastname,
                Email = au.Identity.Email,
                CreatedAt = au.Identity.CreatedAt,
                UpdatedAt = au.Identity.UpdatedAt,
                Role = au.Identity.Role,
                PfpUrl = au.PfpUrl
            })
            .FirstOrDefaultAsync() ?? throw new InvalidOperationException("No matching user found");

            return user;
        }

        else if (new string[] { "uni_admin", "uni_staff" }.Contains(request.Role))
        {

            user = await db
            .UniUsers
            .Include(uu => uu.Identity)
            .Where(uu => uu.Identity.Id == request.UserId)
            .Select(uu => new SerializedUser
            {
                Id = uu.Id,
                IdentityId = uu.Identity.Id,
                Firstname = uu.Firstname,
                Lastname = uu.Lastname,
                Email = uu.Identity.Email,
                CreatedAt = uu.Identity.CreatedAt,
                UpdatedAt = uu.Identity.UpdatedAt,
                PfpUrl = uu.PfpUrl
            }).FirstOrDefaultAsync() ?? throw new InvalidOperationException("No matching user found");

            return user;
        }

        throw new InvalidOperationException("Invalid role provided");
    }






    public async Task<SerializedUser> UpdateAccountAsync(UpdateAccountRequest request, Guid identityId, string role)
    {
        var user = await db.Identities
        .Include(i => i.Student)
        .Include(i => i.Professor)
        .Include(i => i.AdminUser)
        .Include(i => i.UniUser)
        .FirstOrDefaultAsync(i => i.Id == identityId) ?? throw new InvalidOperationException("User not found");

        if (role == "student" && user.Student != null)
        {
            if (request.Firstname != null) user.Student.Firstname = request.Firstname;
            if (request.Lastname != null) user.Student.Lastname = request.Lastname;
            if (request.Email != null) user.Email = request.Email;
            if (request.Pfp != null) user.Student.PfpUrl = await SavePfpAsync(request.Pfp, role);
        }
        else if (role == "professor" && user.Professor != null)
        {
            if (request.Firstname != null) user.Professor.Firstname = request.Firstname;
            if (request.Lastname != null) user.Professor.Lastname = request.Lastname;
            if (request.Email != null) user.Email = request.Email;
            if (request.Pfp != null) user.Professor.PfpUrl = await SavePfpAsync(request.Pfp, role);
        }
        else if (new string[] { "admin", "super_admin" }.Contains(role) && user.AdminUser != null)
        {
            if (request.Firstname != null) user.AdminUser.Firstname = request.Firstname;
            if (request.Lastname != null) user.AdminUser.Lastname = request.Lastname;
            if (request.Email != null) user.Email = request.Email;
            if (request.Pfp != null) user.AdminUser.PfpUrl = await SavePfpAsync(request.Pfp, role);
        }
        else if (new string[] { "uni_admin", "uni_staff" }.Contains(role) && user.UniUser != null)
        {
            if (request.Firstname != null) user.UniUser.Firstname = request.Firstname;
            if (request.Lastname != null) user.UniUser.Lastname = request.Lastname;
            if (request.Email != null) user.Email = request.Email;
            if (request.Pfp != null) user.UniUser.PfpUrl = await SavePfpAsync(request.Pfp, role);
        }
        else
        {
            throw new InvalidOperationException("Invalid role or user type");
        }
        await db.SaveChangesAsync();
        return await GetUserByIdAsync(new GetUserByIdRequest { UserId = identityId, Role = role });


    }


    private async Task<string> SavePfpAsync(IFormFile pfp, string role)
    {
        var roleMap = new Dictionary<string, string>
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

        if (!new string[] { ".jpg", ".jpeg", ".png", ".webp", ".svg" }.Contains(fileExtension.ToLower()))
        {
            throw new InvalidOperationException("Invalid file type. Only image files are allowed.");
        }

        if (pfp.Length > 5 * 1024 * 1024)
        {
            throw new InvalidOperationException("File size exceeds the limit of 5MB.");
        }
        var webRootPath = env.WebRootPath;
        if (string.IsNullOrEmpty(webRootPath))
        {
            webRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
        }
        var relativeUploadDir = Path.Combine("uploads", "users", folderName);
        var uploadDir = Path.Combine(webRootPath, relativeUploadDir);
        Directory.CreateDirectory(uploadDir);
        var filename = Guid.NewGuid().ToString() + fileExtension;
        var filePath = Path.Combine(uploadDir, filename);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await pfp.CopyToAsync(stream);
        }

        return "/" + Path.Combine(relativeUploadDir, filename).Replace("\\", "/");
    }

    public async Task<List<SerializedNotification>> GetNotificationsAsync(Guid identityId)
    {
        var notifications = await db.Notifications
            .Where(n => n.IdentityId == identityId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        foreach (var notification in notifications.Where(n => !n.Seen))
        {
            notification.Seen = true;
        }

        await db.SaveChangesAsync();

        return [.. notifications.Select(n => new SerializedNotification
        {
            Id = n.Id,
            Message = n.Message,
            CreatedAt = n.CreatedAt,
            Seen = true
        })];
    }

    public async Task<List<SerializedUniStaffInvitation>> GetUniStaffInvitationsAsync(Guid identityId)
    {
        var invitations = await db.UniStaffInvitations
            .Include(i => i.Institute)
            .Where(i => i.IdentityId == identityId)
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync();

        return [.. invitations.Select(i => new SerializedUniStaffInvitation
        {
            Id = i.Id,
            InstituteId = i.InstituteId,
            InstituteName = i.Institute?.Name ?? string.Empty,
            Status = i.Status,
            InvitedAt = i.InvitedAt
        })];
    }

    public async Task AcceptUniStaffInvitationAsync(Guid identityId, Guid invitationId)
    {
        var invitation = await db.UniStaffInvitations
            .Include(i => i.Institute)
            .Include(i => i.Identity)
            .ThenInclude(identity => identity!.UniUser)
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.IdentityId == identityId)
            ?? throw new InvalidOperationException("Uni staff invitation not found.");

        if (invitation.Status != "pending")
        {
            throw new InvalidOperationException("This uni staff invitation has already been processed.");
        }

        if (invitation.Identity?.UniUser == null)
        {
            throw new InvalidOperationException("No uni staff account is associated with this invitation.");
        }

        invitation.Status = "accepted";
        invitation.Identity.UniUser.InstituteId = invitation.InstituteId;
        db.Notifications.Add(new Notification
        {
            IdentityId = identityId,
            Message = $"You accepted the invitation to join {invitation.Institute?.Name ?? "the institute"} as university staff."
        });
        await db.SaveChangesAsync();
    }

    public async Task RejectUniStaffInvitationAsync(Guid identityId, Guid invitationId)
    {
        var invitation = await db.UniStaffInvitations
            .Include(i => i.Institute)
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.IdentityId == identityId)
            ?? throw new InvalidOperationException("Uni staff invitation not found.");

        if (invitation.Status != "pending")
        {
            throw new InvalidOperationException("This uni staff invitation has already been processed.");
        }

        invitation.Status = "rejected";
        db.Notifications.Add(new Notification
        {
            IdentityId = identityId,
            Message = $"You rejected the invitation to join {invitation.Institute?.Name ?? "the institute"} as university staff."
        });
        await db.SaveChangesAsync();
    }

    public async Task<List<SerializedProfessorInvitation>> GetProfessorInvitationsAsync(Guid identityId)
    {
        var invitations = await db.ProfessorInvitations
            .Include(i => i.Course)
            .Where(i => i.IdentityId == identityId)
            .OrderByDescending(i => i.InvitedAt)
            .ToListAsync();

        return [.. invitations.Select(i => new SerializedProfessorInvitation
        {
            Id = i.Id,
            CourseId = i.CourseId,
            CourseName = i.Course?.Name ?? string.Empty,
            ClassPrettyName = i.ClassPrettyName,
            Status = i.Status,
            InvitedAt = i.InvitedAt
        })];
    }

    public async Task AcceptProfessorInvitationAsync(Guid identityId, Guid invitationId)
    {
        var invitation = await db.ProfessorInvitations
            .Include(i => i.Course)
            .Include(i => i.Identity)
            .ThenInclude(identity => identity!.Professor)
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.IdentityId == identityId)
            ?? throw new InvalidOperationException("Professor invitation not found.");

        if (invitation.Status != "pending")
        {
            throw new InvalidOperationException("This professor invitation has already been processed.");
        }

        if (invitation.Identity?.Professor == null)
        {
            throw new InvalidOperationException("No professor account is associated with this invitation.");
        }

        invitation.Status = "accepted";
        invitation.Course.ProfessorId = invitation.Identity.Professor.Id;
        Notification notification = new()
        {
            IdentityId = identityId,
            Message = $"You accepted the invitation to teach {invitation.Course.Name} for {invitation.ClassPrettyName}."
        };
        db.Notifications.Add(notification);
        await db.SaveChangesAsync();
    }

    public async Task RejectProfessorInvitationAsync(Guid identityId, Guid invitationId)
    {
        var invitation = await db.ProfessorInvitations
            .Include(i => i.Course)
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.IdentityId == identityId)
            ?? throw new InvalidOperationException("Professor invitation not found.");

        if (invitation.Status != "pending")
        {
            throw new InvalidOperationException("This professor invitation has already been processed.");
        }

        invitation.Status = "rejected";
        Notification notification = new()
        {
            IdentityId = identityId,
            Message = $"You rejected the invitation to teach {invitation.Course.Name} for {invitation.ClassPrettyName}."
        };
        db.Notifications.Add(notification);
        await db.SaveChangesAsync();
    }



}
