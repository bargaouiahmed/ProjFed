using System;

namespace Backend.Account.DataTransferObjects.Responses;

public class SerializedUser
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? PfpUrl { get; set; }
}
