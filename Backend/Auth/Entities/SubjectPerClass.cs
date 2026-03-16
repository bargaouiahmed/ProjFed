using System;

namespace Backend.Auth.Entities;

public class SubjectPerClass
{
    public Guid Id { get; set; }
    public string Subject = string.Empty;
    public Guid ClassMetadataId { get; set; }
    public ClassMetadata ClassMetadata { get; set; } = new();
    public int Semester { get; set; }
    public bool IsOptional { get; set; }



}

