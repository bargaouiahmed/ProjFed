using System;

namespace Backend.ProfessorSpace.DataTransferObjects.Responses;

public class SerializedCourse
{
    public Guid Id { get; set; }
    public string Name { get; set; }="";
    public string Description { get; set; }="";
    public int Term { get; set; }
    public Guid UniClassId { get; set; }
    public DateTime CreatedAt { get; set; }
}
public class ListSerializedCourse
{
    public List<SerializedCourse> Courses { get; set; }=new List<SerializedCourse>();
    public int TotalCount { get; set; }
}
