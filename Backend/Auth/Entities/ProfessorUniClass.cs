using System;

namespace Backend.Auth.Entities;

public class ProfessorUniClass
{
    public Guid Id { get; set; }
    public Guid ProfId { get; set; }
    public Professor Prof { get; set; } = new();
    public Guid UniClassId { get; set; }
    public UniClass UniClass { get; set; } = new();
    public int Semester { get; set; }


}
