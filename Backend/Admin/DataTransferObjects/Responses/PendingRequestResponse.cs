using System;

namespace Backend.Admin.DataTransferObjects.Responses;

public class PendingRequestResponse
{
    public Guid RequestId { get; set; }

    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
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
    public string Status { get; set; } = string.Empty;
    public int? TotalRequestsCount { get; set; }

}
