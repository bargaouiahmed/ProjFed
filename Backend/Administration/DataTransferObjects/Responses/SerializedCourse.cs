using System;

namespace Backend.Administration.DataTransferObjects.Responses;

public class SerializedCourse
{
    public Guid Id{get;set;}
    public string CourseName{get;set;}="";
    public string? Description{get;set;}
    public int Term{get;set;}
    public int StudentCount{get;set;}
}
