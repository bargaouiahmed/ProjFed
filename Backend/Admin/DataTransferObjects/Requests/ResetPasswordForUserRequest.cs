using System;

namespace Backend.Admin.DataTransferObjects.Requests;

public class ResetPasswordForUserRequest
{
    public Guid IdentityId { get; set; }
    public required string NewPassword { get; set; }
}
