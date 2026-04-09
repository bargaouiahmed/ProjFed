using System;

namespace Backend.ProfessorSpace.Entities;

public class RedactionQuestion
{
    public Guid Id {get;set;}
    public Guid ExamId {get;set;}
    public Exam? Exam {get;set;}
    public required string QuestionText {get;set;}
    public int QuestionMark { get; set; }
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow; 
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public string? AttachmentUrls {get;set;} // Comma-separated list of attachment URLs

}
