using System.Security.Claims;
using Backend.ProfessorSpace.DataTransferObjects.Requests;
using Backend.ProfessorSpace.DataTransferObjects.Responses;
using Backend.ProfessorSpace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ProfessorSpace.Controllers;

[Route("api/v0/professor")]
[ApiController]
[Authorize(Roles = "professor")]
public class ProfessorSpaceController(IProfessorService professorService) : ControllerBase
{
    [HttpPost("courses/{courseId:guid}/chapters/init")]
    public async Task<ActionResult<SerializedChapter>> InitializeChapter([FromRoute] Guid courseId)
        => await Execute(() => professorService.InitializeChapter(GetProfessorIdentityId(), courseId));

    [HttpGet("courses/{courseId:guid}/chapters")]
    public async Task<ActionResult<List<SerializedChapter>>> GetCourseChapters([FromRoute] Guid courseId)
        => await Execute(() => professorService.GetCourseChapters(GetProfessorIdentityId(), courseId));

    [HttpGet("chapters/{chapterId:guid}")]
    public async Task<ActionResult<SerializedChapter>> GetChapter([FromRoute] Guid chapterId)
        => await Execute(() => professorService.GetChapter(GetProfessorIdentityId(), chapterId));

    [HttpPut("chapters")]
    public async Task<ActionResult<SerializedChapter>> UpdateChapter([FromForm] UpdateChapterRequest request)
        => await Execute(() => professorService.UpdateChapter(GetProfessorIdentityId(), request));

    [HttpDelete("chapters/{chapterId:guid}")]
    public async Task<ActionResult> DeleteChapter([FromRoute] Guid chapterId)
        => await ExecuteNoContent(() => professorService.DeleteChapter(GetProfessorIdentityId(), chapterId));

    [HttpPost("courses/{courseId:guid}/exams/init")]
    public async Task<ActionResult<SerializedExam>> InitializeExam([FromRoute] Guid courseId)
        => await Execute(() => professorService.InitializeExam(GetProfessorIdentityId(), courseId));

    [HttpGet("courses/{courseId:guid}/exams")]
    public async Task<ActionResult<List<SerializedExam>>> GetCourseExams([FromRoute] Guid courseId)
        => await Execute(() => professorService.GetCourseExams(GetProfessorIdentityId(), courseId));

    [HttpGet("exams/{examId:guid}")]
    public async Task<ActionResult<SerializedExam>> GetExam([FromRoute] Guid examId)
        => await Execute(() => professorService.GetExam(GetProfessorIdentityId(), examId));

    [HttpPut("exams")]
    public async Task<ActionResult<SerializedExam>> UpdateExam([FromBody] UpdateAssessmentRequest request)
        => await Execute(() => professorService.UpdateExam(GetProfessorIdentityId(), request));

    [HttpDelete("exams/{examId:guid}")]
    public async Task<ActionResult> DeleteExam([FromRoute] Guid examId)
        => await ExecuteNoContent(() => professorService.DeleteExam(GetProfessorIdentityId(), examId));

    [HttpPost("exams/{examId:guid}/mcqs")]
    public async Task<ActionResult<SerializedMcqQuestion>> AddMcqToExam([FromRoute] Guid examId, [FromForm] AddMcqQuestionRequest request)
        => await Execute(() => professorService.AddMcqToExam(GetProfessorIdentityId(), examId, request));

    [HttpPut("exams/mcqs")]
    public async Task<ActionResult<SerializedMcqQuestion>> UpdateExamMcq([FromForm] UpdateMcqQuestionRequest request)
        => await Execute(() => professorService.UpdateExamMcq(GetProfessorIdentityId(), request));

    [HttpDelete("exams/mcqs/{mcqId:guid}")]
    public async Task<ActionResult> DeleteExamMcq([FromRoute] Guid mcqId)
        => await ExecuteNoContent(() => professorService.DeleteExamMcq(GetProfessorIdentityId(), mcqId));

    [HttpPost("exams/{examId:guid}/redaction-questions")]
    public async Task<ActionResult<SerializedRedactionQuestion>> AddRedactionQuestionToExam([FromRoute] Guid examId, [FromForm] AddRedactionQuestionRequest request)
        => await Execute(() => professorService.AddRedactionQuestionToExam(GetProfessorIdentityId(), examId, request));

    [HttpPut("exams/redaction-questions")]
    public async Task<ActionResult<SerializedRedactionQuestion>> UpdateExamRedactionQuestion([FromForm] UpdateRedactionQuestionRequest request)
        => await Execute(() => professorService.UpdateExamRedactionQuestion(GetProfessorIdentityId(), request));

    [HttpDelete("exams/redaction-questions/{questionId:guid}")]
    public async Task<ActionResult> DeleteExamRedactionQuestion([FromRoute] Guid questionId)
        => await ExecuteNoContent(() => professorService.DeleteExamRedactionQuestion(GetProfessorIdentityId(), questionId));

    [HttpPost("courses/{courseId:guid}/tests/init")]
    public async Task<ActionResult<SerializedTest>> InitializeTest([FromRoute] Guid courseId)
        => await Execute(() => professorService.InitializeTest(GetProfessorIdentityId(), courseId));

