using System;
using Microsoft.AspNetCore.Http;

namespace Backend.ProfessorSpace.DataTransferObjects.Requests;

public class UpdateRedactionQuestionRequest
{
    public Guid Id { get; set; }
    public string? QuestionText { get; set; }
    public int? QuestionMark { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}
