using System;
using Microsoft.AspNetCore.Http;

namespace Backend.ProfessorSpace.DataTransferObjects.Requests;

public class UpdateMcqQuestionRequest
{
    public Guid Id { get; set; }
    public string? QuestionText { get; set; }
    public string? Options { get; set; }
    public string? CorrectOptions { get; set; }
    public int? QuestionMark { get; set; }
    public string? Explanation { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}
