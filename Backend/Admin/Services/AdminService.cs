using System;
using Backend.Admin.DataTransferObjects.Responses;
using Backend.Auth.Entities;
using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;

namespace Backend.Admin.Services;

public class AdminService(AppDbContext db): IAdminService
{
    
    public async Task<List<PendingRequestResponse>> GetAllPendingRequestsAsync(int pageNumber=1, int pageSize=10)
    {
        int skip = (pageNumber - 1) * pageSize;
        int take = pageSize;
        int totalCount = await db.PendingJoinRequests.CountAsync();
        var pendingRequests = await db.PendingJoinRequests
        .Include(pr=>pr.Identity)
        .ThenInclude(i=>i.UniUser)
        .OrderBy(pr=>pr.RequestedAt)
        .Skip(skip)
        .Take(take)
        .Select(pr=> new PendingRequestResponse
        {
            RequestId = pr.Id,
            Firstname =  pr.Identity.UniUser!.Firstname,
            Lastname =  pr.Identity.UniUser!.Lastname,
            Email = pr.Identity.Email,
            
            RequestedAt = pr.RequestedAt,
            Message = pr.Message,
            ProofDocumentUrl = pr.ProofDocumentUrl,
            IdentityDocumentUrl = pr.IdentityDocumentUrl,
            InstituteName = pr.InstituteName,
            InstituteCountry = pr.InstituteCountry,
            InstituteCity = pr.InstituteCity,
            InstitutePostalCode = pr.InstitutePostalCode,
            ReviewedAt = pr.ReviewedAt,
            Status = pr.Identity.Status!,
            TotalRequestsCount = totalCount
        }).ToListAsync();
        return pendingRequests;
    }   

//This method has a sideffect of creating an institute and associating it with the user whose request is being accepted. This is because the pending join request contains all the necessary data for creating the institute, and accepting the request implies that the user is now a member of that institute.
    public async Task<PendingRequestResponse> AcceptPendingRequest(Guid requestId, Guid reviewerIdentityId)
    {

        var pendingRequest = await db.PendingJoinRequests.Include(pr=>pr.Identity).ThenInclude(i=>i.UniUser)
        .FirstOrDefaultAsync(pr=>pr.Id == requestId) ?? throw new InvalidOperationException("Pending request not found");
        pendingRequest.ReviewedAt = DateTime.UtcNow;
        if(pendingRequest.Identity.Status == "accepted")
        {
            throw new InvalidOperationException("Request has already been accepted");
        }
        if(pendingRequest.Identity.Status == "rejected")
        {
            throw new InvalidOperationException("Cannot accept a request that has already been rejected");
        }
        pendingRequest.Identity.Status = "accepted";
        pendingRequest.Identity.UpdatedAt = DateTime.UtcNow;

        pendingRequest.ReviewedBy = await db.Identities.FirstOrDefaultAsync(ai=>ai.Id == reviewerIdentityId) ?? throw new InvalidOperationException("Reviewer identity not found");
        Institute institute = new Institute
        {
            Name = pendingRequest.InstituteName,
            Country = pendingRequest.InstituteCountry,
            City = pendingRequest.InstituteCity,
            PostalCode = pendingRequest.InstitutePostalCode
        };
        db.Institutes.Add(institute);
        pendingRequest.Identity.UniUser!.Institute = institute;
        await db.SaveChangesAsync();
        return new PendingRequestResponse
        {
            RequestId = pendingRequest.Id,
            Firstname = pendingRequest.Identity.UniUser!.Firstname,
            Lastname = pendingRequest.Identity.UniUser!.Lastname,
            Email = pendingRequest.Identity.Email,
            RequestedAt = pendingRequest.RequestedAt,
            Message = pendingRequest.Message,
            ProofDocumentUrl = pendingRequest.ProofDocumentUrl,
            IdentityDocumentUrl = pendingRequest.IdentityDocumentUrl,
            InstituteName = pendingRequest.InstituteName,
            InstituteCountry = pendingRequest.InstituteCountry,
            InstituteCity = pendingRequest.InstituteCity,
            InstitutePostalCode = pendingRequest.InstitutePostalCode,
            ReviewedAt = pendingRequest.ReviewedAt,
            Status = pendingRequest.Identity.Status!,
            TotalRequestsCount = 1
            
        };

    }




    public async Task<PendingRequestResponse> RejectPendingRequest(Guid requestId, Guid reviewerIdentityId, string? message = null)
    {
        var pendingRequest = await db.PendingJoinRequests.Include(pr=>pr.Identity).ThenInclude(i=>i.UniUser)
        .FirstOrDefaultAsync(pr=>pr.Id == requestId) ?? throw new InvalidOperationException("Pending request not found");
        pendingRequest.ReviewedAt = DateTime.UtcNow;
        if(pendingRequest.Identity.Status == "rejected")
        {
            throw new InvalidOperationException("Request has already been rejected");
        }
        if(pendingRequest.Identity.Status == "accepted")
        {
            throw new InvalidOperationException("Cannot reject a request that has already been accepted");
        }
        pendingRequest.Identity.Status = "rejected";
        pendingRequest.Message = message; 
        pendingRequest.Identity.IsDeleted = true; //soft delete the user since their request was rejected
        pendingRequest.Identity.IsActive = false; //deactivate the user since their request was rejected
        pendingRequest.Identity.DeletedAt = DateTime.UtcNow; //set the deleted at timestamp since the user is being soft deleted
        pendingRequest.Identity.UpdatedAt = DateTime.UtcNow; //update the updated at timestamp since the user's status is being updated
        pendingRequest.ReviewedBy = await db.Identities.FirstOrDefaultAsync(ai=>ai.Id == reviewerIdentityId) ?? throw new InvalidOperationException("Reviewer identity not found");
        
        await db.SaveChangesAsync();
        return new PendingRequestResponse
        {
            RequestId = pendingRequest.Id,
            Firstname = pendingRequest.Identity.UniUser!.Firstname,
            Lastname = pendingRequest.Identity.UniUser!.Lastname,
            Email = pendingRequest.Identity.Email,
            RequestedAt = pendingRequest.RequestedAt,
            Message = pendingRequest.Message,
            ProofDocumentUrl = pendingRequest.ProofDocumentUrl,
            IdentityDocumentUrl = pendingRequest.IdentityDocumentUrl,
            InstituteName = pendingRequest.InstituteName,
            InstituteCountry = pendingRequest.InstituteCountry,
            InstituteCity = pendingRequest.InstituteCity,
            InstitutePostalCode = pendingRequest.InstitutePostalCode,
            ReviewedAt = pendingRequest.ReviewedAt,
            Status = pendingRequest.Identity.Status!,
            TotalRequestsCount = 1
            
        };

    }

}
