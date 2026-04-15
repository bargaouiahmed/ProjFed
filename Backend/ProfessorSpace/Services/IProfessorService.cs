using System;
using Backend.Account.DataTransferObjects.Responses;
using Backend.ProfessorSpace.DataTransferObjects.Requests;
using Backend.ProfessorSpace.DataTransferObjects.Responses;

namespace Backend.ProfessorSpace.Services;

public interface IProfessorService
{
    Task<SerializedChapter> InitializeChapter(Guid professorIdentityId, Guid courseId);
    Task<List<SerializedChapter>> GetCourseChapters(Guid professorIdentityId, Guid courseId);
    Task<SerializedChapter> GetChapter(Guid professorIdentityId, Guid chapterId);
    Task<SerializedChapter> UpdateChapter(Guid professorIdentityId, UpdateChapterRequest request);
    Task DeleteChapter(Guid professorIdentityId, Guid chapterId);
    Task<ListSerializedCourse> GetProfessorCourses(Guid professorIdentityId, int pageNumber=1, int pageSize=10);
    Task<SerializedExam> InitializeExam(Guid professorIdentityId, Guid courseId);
    Task<List<SerializedExam>> GetCourseExams(Guid professorIdentityId, Guid courseId);
    Task<SerializedExam> GetExam(Guid professorIdentityId, Guid examId);
    Task<SerializedExam> UpdateExam(Guid professorIdentityId, UpdateAssessmentRequest request);
    Task DeleteExam(Guid professorIdentityId, Guid examId);
    Task<SerializedMcqQuestion> AddMcqToExam(Guid professorIdentityId, Guid examId, AddMcqQuestionRequest request);
    Task<SerializedMcqQuestion> UpdateExamMcq(Guid professorIdentityId, UpdateMcqQuestionRequest request);
    Task DeleteExamMcq(Guid professorIdentityId, Guid mcqId);
    Task<SerializedRedactionQuestion> AddRedactionQuestionToExam(Guid professorIdentityId, Guid examId, AddRedactionQuestionRequest request);
    Task<SerializedRedactionQuestion> UpdateExamRedactionQuestion(Guid professorIdentityId, UpdateRedactionQuestionRequest request);
    Task DeleteExamRedactionQuestion(Guid professorIdentityId, Guid questionId);

    Task<SerializedTest> InitializeTest(Guid professorIdentityId, Guid courseId);
    Task<List<SerializedTest>> GetCourseTests(Guid professorIdentityId, Guid courseId);
    Task<SerializedTest> GetTest(Guid professorIdentityId, Guid testId);
    Task<SerializedTest> UpdateTest(Guid professorIdentityId, UpdateAssessmentRequest request);
    Task DeleteTest(Guid professorIdentityId, Guid testId);
    Task<SerializedMcqQuestion> AddMcqToTest(Guid professorIdentityId, Guid testId, AddMcqQuestionRequest request);
    Task<SerializedMcqQuestion> UpdateTestMcq(Guid professorIdentityId, UpdateMcqQuestionRequest request);
    Task DeleteTestMcq(Guid professorIdentityId, Guid mcqId);
    Task<SerializedRedactionQuestion> AddRedactionQuestionToTest(Guid professorIdentityId, Guid testId, AddRedactionQuestionRequest request);
    Task<SerializedRedactionQuestion> UpdateTestRedactionQuestion(Guid professorIdentityId, UpdateRedactionQuestionRequest request);
    Task DeleteTestRedactionQuestion(Guid professorIdentityId, Guid questionId);
    public Task<ListSerializedProfessorInvitation> GetProfessorInvitation(Guid professorIdentityId, int pageNumber, int pageSize);
    Task<List<SerializedStudentGradeSummary>> GetCourseStudentsAndGrades(Guid professorIdentityId, Guid courseId);
    Task GradeExamMcqResponse(Guid professorIdentityId, Guid responseId, int score);
    Task GradeExamRedactionResponse(Guid professorIdentityId, Guid responseId, int score);
    Task GradeTestMcqResponse(Guid professorIdentityId, Guid responseId, int score);
    Task GradeTestRedactionResponse(Guid professorIdentityId, Guid responseId, int score);
}
