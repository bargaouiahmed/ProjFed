namespace Backend.StudentSpace.DataTransferObjects.Responses;

public class SerializedStudentRedactionResponse
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public string AnswerText { get; set; } = string.Empty;
    public int Score { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
