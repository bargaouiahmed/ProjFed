using System;
using Backend.Auth.Entities;

namespace Backend.ProfessorSpace.Entities;

public class ResponseMCQ
{
    public Guid Id {get;set;}
    public Guid MCQId {get;set;}
    public Guid StudentId {get;set;}
    public Student? Student {get;set;}
    public MCQ? MCQ {get;set;}
    public int SelectedOptionIndex {get;set;} // Index of the option selected by the student
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow; 
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public int Score {get;set;} //for when a question requires multiple options to be correct and the student selects some of them, we can assign a score based on the number of correct options selected and incorrect options selected.

}
