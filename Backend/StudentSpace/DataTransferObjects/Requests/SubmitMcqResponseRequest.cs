namespace Backend.StudentSpace.DataTransferObjects.Requests;

public class SubmitMcqResponseRequest
{
    public Guid QuestionId { get; set; }
    public int SelectedOptionIndex { get; set; }
}
