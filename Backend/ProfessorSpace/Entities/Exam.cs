using System;
using System.Security.Cryptography.X509Certificates;
using Backend.StudentSpace.Entities;

namespace Backend.ProfessorSpace.Entities;

public class Exam
{
    public Guid Id {get;set;}
    public Guid CourseId {get;set;}
    public Course? Course {get;set;}
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TotalMarks {get;set;} // will be used to convert the marks to x/20
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
}
