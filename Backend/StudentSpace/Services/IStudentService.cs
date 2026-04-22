using System;
using Backend.StudentSpace.DataTransferObjects.Requests;
using Backend.StudentSpace.DataTransferObjects.Responses;

namespace Backend.StudentSpace.Services;

public interface IStudentService
{
    Task<List<SerializedCourse>> GetAllStudentCourses(Guid studentIdentityId);
    Task<SerializedCourse> GetStudentCourse(Guid studentIdentityId, Guid courseId);
    Task<List<SerializedChapter>> GetCourseChapters(Guid studentIdentityId, Guid courseId);
    Task<SerializedChapter> GetChapter(Guid studentIdentityId, Guid chapterId);
    Task<List<SerializedExam>> GetCourseExams(Guid studentIdentityId, Guid courseId);
    Task<SerializedExam> GetExam(Guid studentIdentityId, Guid examId);
    Task<List<SerializedTest>> GetCourseTests(Guid studentIdentityId, Guid courseId);
    Task<SerializedTest> GetTest(Guid studentIdentityId, Guid testId);
    Task<SerializedStudentMcqResponse> SubmitExamMcqResponse(Guid studentIdentityId, SubmitMcqResponseRequest request);
    Task<SerializedStudentRedactionResponse> SubmitExamRedactionResponse(Guid studentIdentityId, SubmitRedactionResponseRequest request);
    Task<SerializedStudentMcqResponse> SubmitTestMcqResponse(Guid studentIdentityId, SubmitMcqResponseRequest request);
    Task<SerializedStudentRedactionResponse> SubmitTestRedactionResponse(Guid studentIdentityId, SubmitRedactionResponseRequest request);
    Task AddStudentToClass(Guid studentIdentityId, string classCode);
}
