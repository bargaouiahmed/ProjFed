using System;

namespace Backend.ProfessorSpace.DataTransferObjects.Responses;

public class SerializedAssessmentGrade
{
    public Guid AssessmentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string AssessmentType { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalMarks { get; set; }
    public decimal NormalizedScoreOn20 { get; set; }
}
