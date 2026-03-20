using System;
using Backend.StudentSpace.DataTransferObjects.Responses;

namespace Backend.StudentSpace.Services;

public interface IStudentService
{
    Task<List<SerializedCourse>> GetAllStudentCourses(Guid studentIdentityId);
    Task AddStudentToClass(Guid studentIdentityId, string classCode);
}
