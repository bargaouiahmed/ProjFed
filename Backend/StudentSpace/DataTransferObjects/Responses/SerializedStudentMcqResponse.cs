namespace Backend.StudentSpace.DataTransferObjects.Responses;

public class SerializedStudentMcqResponse
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public int SelectedOptionIndex { get; set; }
    public int Score { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
