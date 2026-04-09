using System;
using Backend.Auth.Entities;

namespace Backend.ProfessorSpace.Entities;

public class ResponseTestRedactionQuestion
{
    public Guid Id { get; set; }
    public Guid TestRedactionQuestionId { get; set; }
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    public TestRedactionQuestion? TestRedactionQuestion { get; set; }
    public required string AnswerText { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int Score { get; set; }
}
