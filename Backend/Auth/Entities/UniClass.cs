using System;
using Humanizer;

namespace Backend.Auth.Entities;

public class UniClass
{
    public Guid Id { get; set; }

    public Guid MetadataId { get; set; }
    public ClassMetadata Metadata { get; set; } = new();

    public int Number { get; set; }

    public int Semester { get; set; }
    public ICollection<ProfessorUniClass> Professors { get; set; } = [];
    public ICollection<Student> Students { get; set; } = [];
    public string ClassCode { get; set; } = string.Empty;
}
