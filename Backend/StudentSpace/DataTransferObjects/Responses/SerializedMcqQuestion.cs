namespace Backend.StudentSpace.DataTransferObjects.Responses;

public class SerializedMcqQuestion
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string Options { get; set; } = string.Empty;
    public int QuestionMark { get; set; }
    public string? AttachmentUrls { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
