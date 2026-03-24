using System;
using Backend.Auth.Entities;

namespace Backend.StudentSpace.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int Term { get; set; }
    public Guid UniClassId { get; set; }
    public Guid ProfessorId { get; set; }
    public Professor Professor { get; set; } = new();
    public UniClass UniClass { get; set; } = new();


}
