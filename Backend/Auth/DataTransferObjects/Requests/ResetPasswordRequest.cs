using System;

namespace Backend.Auth.DataTransferObjects.Requests;

public class ResetPasswordRequest
{
    public required Guid IdentityId { get; set; }
    public required string ResetToken { get; set; }
    public required string NewPassword { get; set; }

}
