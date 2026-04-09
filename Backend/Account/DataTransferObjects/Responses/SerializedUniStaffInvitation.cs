using System;

namespace Backend.Account.DataTransferObjects.Responses;

public class SerializedUniStaffInvitation
{
    public Guid Id { get; set; }
    public Guid InstituteId { get; set; }
    public string InstituteName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime InvitedAt { get; set; }
}
