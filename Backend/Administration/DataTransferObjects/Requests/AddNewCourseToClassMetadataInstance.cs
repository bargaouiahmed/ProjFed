using System;

namespace Backend.Administration.DataTransferObjects.Requests;

public class AddNewCourseToClassMetadataInstance
{
    public required string CourseName { get; set; }
    public required int Term { get; set; }
    public string? Description { get; set; }
    
}
