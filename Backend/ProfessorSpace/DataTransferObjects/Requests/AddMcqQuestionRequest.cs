using Microsoft.AspNetCore.Http;

namespace Backend.ProfessorSpace.DataTransferObjects.Requests;

public class AddMcqQuestionRequest
{
    public string QuestionText { get; set; } = string.Empty;
    public string Options { get; set; } = string.Empty;
    public string CorrectOptions { get; set; } = string.Empty;
    public int QuestionMark { get; set; }
    public string? Explanation { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}
