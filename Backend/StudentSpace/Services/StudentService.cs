using Backend.Auth.Entities;
using Backend.Database.Auth;
using Backend.ProfessorSpace.Entities;
using Backend.StudentSpace.DataTransferObjects.Requests;
using Backend.StudentSpace.DataTransferObjects.Responses;
using Backend.StudentSpace.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.StudentSpace.Services;

public class StudentService(AppDbContext db) : IStudentService
{
    public async Task<List<SerializedCourse>> GetAllStudentCourses(Guid studentIdentityId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var courses = await GetStudentCurrentTermCourses(student);

        List<SerializedCourse> result = [];
        foreach (var course in courses)
        {
            result.Add(await BuildCourseResponse(course));
        }

        return result;
    }

    public async Task<SerializedCourse> GetStudentCourse(Guid studentIdentityId, Guid courseId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var course = await EnsureStudentCanAccessCourse(student, courseId);
        return await BuildCourseResponse(course);
    }

    public async Task<List<SerializedChapter>> GetCourseChapters(Guid studentIdentityId, Guid courseId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        _ = await EnsureStudentCanAccessCourse(student, courseId);
        var chapters = await db.Chapters.Where(c => c.CourseId == courseId).OrderBy(c => c.CreatedAt).ToListAsync();
        return [.. chapters.Select(MapChapter)];
    }

    public async Task<SerializedChapter> GetChapter(Guid studentIdentityId, Guid chapterId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var chapter = await db.Chapters.Include(c => c.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(c => c.Id == chapterId) ?? throw new InvalidOperationException("Chapter not found.");
        _ = await EnsureStudentCanAccessCourse(student, chapter.CourseId);
        return MapChapter(chapter);
    }

    public async Task<List<SerializedExam>> GetCourseExams(Guid studentIdentityId, Guid courseId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        _ = await EnsureStudentCanAccessCourse(student, courseId);
        var exams = await db.Exams.Where(e => e.CourseId == courseId).OrderBy(e => e.CreatedAt).ToListAsync();
        List<SerializedExam> result = [];
        foreach (var exam in exams)
        {
            result.Add(await BuildExamResponse(exam));
        }
        return result;
    }

    public async Task<SerializedExam> GetExam(Guid studentIdentityId, Guid examId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var exam = await db.Exams.Include(e => e.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(e => e.Id == examId) ?? throw new InvalidOperationException("Exam not found.");
        _ = await EnsureStudentCanAccessCourse(student, exam.CourseId);
        return await BuildExamResponse(exam);
    }

    public async Task<List<SerializedTest>> GetCourseTests(Guid studentIdentityId, Guid courseId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        _ = await EnsureStudentCanAccessCourse(student, courseId);
        var tests = await db.Tests.Where(t => t.CourseId == courseId).OrderBy(t => t.CreatedAt).ToListAsync();
        List<SerializedTest> result = [];
        foreach (var test in tests)
        {
            result.Add(await BuildTestResponse(test));
        }
        return result;
    }

    public async Task<SerializedTest> GetTest(Guid studentIdentityId, Guid testId)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var test = await db.Tests.Include(t => t.Course).ThenInclude(c => c!.Professor)
            .FirstOrDefaultAsync(t => t.Id == testId) ?? throw new InvalidOperationException("Test not found.");
        _ = await EnsureStudentCanAccessCourse(student, test.CourseId);
        return await BuildTestResponse(test);
    }

    public async Task<SerializedStudentMcqResponse> SubmitExamMcqResponse(Guid studentIdentityId, SubmitMcqResponseRequest request)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var question = await db.MCQs.Include(m => m.Exam).ThenInclude(e => e!.Course)
            .FirstOrDefaultAsync(m => m.Id == request.QuestionId) ?? throw new InvalidOperationException("Exam MCQ question not found.");
        _ = await EnsureStudentCanAccessCourse(student, question.Exam!.CourseId);

        var response = await db.ResponseMCQs.FirstOrDefaultAsync(r => r.MCQId == request.QuestionId && r.StudentId == student.Id);
        if (response == null)
        {
            response = new ResponseMCQ
            {
                MCQId = request.QuestionId,
                StudentId = student.Id,
                SelectedOptionIndex = request.SelectedOptionIndex,
                Score = ComputeMcqScore(question.CorrectOptions, request.SelectedOptionIndex, question.QuestionMark)
            };
            db.ResponseMCQs.Add(response);
        }
        else
        {
            response.SelectedOptionIndex = request.SelectedOptionIndex;
            response.Score = ComputeMcqScore(question.CorrectOptions, request.SelectedOptionIndex, question.QuestionMark);
            response.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return MapStudentMcqResponse(response, request.QuestionId);
    }

    public async Task<SerializedStudentRedactionResponse> SubmitExamRedactionResponse(Guid studentIdentityId, SubmitRedactionResponseRequest request)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var question = await db.RedactionQuestions.Include(q => q.Exam).ThenInclude(e => e!.Course)
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId) ?? throw new InvalidOperationException("Exam redaction question not found.");
        _ = await EnsureStudentCanAccessCourse(student, question.Exam!.CourseId);

