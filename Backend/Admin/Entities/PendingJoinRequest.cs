using System;
using Backend.Auth.Entities;

namespace Backend.Admin.Entities;

public class PendingJoinRequest
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public AuthIdentity Identity { get; set; } = new();

    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public string? Message { get; set; }
    public string ProofDocumentUrl { get; set; } = string.Empty;
    public string IdentityDocumentUrl { get; set; } = string.Empty;
    //data for the institute which will be created if the request is accepted
    public string InstituteName { get; set; } = string.Empty;
    public string InstituteCountry { get; set; } = string.Empty;
    public string InstituteCity { get; set; } = string.Empty;
    public string InstitutePostalCode { get; set; } = string.Empty;
    public DateTime? ReviewedAt { get; set; }
    public Guid? IdentityReviewedBy { get; set; }
    public AuthIdentity? ReviewedBy { get; set; }
}
