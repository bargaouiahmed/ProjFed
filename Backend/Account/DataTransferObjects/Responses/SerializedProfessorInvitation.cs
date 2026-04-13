using System;

namespace Backend.Account.DataTransferObjects.Responses;

public class SerializedProfessorInvitation
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string ClassPrettyName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime InvitedAt { get; set; }
}
public class ListSerializedProfessorInvitation
{
    public List<SerializedProfessorInvitation> Invitations { get; set; } = new List<SerializedProfessorInvitation>();
    public int TotalCount { get; set; }
}   