        var response = await db.ResponseRedactionQuestions.FirstOrDefaultAsync(r => r.RedactionQuestionId == request.QuestionId && r.StudentId == student.Id);
        if (response == null)
        {
            response = new ResponseRedactionQuestion
            {
                RedactionQuestionId = request.QuestionId,
                StudentId = student.Id,
                AnswerText = request.AnswerText,
                Score = 0
            };
            db.ResponseRedactionQuestions.Add(response);
        }
        else
        {
            response.AnswerText = request.AnswerText;
            response.Score = 0;
            response.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return MapStudentRedactionResponse(response, request.QuestionId);
    }

    public async Task<SerializedStudentMcqResponse> SubmitTestMcqResponse(Guid studentIdentityId, SubmitMcqResponseRequest request)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var question = await db.TestMCQs.Include(m => m.Test).ThenInclude(t => t!.Course)
            .FirstOrDefaultAsync(m => m.Id == request.QuestionId) ?? throw new InvalidOperationException("Test MCQ question not found.");
        _ = await EnsureStudentCanAccessCourse(student, question.Test!.CourseId);

        var response = await db.ResponseTestMCQs.FirstOrDefaultAsync(r => r.TestMCQId == request.QuestionId && r.StudentId == student.Id);
        if (response == null)
        {
            response = new ResponseTestMCQ
            {
                TestMCQId = request.QuestionId,
                StudentId = student.Id,
                SelectedOptionIndex = request.SelectedOptionIndex,
                Score = ComputeMcqScore(question.CorrectOptions, request.SelectedOptionIndex, question.QuestionMark)
            };
            db.ResponseTestMCQs.Add(response);
        }
        else
        {
            response.SelectedOptionIndex = request.SelectedOptionIndex;
            response.Score = ComputeMcqScore(question.CorrectOptions, request.SelectedOptionIndex, question.QuestionMark);
            response.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return MapStudentMcqResponse(response, request.QuestionId);
    }

    public async Task<SerializedStudentRedactionResponse> SubmitTestRedactionResponse(Guid studentIdentityId, SubmitRedactionResponseRequest request)
    {
        var student = await GetStudentWithClass(studentIdentityId);
        var question = await db.TestRedactionQuestions.Include(q => q.Test).ThenInclude(t => t!.Course)
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId) ?? throw new InvalidOperationException("Test redaction question not found.");
        _ = await EnsureStudentCanAccessCourse(student, question.Test!.CourseId);

        var response = await db.ResponseTestRedactionQuestions.FirstOrDefaultAsync(r => r.TestRedactionQuestionId == request.QuestionId && r.StudentId == student.Id);
        if (response == null)
        {
            response = new ResponseTestRedactionQuestion
            {
                TestRedactionQuestionId = request.QuestionId,
                StudentId = student.Id,
                AnswerText = request.AnswerText,
                Score = 0
            };
            db.ResponseTestRedactionQuestions.Add(response);
        }
        else
        {
            response.AnswerText = request.AnswerText;
            response.Score = 0;
            response.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return MapStudentRedactionResponse(response, request.QuestionId);
    }

    public async Task AddStudentToClass(Guid studentIdentityId, string classCode)
    {
        var uniClass = await db.UniClasses.Include(c => c.Students)
            .FirstOrDefaultAsync(c => c.ClassCode == classCode) ?? throw new InvalidOperationException("Invalid class code");
        var student = await db.Students.FirstOrDefaultAsync(s => s.IdentityId == studentIdentityId)
            ?? throw new InvalidOperationException("student not found");
        if (student.UniClassId == uniClass.Id) throw new InvalidOperationException("Student already belongs to this class");
        if (student.UniClassId != null) throw new InvalidOperationException("Student already belongs to a class");

        student.UniClassId = uniClass.Id;
        await db.SaveChangesAsync();
    }

    private async Task<Student> GetStudentWithClass(Guid studentIdentityId)
    {
        return await db.Students
            .Include(s => s.UniClass)
            .ThenInclude(uc => uc!.Metadata)
            .FirstOrDefaultAsync(s => s.IdentityId == studentIdentityId) ?? throw new InvalidOperationException("student not found");
    }

