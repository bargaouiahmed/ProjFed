using System;
using Backend.Account.DataTransferObjects.Responses;
using Backend.Database.Auth;
using Backend.ProfessorSpace.DataTransferObjects.Requests;
using Backend.ProfessorSpace.DataTransferObjects.Responses;
using Backend.ProfessorSpace.Entities;
using Backend.StudentSpace.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.ProfessorSpace.Services;

public class ProfessorService(AppDbContext db, IWebHostEnvironment env) : IProfessorService
{
    public async Task<ListSerializedProfessorInvitation> GetProfessorInvitation(Guid professorIdentityId, int pageNumber, int pageSize)
    {
        var invitations = await db.ProfessorInvitations.Where(i=>i.IdentityId==professorIdentityId)
        .Select(prof=>new SerializedProfessorInvitation{
            Id=prof.Id,
            CourseId=prof.CourseId,
            CourseName=prof.Course != null ? prof.Course.Name : string.Empty,
            ClassPrettyName=prof.ClassPrettyName,
            Status=prof.Status,
            InvitedAt=prof.InvitedAt
        }).OrderByDescending(i=>i.InvitedAt).Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();
        var totalCount = await db.ProfessorInvitations.CountAsync(i=>i.IdentityId==professorIdentityId);
        return new ListSerializedProfessorInvitation{
            Invitations=invitations,
            TotalCount=totalCount
        };
    }
    public async Task<SerializedChapter> InitializeChapter(Guid professorIdentityId, Guid courseId)
    {
        await EnsureProfessorOwnsCourse(professorIdentityId, courseId);
        Chapter chapter = new()
        {
            CourseId = courseId,
            Title = "Untitled chapter"
        };
        db.Chapters.Add(chapter);
        await db.SaveChangesAsync();
        return MapChapter(chapter);
    }

    public async Task<List<SerializedChapter>> GetCourseChapters(Guid professorIdentityId, Guid courseId)
    {
        await EnsureProfessorOwnsCourse(professorIdentityId, courseId);
        var chapters = await db.Chapters.Where(c => c.CourseId == courseId).OrderBy(c => c.CreatedAt).ToListAsync();
        return [.. chapters.Select(MapChapter)];
    }

    public async Task<SerializedChapter> GetChapter(Guid professorIdentityId, Guid chapterId)
    {
        var chapter = await GetChapterEntity(professorIdentityId, chapterId);
        return MapChapter(chapter);
    }

