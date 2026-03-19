using System;

namespace Backend.Admin.DataTransferObjects.Requests;

public class ResetPasswordForUserRequest
{
    public required string NewPassword { get; set; }
}
