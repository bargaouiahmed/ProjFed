using System;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;
using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;

namespace Backend.Account.Services;

public class AccountService(AppDbContext db): IAccountService
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
                Lastname=p.Lasttname,
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

}
