using System;
using Backend.Database.Auth;
using Backend.ProfessorSpace.DataTransferObjects.Responses;
using Backend.StudentSpace.DataTransferObjects.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.StudentSpace.Services;

public class StudentService(AppDbContext db) : IStudentService
{

    //implement a method to get all courses of a student
    public async Task<List<SerializedCourse>> GetAllStudentCourses(Guid studentIdentityId)
    {
        var student = await db.Students
            .Include(s => s.UniClass)
            .ThenInclude(uc => uc!.Metadata)
            .FirstOrDefaultAsync(s => s.IdentityId == studentIdentityId) ?? throw new InvalidOperationException("student not found");

        var currentTerm = student.UniClass?.Metadata?.CurrentTerm ?? throw new InvalidOperationException("Student class metadata not found");

        var courses = await db.Courses
            .Include(c => c.UniClass)
            .ThenInclude(unic => unic!.Students)
            .Include(c => c.Professor)
            .Where(c => c.UniClass!.Students.Any(s => s.IdentityId == studentIdentityId) && c.Term == currentTerm)
            .ToListAsync();

        var courseIds = courses.Select(c => c.Id).ToHashSet();
        var chapters = await db.Chapters.Where(ch => courseIds.Contains(ch.CourseId)).OrderBy(ch => ch.CreatedAt).ToListAsync();
        var exams = await db.Exams.Where(ex => courseIds.Contains(ex.CourseId)).OrderBy(ex => ex.CreatedAt).ToListAsync();
        var tests = await db.Tests.Where(t => courseIds.Contains(t.CourseId)).OrderBy(t => t.CreatedAt).ToListAsync();
        var examIds = exams.Select(ex => ex.Id).ToHashSet();
        var testIds = tests.Select(t => t.Id).ToHashSet();
        var examMcqs = await db.MCQs.Where(m => examIds.Contains(m.ExamId)).OrderBy(m => m.CreatedAt).ToListAsync();
        var examRedactions = await db.RedactionQuestions.Where(r => examIds.Contains(r.ExamId)).OrderBy(r => r.CreatedAt).ToListAsync();
        var testMcqs = await db.TestMCQs.Where(m => testIds.Contains(m.TestId)).OrderBy(m => m.CreatedAt).ToListAsync();
        var testRedactions = await db.TestRedactionQuestions.Where(r => testIds.Contains(r.TestId)).OrderBy(r => r.CreatedAt).ToListAsync();

        return [.. courses.Select(c =>
        {
            return new SerializedCourse
            {
                Id = c.Id,
                Name=c.Name,
                Description=c.Description,
                Term = c.Term,
                ProfessorFirstname=c.Professor?.Firstname ?? string.Empty,
                ProfessorLastname=c.Professor?.Lastname ?? string.Empty,
                Chapters = [.. chapters.Where(ch => ch.CourseId == c.Id).Select(ch => new SerializedChapter
                {
                    Id = ch.Id,
                    CourseId = ch.CourseId,
                    Title = ch.Title,
                    Description = ch.Description,
                    AttachmentUrls = ch.AttachmentUrls,
                    CreatedAt = ch.CreatedAt,
                    UpdatedAt = ch.UpdatedAt
                })],
                Exams = [.. exams.Where(ex => ex.CourseId == c.Id).Select(ex => new SerializedExam
                {
                    Id = ex.Id,
                    CourseId = ex.CourseId,
                    Title = ex.Title,
                    Description = ex.Description,
                    TotalMarks = ex.TotalMarks,
                    CreatedAt = ex.CreatedAt,
                    UpdatedAt = ex.UpdatedAt,
                    Mcqs = [.. examMcqs.Where(m => m.ExamId == ex.Id).Select(m => new SerializedMcqQuestion
                    {
                        Id = m.Id,
                        QuestionText = m.QuestionText,
                        Options = m.Options,
                        CorrectOptions = m.CorrectOptions,
                        QuestionMark = m.QuestionMark,
                        Explanation = m.Explanation,
                        AttachmentUrls = m.AttachmentUrls,
                        CreatedAt = m.CreatedAt,
                        UpdatedAt = m.UpdatedAt
                    })],
                    RedactionQuestions = [.. examRedactions.Where(r => r.ExamId == ex.Id).Select(r => new SerializedRedactionQuestion
                    {
                        Id = r.Id,
                        QuestionText = r.QuestionText,
                        QuestionMark = r.QuestionMark,
                        AttachmentUrls = r.AttachmentUrls,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt
                    })]
                })],
                Tests = [.. tests.Where(t => t.CourseId == c.Id).Select(t => new SerializedTest
                {
                    Id = t.Id,
                    CourseId = t.CourseId,
                    Title = t.Title,
                    Description = t.Description,
                    TotalMarks = t.TotalMarks,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Mcqs = [.. testMcqs.Where(m => m.TestId == t.Id).Select(m => new SerializedMcqQuestion
                    {
                        Id = m.Id,
                        QuestionText = m.QuestionText,
                        Options = m.Options,
                        CorrectOptions = m.CorrectOptions,
                        QuestionMark = m.QuestionMark,
                        Explanation = m.Explanation,
                        AttachmentUrls = m.AttachmentUrls,
                        CreatedAt = m.CreatedAt,
                        UpdatedAt = m.UpdatedAt
                    })],
                    RedactionQuestions = [.. testRedactions.Where(r => r.TestId == t.Id).Select(r => new SerializedRedactionQuestion
                    {
                        Id = r.Id,
                        QuestionText = r.QuestionText,
                        QuestionMark = r.QuestionMark,
                        AttachmentUrls = r.AttachmentUrls,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt
                    })]
                })]
            };
        })];

    }
    public async Task AddStudentToClass(Guid studentIdentityId, string classCode)
    {
        var uniClass = await db.UniClasses.Include(c => c.Students).FirstOrDefaultAsync(c => c.ClassCode == classCode) ?? throw new InvalidOperationException("Invalid class code");
        var student = await db.Students.FirstOrDefaultAsync(s => s.IdentityId == studentIdentityId) ?? throw new InvalidOperationException("student not found");
        uniClass.Students.Add(student);
        await db.SaveChangesAsync();
    }
















}
