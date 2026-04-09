using System;
using Backend.Auth.Entities;

namespace Backend.ProfessorSpace.Entities;

public class ResponseRedactionQuestion
{

    public Guid Id {get;set;}
    public Guid RedactionQuestionId {get;set;}
    public Guid StudentId {get;set;}
    public Student? Student {get;set;}
    public RedactionQuestion? RedactionQuestion {get;set;}
    public required string AnswerText {get;set;} // The answer text provided by the student
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow; 
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public int Score {get;set;} // Score assigned by the professor after grading(for cases where an answer is not correct or incorrect but can be partially correct)
}
