using System;

namespace Backend.ProfessorSpace.Entities;

public class MCQ
{
    public Guid Id {get;set;}
    public Guid ExamId {get;set;}
    public Exam? Exam {get;set;}
    public required string QuestionText {get;set;}
    public required string Options {get;set;} // Comma-separated list of options
    public required string CorrectOptions {get;set;} // Comma-separated list of correct options (e.g., "A,C")
    public int QuestionMark { get; set; }
    public string? Explanation {get;set;} // Optional explanation for the correct answer
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow; 
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public string? AttachmentUrls {get;set;} // Comma-separated list of attachment URLs

}
