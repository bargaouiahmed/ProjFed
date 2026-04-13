using System;

namespace Backend.Administration.DataTransferObjects.Responses;

public class SerializedUniStaffInvitationForAdministration
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public string StaffEmail { get; set; } = string.Empty;
    public Guid InstituteId { get; set; }
    public string InstituteName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime InvitedAt { get; set; }
}
