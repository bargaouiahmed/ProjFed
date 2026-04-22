using System;

namespace Backend.StudentSpace.DataTransferObjects.Responses;

public class SerializedCourse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Term { get; set; }
    public string ProfessorLastname { get; set; } = string.Empty;
    public string ProfessorFirstname { get; set; } = string.Empty;
    public List<SerializedChapter> Chapters { get; set; } = [];
    public List<SerializedExam> Exams { get; set; } = [];
    public List<SerializedTest> Tests { get; set; } = [];
}
