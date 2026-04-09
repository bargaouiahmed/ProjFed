using System;
using Backend.StudentSpace.Entities;

namespace Backend.ProfessorSpace.Entities;

public class Test
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course? Course { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TotalMarks { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
