using Microsoft.AspNetCore.Http;

namespace Backend.ProfessorSpace.DataTransferObjects.Requests;

public class AddRedactionQuestionRequest
{
    public string QuestionText { get; set; } = string.Empty;
    public int QuestionMark { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}
