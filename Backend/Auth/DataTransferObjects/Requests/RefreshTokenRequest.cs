using System;

namespace Backend.Auth.DataTransferObjects.Requests;

public class RefreshTokenRequest
{
    public required string RefreshToken { get; set; }
}
