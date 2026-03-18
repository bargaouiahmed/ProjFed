using System;

namespace Backend.Auth.DataTransferObjects.Responses;

public class TokenPairResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