    [HttpGet("courses/{courseId:guid}/tests")]
    public async Task<ActionResult<List<SerializedTest>>> GetCourseTests([FromRoute] Guid courseId)
        => await Execute(() => professorService.GetCourseTests(GetProfessorIdentityId(), courseId));

    [HttpGet("tests/{testId:guid}")]
    public async Task<ActionResult<SerializedTest>> GetTest([FromRoute] Guid testId)
        => await Execute(() => professorService.GetTest(GetProfessorIdentityId(), testId));

    [HttpPut("tests")]
    public async Task<ActionResult<SerializedTest>> UpdateTest([FromBody] UpdateAssessmentRequest request)
        => await Execute(() => professorService.UpdateTest(GetProfessorIdentityId(), request));

    [HttpDelete("tests/{testId:guid}")]
    public async Task<ActionResult> DeleteTest([FromRoute] Guid testId)
        => await ExecuteNoContent(() => professorService.DeleteTest(GetProfessorIdentityId(), testId));

    [HttpPost("tests/{testId:guid}/mcqs")]
    public async Task<ActionResult<SerializedMcqQuestion>> AddMcqToTest([FromRoute] Guid testId, [FromForm] AddMcqQuestionRequest request)
        => await Execute(() => professorService.AddMcqToTest(GetProfessorIdentityId(), testId, request));

    [HttpPut("tests/mcqs")]
    public async Task<ActionResult<SerializedMcqQuestion>> UpdateTestMcq([FromForm] UpdateMcqQuestionRequest request)
        => await Execute(() => professorService.UpdateTestMcq(GetProfessorIdentityId(), request));

    [HttpDelete("tests/mcqs/{mcqId:guid}")]
    public async Task<ActionResult> DeleteTestMcq([FromRoute] Guid mcqId)
        => await ExecuteNoContent(() => professorService.DeleteTestMcq(GetProfessorIdentityId(), mcqId));

    [HttpPost("tests/{testId:guid}/redaction-questions")]
    public async Task<ActionResult<SerializedRedactionQuestion>> AddRedactionQuestionToTest([FromRoute] Guid testId, [FromForm] AddRedactionQuestionRequest request)
        => await Execute(() => professorService.AddRedactionQuestionToTest(GetProfessorIdentityId(), testId, request));

    [HttpPut("tests/redaction-questions")]
    public async Task<ActionResult<SerializedRedactionQuestion>> UpdateTestRedactionQuestion([FromForm] UpdateRedactionQuestionRequest request)
        => await Execute(() => professorService.UpdateTestRedactionQuestion(GetProfessorIdentityId(), request));

    [HttpDelete("tests/redaction-questions/{questionId:guid}")]
    public async Task<ActionResult> DeleteTestRedactionQuestion([FromRoute] Guid questionId)
        => await ExecuteNoContent(() => professorService.DeleteTestRedactionQuestion(GetProfessorIdentityId(), questionId));

    [HttpGet("courses/{courseId:guid}/students/grades")]
    public async Task<ActionResult<List<SerializedStudentGradeSummary>>> GetCourseStudentsAndGrades([FromRoute] Guid courseId)
        => await Execute(() => professorService.GetCourseStudentsAndGrades(GetProfessorIdentityId(), courseId));

    [HttpPut("responses/exam-mcqs/{responseId:guid}/grade")]
    public async Task<ActionResult> GradeExamMcqResponse([FromRoute] Guid responseId, [FromBody] GradeQuestionResponseRequest request)
        => await ExecuteNoContent(() => professorService.GradeExamMcqResponse(GetProfessorIdentityId(), responseId, request.Score));

    [HttpPut("responses/exam-redaction-questions/{responseId:guid}/grade")]
    public async Task<ActionResult> GradeExamRedactionResponse([FromRoute] Guid responseId, [FromBody] GradeQuestionResponseRequest request)
        => await ExecuteNoContent(() => professorService.GradeExamRedactionResponse(GetProfessorIdentityId(), responseId, request.Score));

    [HttpPut("responses/test-mcqs/{responseId:guid}/grade")]
    public async Task<ActionResult> GradeTestMcqResponse([FromRoute] Guid responseId, [FromBody] GradeQuestionResponseRequest request)
        => await ExecuteNoContent(() => professorService.GradeTestMcqResponse(GetProfessorIdentityId(), responseId, request.Score));

    [HttpPut("responses/test-redaction-questions/{responseId:guid}/grade")]
    public async Task<ActionResult> GradeTestRedactionResponse([FromRoute] Guid responseId, [FromBody] GradeQuestionResponseRequest request)
        => await ExecuteNoContent(() => professorService.GradeTestRedactionResponse(GetProfessorIdentityId(), responseId, request.Score));

    private Guid GetProfessorIdentityId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            throw new InvalidOperationException("Invalid token: missing user ID claim.");
        }
        return parsedUserId;
    }

    private async Task<ActionResult<T>> Execute<T>(Func<Task<T>> action)
    {
        try
        {
            return Ok(await action());
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private async Task<ActionResult> ExecuteNoContent(Func<Task> action)
    {
        try
        {
            await action();
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
