using System;

namespace Backend.ProfessorSpace.Entities;

public class TestMCQ
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public Test? Test { get; set; }
    public required string QuestionText { get; set; }
    public required string Options { get; set; }
    public required string CorrectOptions { get; set; }
    public int QuestionMark { get; set; }
    public string? Explanation { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? AttachmentUrls { get; set; }
}
