namespace Backend.StudentSpace.DataTransferObjects.Requests;

public class SubmitRedactionResponseRequest
{
    public Guid QuestionId { get; set; }
    public string AnswerText { get; set; } = string.Empty;
}
