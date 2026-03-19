using System;

namespace Backend.Auth.Entities;

public class ProfessorUniClassSubject
{
    public Guid Id { get; set; }
    public Guid ProfId { get; set; }
    public Professor Prof { get; set; } = new();
    public Guid UniClassId { get; set; }
    public UniClass UniClass { get; set; } = new();
    public Guid SubjectPerClassId{get;set;}
    public SubjectPerClass SubjectPerClass { get; set; } = new();


}