    public async Task<SerializedChapter> UpdateChapter(Guid professorIdentityId, UpdateChapterRequest request)
    {
        var chapter = await GetChapterEntity(professorIdentityId, request.Id);
        if (request.Title != null) chapter.Title = request.Title;
        if (request.Description != null) chapter.Description = request.Description;
        if (request.Attachments != null && request.Attachments.Count != 0) chapter.AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "chapters");
        chapter.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapChapter(chapter);
    }

    public async Task DeleteChapter(Guid professorIdentityId, Guid chapterId)
    {
        var chapter = await GetChapterEntity(professorIdentityId, chapterId);
        db.Chapters.Remove(chapter);
        await db.SaveChangesAsync();
    }

    public async Task<SerializedExam> InitializeExam(Guid professorIdentityId, Guid courseId)
    {
        await EnsureProfessorOwnsCourse(professorIdentityId, courseId);
        Exam exam = new()
        {
            CourseId = courseId,
            Title = "Untitled exam"
        };
        db.Exams.Add(exam);
        await db.SaveChangesAsync();
        return await GetExam(professorIdentityId, exam.Id);
    }

    public async Task<List<SerializedExam>> GetCourseExams(Guid professorIdentityId, Guid courseId)
    {
        await EnsureProfessorOwnsCourse(professorIdentityId, courseId);
        var exams = await db.Exams.Where(e => e.CourseId == courseId).OrderBy(e => e.CreatedAt).ToListAsync();
        List<SerializedExam> serializedExams = [];
        foreach (var exam in exams)
        {
            serializedExams.Add(await BuildExamResponse(exam));
        }
        return serializedExams;
    }

    public async Task<SerializedExam> GetExam(Guid professorIdentityId, Guid examId)
    {
        var exam = await GetExamEntity(professorIdentityId, examId);
        return await BuildExamResponse(exam);
    }

    public async Task<SerializedExam> UpdateExam(Guid professorIdentityId, UpdateAssessmentRequest request)
    {
        var exam = await GetExamEntity(professorIdentityId, request.Id);
        if (request.Title != null) exam.Title = request.Title;
        if (request.Description != null) exam.Description = request.Description;
        if (request.TotalMarks.HasValue) exam.TotalMarks = request.TotalMarks.Value;
        exam.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await BuildExamResponse(exam);
    }

    public async Task DeleteExam(Guid professorIdentityId, Guid examId)
    {
        var exam = await GetExamEntity(professorIdentityId, examId);
        db.Exams.Remove(exam);
        await db.SaveChangesAsync();
    }

    public async Task<SerializedMcqQuestion> AddMcqToExam(Guid professorIdentityId, Guid examId, AddMcqQuestionRequest request)
    {
        _ = await GetExamEntity(professorIdentityId, examId);
        MCQ mcq = new()
        {
            ExamId = examId,
            QuestionText = request.QuestionText,
            Options = request.Options,
            CorrectOptions = request.CorrectOptions,
            QuestionMark = request.QuestionMark,
            Explanation = request.Explanation,
            AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "exam-mcqs")
        };
        db.MCQs.Add(mcq);
        await db.SaveChangesAsync();
        return MapMcq(mcq);
    }

    public async Task<SerializedMcqQuestion> UpdateExamMcq(Guid professorIdentityId, UpdateMcqQuestionRequest request)
    {
        var mcq = await db.MCQs.Include(m => m.Exam).ThenInclude(e => e!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(m => m.Id == request.Id) ?? throw new InvalidOperationException("MCQ not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, mcq.Exam?.Course);
        if (request.QuestionText != null) mcq.QuestionText = request.QuestionText;
        if (request.Options != null) mcq.Options = request.Options;
        if (request.CorrectOptions != null) mcq.CorrectOptions = request.CorrectOptions;
        if (request.QuestionMark.HasValue) mcq.QuestionMark = request.QuestionMark.Value;
        if (request.Explanation != null) mcq.Explanation = request.Explanation;
        if (request.Attachments != null && request.Attachments.Count != 0) mcq.AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "exam-mcqs");
        mcq.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapMcq(mcq);
    }

    public async Task DeleteExamMcq(Guid professorIdentityId, Guid mcqId)
    {
        var mcq = await db.MCQs.Include(m => m.Exam).ThenInclude(e => e!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(m => m.Id == mcqId) ?? throw new InvalidOperationException("MCQ not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, mcq.Exam?.Course);
        db.MCQs.Remove(mcq);
        await db.SaveChangesAsync();
    }

    public async Task<SerializedRedactionQuestion> AddRedactionQuestionToExam(Guid professorIdentityId, Guid examId, AddRedactionQuestionRequest request)
    {
        _ = await GetExamEntity(professorIdentityId, examId);
        RedactionQuestion question = new()
        {
            ExamId = examId,
            QuestionText = request.QuestionText,
            QuestionMark = request.QuestionMark,
            AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "exam-redaction-questions")
        };
        db.RedactionQuestions.Add(question);
        await db.SaveChangesAsync();
        return MapRedactionQuestion(question);
    }

    public async Task<SerializedRedactionQuestion> UpdateExamRedactionQuestion(Guid professorIdentityId, UpdateRedactionQuestionRequest request)
    {
        var question = await db.RedactionQuestions.Include(r => r.Exam).ThenInclude(e => e!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == request.Id) ?? throw new InvalidOperationException("Redaction question not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, question.Exam?.Course);
        if (request.QuestionText != null) question.QuestionText = request.QuestionText;
        if (request.QuestionMark.HasValue) question.QuestionMark = request.QuestionMark.Value;
        if (request.Attachments != null && request.Attachments.Count != 0) question.AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "exam-redaction-questions");
        question.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapRedactionQuestion(question);
    }

    public async Task DeleteExamRedactionQuestion(Guid professorIdentityId, Guid questionId)
    {
        var question = await db.RedactionQuestions.Include(r => r.Exam).ThenInclude(e => e!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == questionId) ?? throw new InvalidOperationException("Redaction question not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, question.Exam?.Course);
        db.RedactionQuestions.Remove(question);
        await db.SaveChangesAsync();
    }

    public async Task<SerializedTest> InitializeTest(Guid professorIdentityId, Guid courseId)
    {
        await EnsureProfessorOwnsCourse(professorIdentityId, courseId);
        Test test = new()
        {
            CourseId = courseId,
            Title = "Untitled test"
        };
        db.Tests.Add(test);
        await db.SaveChangesAsync();
        return await GetTest(professorIdentityId, test.Id);
    }

    public async Task<List<SerializedTest>> GetCourseTests(Guid professorIdentityId, Guid courseId)
    {
        await EnsureProfessorOwnsCourse(professorIdentityId, courseId);
        var tests = await db.Tests.Where(t => t.CourseId == courseId).OrderBy(t => t.CreatedAt).ToListAsync();
        List<SerializedTest> serializedTests = [];
        foreach (var test in tests)
        {
            serializedTests.Add(await BuildTestResponse(test));
        }
        return serializedTests;
    }

    public async Task<SerializedTest> GetTest(Guid professorIdentityId, Guid testId)
    {
        var test = await GetTestEntity(professorIdentityId, testId);
        return await BuildTestResponse(test);
    }

    public async Task<SerializedTest> UpdateTest(Guid professorIdentityId, UpdateAssessmentRequest request)
    {
        var test = await GetTestEntity(professorIdentityId, request.Id);
        if (request.Title != null) test.Title = request.Title;
        if (request.Description != null) test.Description = request.Description;
        if (request.TotalMarks.HasValue) test.TotalMarks = request.TotalMarks.Value;
        test.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await BuildTestResponse(test);
    }

    public async Task DeleteTest(Guid professorIdentityId, Guid testId)
    {
        var test = await GetTestEntity(professorIdentityId, testId);
        db.Tests.Remove(test);
        await db.SaveChangesAsync();
    }

    public async Task<SerializedMcqQuestion> AddMcqToTest(Guid professorIdentityId, Guid testId, AddMcqQuestionRequest request)
    {
        _ = await GetTestEntity(professorIdentityId, testId);
        TestMCQ mcq = new()
        {
            TestId = testId,
            QuestionText = request.QuestionText,
            Options = request.Options,
            CorrectOptions = request.CorrectOptions,
            QuestionMark = request.QuestionMark,
            Explanation = request.Explanation,
            AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "test-mcqs")
        };
        db.TestMCQs.Add(mcq);
        await db.SaveChangesAsync();
        return MapMcq(mcq);
    }

    public async Task<SerializedMcqQuestion> UpdateTestMcq(Guid professorIdentityId, UpdateMcqQuestionRequest request)
    {
        var mcq = await db.TestMCQs.Include(m => m.Test).ThenInclude(t => t!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(m => m.Id == request.Id) ?? throw new InvalidOperationException("Test MCQ not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, mcq.Test?.Course);
        if (request.QuestionText != null) mcq.QuestionText = request.QuestionText;
        if (request.Options != null) mcq.Options = request.Options;
        if (request.CorrectOptions != null) mcq.CorrectOptions = request.CorrectOptions;
        if (request.QuestionMark.HasValue) mcq.QuestionMark = request.QuestionMark.Value;
        if (request.Explanation != null) mcq.Explanation = request.Explanation;
        if (request.Attachments != null && request.Attachments.Count != 0) mcq.AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "test-mcqs");
        mcq.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapMcq(mcq);
    }

    public async Task DeleteTestMcq(Guid professorIdentityId, Guid mcqId)
    {
        var mcq = await db.TestMCQs.Include(m => m.Test).ThenInclude(t => t!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(m => m.Id == mcqId) ?? throw new InvalidOperationException("Test MCQ not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, mcq.Test?.Course);
        db.TestMCQs.Remove(mcq);
        await db.SaveChangesAsync();
    }

    public async Task<SerializedRedactionQuestion> AddRedactionQuestionToTest(Guid professorIdentityId, Guid testId, AddRedactionQuestionRequest request)
    {
        _ = await GetTestEntity(professorIdentityId, testId);
        TestRedactionQuestion question = new()
        {
            TestId = testId,
            QuestionText = request.QuestionText,
            QuestionMark = request.QuestionMark,
            AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "test-redaction-questions")
        };
        db.TestRedactionQuestions.Add(question);
        await db.SaveChangesAsync();
        return MapRedactionQuestion(question);
    }

    public async Task<SerializedRedactionQuestion> UpdateTestRedactionQuestion(Guid professorIdentityId, UpdateRedactionQuestionRequest request)
    {
        var question = await db.TestRedactionQuestions.Include(r => r.Test).ThenInclude(t => t!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == request.Id) ?? throw new InvalidOperationException("Test redaction question not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, question.Test?.Course);
        if (request.QuestionText != null) question.QuestionText = request.QuestionText;
        if (request.QuestionMark.HasValue) question.QuestionMark = request.QuestionMark.Value;
        if (request.Attachments != null && request.Attachments.Count != 0) question.AttachmentUrls = await SaveAttachmentsAsync(request.Attachments, "test-redaction-questions");
        question.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapRedactionQuestion(question);
    }

    public async Task DeleteTestRedactionQuestion(Guid professorIdentityId, Guid questionId)
    {
        var question = await db.TestRedactionQuestions.Include(r => r.Test).ThenInclude(t => t!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == questionId) ?? throw new InvalidOperationException("Test redaction question not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, question.Test?.Course);
        db.TestRedactionQuestions.Remove(question);
        await db.SaveChangesAsync();
    }

    public async Task<List<SerializedStudentGradeSummary>> GetCourseStudentsAndGrades(Guid professorIdentityId, Guid courseId)
    {
        var course = await db.Courses.Include(c => c.Professor).Include(c => c.UniClass).ThenInclude(uc => uc!.Students)
            .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new InvalidOperationException("Course not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, course);

        var students = course.UniClass?.Students.ToList() ?? [];
        var studentIds = students.Select(s => s.Id).ToHashSet();
        var exams = await db.Exams.Where(e => e.CourseId == courseId).OrderBy(e => e.CreatedAt).ToListAsync();
        var tests = await db.Tests.Where(t => t.CourseId == courseId).OrderBy(t => t.CreatedAt).ToListAsync();
        var examIds = exams.Select(e => e.Id).ToHashSet();
        var testIds = tests.Select(t => t.Id).ToHashSet();

        var mcqs = await db.MCQs.Where(m => examIds.Contains(m.ExamId)).ToListAsync();
        var redactions = await db.RedactionQuestions.Where(r => examIds.Contains(r.ExamId)).ToListAsync();
        var testMcqs = await db.TestMCQs.Where(m => testIds.Contains(m.TestId)).ToListAsync();
        var testRedactions = await db.TestRedactionQuestions.Where(r => testIds.Contains(r.TestId)).ToListAsync();

        var mcqExamMap = mcqs.ToDictionary(m => m.Id, m => m.ExamId);
        var redactionExamMap = redactions.ToDictionary(r => r.Id, r => r.ExamId);
        var testMcqMap = testMcqs.ToDictionary(m => m.Id, m => m.TestId);
        var testRedactionMap = testRedactions.ToDictionary(r => r.Id, r => r.TestId);
        var mcqIds = mcqs.Select(m => m.Id).ToHashSet();
        var redactionIds = redactions.Select(r => r.Id).ToHashSet();
        var testMcqIds = testMcqs.Select(m => m.Id).ToHashSet();
        var testRedactionIds = testRedactions.Select(r => r.Id).ToHashSet();

        var examMcqResponses = await db.ResponseMCQs.Where(r => studentIds.Contains(r.StudentId) && mcqIds.Contains(r.MCQId)).ToListAsync();
        var examRedactionResponses = await db.ResponseRedactionQuestions.Where(r => studentIds.Contains(r.StudentId) && redactionIds.Contains(r.RedactionQuestionId)).ToListAsync();
        var testMcqResponses = await db.ResponseTestMCQs.Where(r => studentIds.Contains(r.StudentId) && testMcqIds.Contains(r.TestMCQId)).ToListAsync();
        var testRedactionResponses = await db.ResponseTestRedactionQuestions.Where(r => studentIds.Contains(r.StudentId) && testRedactionIds.Contains(r.TestRedactionQuestionId)).ToListAsync();

        List<SerializedStudentGradeSummary> result = [];
        foreach (var student in students)
        {
            var examGrades = exams.Select(exam => new SerializedAssessmentGrade
            {
                AssessmentId = exam.Id,
                Title = exam.Title,
                AssessmentType = "exam",
                Score = examMcqResponses.Where(r => r.StudentId == student.Id && mcqExamMap[r.MCQId] == exam.Id).Sum(r => r.Score)
                    + examRedactionResponses.Where(r => r.StudentId == student.Id && redactionExamMap[r.RedactionQuestionId] == exam.Id).Sum(r => r.Score),
                TotalMarks = exam.TotalMarks,
                NormalizedScoreOn20 = NormalizeScoreOn20(
                    examMcqResponses.Where(r => r.StudentId == student.Id && mcqExamMap[r.MCQId] == exam.Id).Sum(r => r.Score)
                    + examRedactionResponses.Where(r => r.StudentId == student.Id && redactionExamMap[r.RedactionQuestionId] == exam.Id).Sum(r => r.Score),
                    exam.TotalMarks)
            }).ToList();

            var testGrades = tests.Select(test => new SerializedAssessmentGrade
            {
                AssessmentId = test.Id,
                Title = test.Title,
                AssessmentType = "test",
                Score = testMcqResponses.Where(r => r.StudentId == student.Id && testMcqMap[r.TestMCQId] == test.Id).Sum(r => r.Score)
                    + testRedactionResponses.Where(r => r.StudentId == student.Id && testRedactionMap[r.TestRedactionQuestionId] == test.Id).Sum(r => r.Score),
                TotalMarks = test.TotalMarks,
                NormalizedScoreOn20 = NormalizeScoreOn20(
                    testMcqResponses.Where(r => r.StudentId == student.Id && testMcqMap[r.TestMCQId] == test.Id).Sum(r => r.Score)
                    + testRedactionResponses.Where(r => r.StudentId == student.Id && testRedactionMap[r.TestRedactionQuestionId] == test.Id).Sum(r => r.Score),
                    test.TotalMarks)
            }).ToList();

            result.Add(new SerializedStudentGradeSummary
            {
                StudentId = student.Id,
                Firstname = student.Firstname,
                Lastname = student.Lastname,
                OverallExamScore = examGrades.Sum(g => g.Score),
                OverallExamTotalMarks = examGrades.Sum(g => g.TotalMarks),
                OverallExamScoreOn20 = NormalizeScoreOn20(examGrades.Sum(g => g.Score), examGrades.Sum(g => g.TotalMarks)),
                OverallTestScore = testGrades.Sum(g => g.Score),
                OverallTestTotalMarks = testGrades.Sum(g => g.TotalMarks),
                OverallTestScoreOn20 = NormalizeScoreOn20(testGrades.Sum(g => g.Score), testGrades.Sum(g => g.TotalMarks)),
                ExamGrades = examGrades,
                TestGrades = testGrades
            });
        }

        return result;
    }
    public async Task<ListSerializedCourse> GetProfessorCourses(Guid professorIdentityId, int pageNumber=1, int pageSize=10)
    {
        return new ListSerializedCourse
        {
            
          Courses = await db.Courses.AsNoTracking().Where(c => c.Professor != null && c.Professor.IdentityId == professorIdentityId) 
        .Select(c => new SerializedCourse
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description ?? string.Empty,
            Term = c.Term,
            UniClassId = c.UniClassId,
            CreatedAt = c.CreatedAt})
            .OrderByDescending(c => c.CreatedAt).Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync(),
            TotalCount = await db.Courses.CountAsync(c => c.Professor != null && c.Professor.IdentityId == professorIdentityId)
        };
        }
    public async Task GradeExamMcqResponse(Guid professorIdentityId, Guid responseId, int score)
    {
        var response = await db.ResponseMCQs.Include(r => r.MCQ).ThenInclude(m => m!.Exam).ThenInclude(e => e!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == responseId) ?? throw new InvalidOperationException("Exam MCQ response not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, response.MCQ?.Exam?.Course);
        response.Score = score;
        response.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task GradeExamRedactionResponse(Guid professorIdentityId, Guid responseId, int score)
    {
        var response = await db.ResponseRedactionQuestions.Include(r => r.RedactionQuestion).ThenInclude(q => q!.Exam).ThenInclude(e => e!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == responseId) ?? throw new InvalidOperationException("Exam redaction response not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, response.RedactionQuestion?.Exam?.Course);
        response.Score = score;
        response.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task GradeTestMcqResponse(Guid professorIdentityId, Guid responseId, int score)
    {
        var response = await db.ResponseTestMCQs.Include(r => r.TestMCQ).ThenInclude(m => m!.Test).ThenInclude(t => t!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == responseId) ?? throw new InvalidOperationException("Test MCQ response not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, response.TestMCQ?.Test?.Course);
        response.Score = score;
        response.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task GradeTestRedactionResponse(Guid professorIdentityId, Guid responseId, int score)
    {
        var response = await db.ResponseTestRedactionQuestions.Include(r => r.TestRedactionQuestion).ThenInclude(q => q!.Test).ThenInclude(t => t!.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(r => r.Id == responseId) ?? throw new InvalidOperationException("Test redaction response not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, response.TestRedactionQuestion?.Test?.Course);
        response.Score = score;
        response.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    private async Task<Course> EnsureProfessorOwnsCourse(Guid professorIdentityId, Guid courseId)
    {
        var course = await db.Courses.Include(c => c.Professor).Include(c => c.UniClass).ThenInclude(uc => uc!.Students)
            .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new InvalidOperationException("Course not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, course);
        return course;
    }

    private static void EnsureProfessorOwnsProfessorResource(Guid professorIdentityId, Course? course)
    {
        if (course?.Professor == null || course.Professor.IdentityId != professorIdentityId)
        {
            throw new InvalidOperationException("You are not authorized to manage this course.");
        }
    }

    private async Task<Chapter> GetChapterEntity(Guid professorIdentityId, Guid chapterId)
    {
        var chapter = await db.Chapters.Include(c => c.Course).ThenInclude(course => course!.Professor)
            .FirstOrDefaultAsync(c => c.Id == chapterId) ?? throw new InvalidOperationException("Chapter not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, chapter.Course);
        return chapter;
    }

    private async Task<Exam> GetExamEntity(Guid professorIdentityId, Guid examId)
    {
        var exam = await db.Exams.Include(e => e.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(e => e.Id == examId) ?? throw new InvalidOperationException("Exam not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, exam.Course);
        return exam;
    }

    private async Task<Test> GetTestEntity(Guid professorIdentityId, Guid testId)
    {
        var test = await db.Tests.Include(t => t.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(t => t.Id == testId) ?? throw new InvalidOperationException("Test not found.");
        EnsureProfessorOwnsProfessorResource(professorIdentityId, test.Course);
        return test;
    }

    private async Task<SerializedExam> BuildExamResponse(Exam exam)
    {
        var mcqs = await db.MCQs.Where(m => m.ExamId == exam.Id).OrderBy(m => m.CreatedAt).ToListAsync();
        var redactionQuestions = await db.RedactionQuestions.Where(r => r.ExamId == exam.Id).OrderBy(r => r.CreatedAt).ToListAsync();
        return new SerializedExam
        {
            Id = exam.Id,
            CourseId = exam.CourseId,
            Title = exam.Title,
            Description = exam.Description,
            TotalMarks = exam.TotalMarks,
            CreatedAt = exam.CreatedAt,
            UpdatedAt = exam.UpdatedAt,
            Mcqs = [.. mcqs.Select(MapMcq)],
            RedactionQuestions = [.. redactionQuestions.Select(MapRedactionQuestion)]
        };
    }

    private async Task<SerializedTest> BuildTestResponse(Test test)
    {
        var mcqs = await db.TestMCQs.Where(m => m.TestId == test.Id).OrderBy(m => m.CreatedAt).ToListAsync();
        var redactionQuestions = await db.TestRedactionQuestions.Where(r => r.TestId == test.Id).OrderBy(r => r.CreatedAt).ToListAsync();
        return new SerializedTest
        {
            Id = test.Id,
            CourseId = test.CourseId,
            Title = test.Title,
            Description = test.Description,
            TotalMarks = test.TotalMarks,
            CreatedAt = test.CreatedAt,
            UpdatedAt = test.UpdatedAt,
            Mcqs = [.. mcqs.Select(MapMcq)],
            RedactionQuestions = [.. redactionQuestions.Select(MapRedactionQuestion)]
        };
    }

    private static SerializedChapter MapChapter(Chapter chapter) => new()
    {
        Id = chapter.Id,
        CourseId = chapter.CourseId,
        Title = chapter.Title,
        Description = chapter.Description,
        AttachmentUrls = chapter.AttachmentUrls,
        CreatedAt = chapter.CreatedAt,
        UpdatedAt = chapter.UpdatedAt
    };

    private static SerializedMcqQuestion MapMcq(MCQ mcq) => new()
    {
        Id = mcq.Id,
        QuestionText = mcq.QuestionText,
        Options = mcq.Options,
        CorrectOptions = mcq.CorrectOptions,
        QuestionMark = mcq.QuestionMark,
        Explanation = mcq.Explanation,
        AttachmentUrls = mcq.AttachmentUrls,
        CreatedAt = mcq.CreatedAt,
        UpdatedAt = mcq.UpdatedAt
    };

    private static SerializedMcqQuestion MapMcq(TestMCQ mcq) => new()
    {
        Id = mcq.Id,
        QuestionText = mcq.QuestionText,
        Options = mcq.Options,
        CorrectOptions = mcq.CorrectOptions,
        QuestionMark = mcq.QuestionMark,
        Explanation = mcq.Explanation,
        AttachmentUrls = mcq.AttachmentUrls,
        CreatedAt = mcq.CreatedAt,
        UpdatedAt = mcq.UpdatedAt
    };

    private static SerializedRedactionQuestion MapRedactionQuestion(RedactionQuestion question) => new()
    {
        Id = question.Id,
        QuestionText = question.QuestionText,
        QuestionMark = question.QuestionMark,
        AttachmentUrls = question.AttachmentUrls,
        CreatedAt = question.CreatedAt,
        UpdatedAt = question.UpdatedAt
    };

    private static SerializedRedactionQuestion MapRedactionQuestion(TestRedactionQuestion question) => new()
    {
        Id = question.Id,
        QuestionText = question.QuestionText,
        QuestionMark = question.QuestionMark,
        AttachmentUrls = question.AttachmentUrls,
        CreatedAt = question.CreatedAt,
        UpdatedAt = question.UpdatedAt
    };

    private static decimal NormalizeScoreOn20(int score, int totalMarks)
    {
        if (totalMarks <= 0)
        {
            return 0m;
        }

        return Math.Round((decimal)score * 20m / totalMarks, 2);
    }

    private async Task<string?> SaveAttachmentsAsync(List<IFormFile>? attachments, string folderName)
    {
        if (attachments == null || attachments.Count == 0)
        {
            return null;
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".pdf" };
        var webRootPath = env.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
        }

        var relativeUploadDir = Path.Combine("uploads", "professor-space", folderName);
        var uploadDir = Path.Combine(webRootPath, relativeUploadDir);
        Directory.CreateDirectory(uploadDir);

        List<string> urls = [];
        foreach (var attachment in attachments)
        {
            var extension = Path.GetExtension(attachment.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Unsupported attachment type. Only images and pdf files are allowed.");
            }
            if (attachment.Length > 25 * 1024 * 1024)
            {
                throw new InvalidOperationException("Attachment size limit exceeded. Make sure each file is less than 25MB.");
            }

            var filename = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadDir, filename);
            using var stream = new FileStream(filePath, FileMode.Create);
            await attachment.CopyToAsync(stream);
            urls.Add("/" + Path.Combine(relativeUploadDir, filename).Replace("\\", "/"));
        }

        return string.Join(",", urls);
    }
}
