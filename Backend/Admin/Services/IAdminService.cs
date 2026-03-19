using System;
using Backend.Admin.DataTransferObjects.Requests;
using Backend.Admin.DataTransferObjects.Responses;

namespace Backend.Admin.Services;

public interface IAdminService
{
    public Task<List<PendingRequestResponse>> GetAllPendingRequestsAsync(int pageNumber=1, int pageSize=10);

    public Task<PendingRequestResponse> AcceptPendingRequest(Guid requestId, Guid reviewerIdentityId);
    public Task<PendingRequestResponse> RejectPendingRequest(Guid requestId, Guid reviewerIdentityId, string? message = null);
    public Task ResetPasswordForUserAsync(ResetPasswordForUserRequest request);
}
