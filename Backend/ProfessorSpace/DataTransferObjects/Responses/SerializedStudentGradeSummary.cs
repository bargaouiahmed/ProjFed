using System;

namespace Backend.ProfessorSpace.DataTransferObjects.Responses;

public class SerializedStudentGradeSummary
{
    public Guid StudentId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public int OverallExamScore { get; set; }
    public int OverallExamTotalMarks { get; set; }
    public decimal OverallExamScoreOn20 { get; set; }
    public int OverallTestScore { get; set; }
    public int OverallTestTotalMarks { get; set; }
    public decimal OverallTestScoreOn20 { get; set; }
    public List<SerializedAssessmentGrade> ExamGrades { get; set; } = [];
    public List<SerializedAssessmentGrade> TestGrades { get; set; } = [];
}
