namespace Backend.StudentSpace.DataTransferObjects.Responses;

public class SerializedExam
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TotalMarks { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<SerializedMcqQuestion> Mcqs { get; set; } = [];
    public List<SerializedRedactionQuestion> RedactionQuestions { get; set; } = [];
}
