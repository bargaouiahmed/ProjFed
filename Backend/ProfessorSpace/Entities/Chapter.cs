using System;
using Backend.StudentSpace.Entities;

namespace Backend.ProfessorSpace.Entities;

public class Chapter
{
    public Guid Id {get;set;}
    public Guid CourseId {get;set;}
    public Course? Course {get;set;}


    public required string Title {get;set;}
    public string? AttachmentUrls {get;set;} // Comma-separated list of attachment URLs
    public string? Description {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow; 
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
}
