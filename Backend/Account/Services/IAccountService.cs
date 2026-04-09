using System;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;

namespace Backend.Account.Services;

public interface IAccountService
{

    public Task<SerializedUser> GetUserByIdAsync(GetUserByIdRequest request);
    public Task<SerializedUser> UpdateAccountAsync(UpdateAccountRequest request, Guid identityId, string role);
    public Task<List<SerializedNotification>> GetNotificationsAsync(Guid identityId);
    public Task<List<SerializedUniStaffInvitation>> GetUniStaffInvitationsAsync(Guid identityId);
    public Task AcceptUniStaffInvitationAsync(Guid identityId, Guid invitationId);
    public Task RejectUniStaffInvitationAsync(Guid identityId, Guid invitationId);
    public Task<List<SerializedProfessorInvitation>> GetProfessorInvitationsAsync(Guid identityId);
    public Task AcceptProfessorInvitationAsync(Guid identityId, Guid invitationId);
    public Task RejectProfessorInvitationAsync(Guid identityId, Guid invitationId);
}
