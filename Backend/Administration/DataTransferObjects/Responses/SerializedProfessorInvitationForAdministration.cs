using System;

namespace Backend.Administration.DataTransferObjects.Responses;

public class SerializedProfessorInvitationForAdministration
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public string ProfessorEmail { get; set; } = string.Empty;
    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string ClassPrettyName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime InvitedAt { get; set; }
}
