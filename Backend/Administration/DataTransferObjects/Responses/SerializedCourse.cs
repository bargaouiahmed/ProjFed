using System;

namespace Backend.Administration.DataTransferObjects.Responses;

public class SerializedCourse
{
    public Guid Id{get;set;}
    public string CourseName{get;set;}="";
    public string? Description{get;set;}
    public int Term{get;set;}
    public int StudentCount{get;set;}
    public string CourseProfessorEmail{get;set;}="";
    public string CourseProfessorFirstname{get;set;}="";
    public string CourseProfessorLastname{get;set;}="";
    public string? CourseProfessorPfpUrl{get;set;}
}
