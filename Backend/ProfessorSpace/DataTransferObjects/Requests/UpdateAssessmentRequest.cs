using System;

namespace Backend.ProfessorSpace.DataTransferObjects.Requests;

public class UpdateAssessmentRequest
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? TotalMarks { get; set; }
}