    private async Task<List<Course>> GetStudentCurrentTermCourses(Student student)
    {
        var currentTerm = student.UniClass?.Metadata?.CurrentTerm ?? throw new InvalidOperationException("Student class metadata not found");
        return await db.Courses
            .Include(c => c.Professor)
            .Where(c => c.UniClassId == student.UniClassId && c.Term == currentTerm)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    private async Task<Course> EnsureStudentCanAccessCourse(Student student, Guid courseId)
    {
        var currentTerm = student.UniClass?.Metadata?.CurrentTerm ?? throw new InvalidOperationException("Student class metadata not found");
        var course = await db.Courses.Include(c => c.Professor).FirstOrDefaultAsync(c => c.Id == courseId)
            ?? throw new InvalidOperationException("Course not found.");

        if (student.UniClassId == null || course.UniClassId != student.UniClassId || course.Term != currentTerm)
        {
            throw new InvalidOperationException("You are not authorized to access this course.");
        }

        return course;
    }

    private async Task<SerializedCourse> BuildCourseResponse(Course course)
    {
        var chapters = await db.Chapters.Where(c => c.CourseId == course.Id).OrderBy(c => c.CreatedAt).ToListAsync();
        var exams = await db.Exams.Where(e => e.CourseId == course.Id).OrderBy(e => e.CreatedAt).ToListAsync();
        var tests = await db.Tests.Where(t => t.CourseId == course.Id).OrderBy(t => t.CreatedAt).ToListAsync();

        List<SerializedExam> serializedExams = [];
        foreach (var exam in exams)
        {
            serializedExams.Add(await BuildExamResponse(exam));
        }

        List<SerializedTest> serializedTests = [];
        foreach (var test in tests)
        {
            serializedTests.Add(await BuildTestResponse(test));
        }

        return new SerializedCourse
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description,
            Term = course.Term,
            ProfessorFirstname = course.Professor?.Firstname ?? string.Empty,
            ProfessorLastname = course.Professor?.Lastname ?? string.Empty,
            Chapters = [.. chapters.Select(MapChapter)],
            Exams = serializedExams,
            Tests = serializedTests
        };
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

    private static SerializedMcqQuestion MapMcq(MCQ question) => new()
    {
        Id = question.Id,
        QuestionText = question.QuestionText,
        Options = question.Options,
        QuestionMark = question.QuestionMark,
        AttachmentUrls = question.AttachmentUrls,
        CreatedAt = question.CreatedAt,
        UpdatedAt = question.UpdatedAt
    };

    private static SerializedMcqQuestion MapMcq(TestMCQ question) => new()
    {
        Id = question.Id,
        QuestionText = question.QuestionText,
        Options = question.Options,
        QuestionMark = question.QuestionMark,
        AttachmentUrls = question.AttachmentUrls,
        CreatedAt = question.CreatedAt,
        UpdatedAt = question.UpdatedAt
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

    private static SerializedStudentMcqResponse MapStudentMcqResponse(ResponseMCQ response, Guid questionId) => new()
    {
        Id = response.Id,
        QuestionId = questionId,
        SelectedOptionIndex = response.SelectedOptionIndex,
        Score = response.Score,
        CreatedAt = response.CreatedAt,
        UpdatedAt = response.UpdatedAt
    };

    private static SerializedStudentMcqResponse MapStudentMcqResponse(ResponseTestMCQ response, Guid questionId) => new()
    {
        Id = response.Id,
        QuestionId = questionId,
        SelectedOptionIndex = response.SelectedOptionIndex,
        Score = response.Score,
        CreatedAt = response.CreatedAt,
        UpdatedAt = response.UpdatedAt
    };

    private static SerializedStudentRedactionResponse MapStudentRedactionResponse(ResponseRedactionQuestion response, Guid questionId) => new()
    {
        Id = response.Id,
        QuestionId = questionId,
        AnswerText = response.AnswerText,
        Score = response.Score,
        CreatedAt = response.CreatedAt,
        UpdatedAt = response.UpdatedAt
    };

    private static SerializedStudentRedactionResponse MapStudentRedactionResponse(ResponseTestRedactionQuestion response, Guid questionId) => new()
    {
        Id = response.Id,
        QuestionId = questionId,
        AnswerText = response.AnswerText,
        Score = response.Score,
        CreatedAt = response.CreatedAt,
        UpdatedAt = response.UpdatedAt
    };

    private static int ComputeMcqScore(string correctOptions, int selectedOptionIndex, int questionMark)
    {
        return IsSelectionCorrect(correctOptions, selectedOptionIndex) ? questionMark : 0;
    }

    private static bool IsSelectionCorrect(string correctOptions, int selectedOptionIndex)
    {
        if (selectedOptionIndex < 0 || string.IsNullOrWhiteSpace(correctOptions))
        {
            return false;
        }

        var tokens = correctOptions.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        foreach (var token in tokens)
        {
            if (int.TryParse(token, out var parsedIndex))
            {
                if (parsedIndex == selectedOptionIndex || (parsedIndex > 0 && parsedIndex - 1 == selectedOptionIndex))
                {
                    return true;
                }
                continue;
            }

            if (token.Length == 1 && char.IsLetter(token[0]))
            {
                var letterIndex = char.ToUpperInvariant(token[0]) - 'A';
                if (letterIndex == selectedOptionIndex)
                {
                    return true;
                }
            }
        }

        return false;
    }
}
