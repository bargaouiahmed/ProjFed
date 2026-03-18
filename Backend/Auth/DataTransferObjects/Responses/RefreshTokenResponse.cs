using System;

namespace Backend.Auth.DataTransferObjects.Responses;

public class RefreshTokenResponse
{
    public required string AccessToken { get; set; }
}
