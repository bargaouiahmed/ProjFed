using System;
using Backend.Auth.Entities;
using Backend.StudentSpace.Entities;

namespace Backend.Administration.Entities;

public class ProfessorInvitation
{
    public Guid Id{get;set;}
    public Guid IdentityId{get;set;}
    public AuthIdentity Identity {get;set;} = new();

    public Guid CourseId{get;set;}
    public Course Course{get;set;} = new();
    public DateTime InvitedAt {get;set;}=DateTime.UtcNow;

    public string ClassPrettyName{get;set;}=string.Empty;
    public string Status{get;set;} = "pending"; //"pending","accepted","rejected"
}
