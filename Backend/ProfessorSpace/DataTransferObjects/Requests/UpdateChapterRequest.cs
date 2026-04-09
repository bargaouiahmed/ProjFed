using System;
using Microsoft.AspNetCore.Http;

namespace Backend.ProfessorSpace.DataTransferObjects.Requests;

public class UpdateChapterRequest
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}
