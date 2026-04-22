using System.Security.Claims;
using Backend.StudentSpace.DataTransferObjects.Requests;
using Backend.StudentSpace.DataTransferObjects.Responses;
using Backend.StudentSpace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.StudentSpace.Controllers
{
    [Route("api/v0/student")]
    [ApiController]
    [Authorize(Roles = "student")]
    public class StudentSpaceController(IStudentService isService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<SerializedCourse>>> GetAllStudentCourses()
            => await Execute(() => isService.GetAllStudentCourses(GetStudentIdentityId()));

        [HttpGet("courses/{courseId:guid}")]
        public async Task<ActionResult<SerializedCourse>> GetCourse([FromRoute] Guid courseId)
            => await Execute(() => isService.GetStudentCourse(GetStudentIdentityId(), courseId));

        [HttpGet("courses/{courseId:guid}/chapters")]
        public async Task<ActionResult<List<SerializedChapter>>> GetCourseChapters([FromRoute] Guid courseId)
            => await Execute(() => isService.GetCourseChapters(GetStudentIdentityId(), courseId));

        [HttpGet("chapters/{chapterId:guid}")]
        public async Task<ActionResult<SerializedChapter>> GetChapter([FromRoute] Guid chapterId)
            => await Execute(() => isService.GetChapter(GetStudentIdentityId(), chapterId));

        [HttpGet("courses/{courseId:guid}/exams")]
        public async Task<ActionResult<List<SerializedExam>>> GetCourseExams([FromRoute] Guid courseId)
            => await Execute(() => isService.GetCourseExams(GetStudentIdentityId(), courseId));

        [HttpGet("exams/{examId:guid}")]
        public async Task<ActionResult<SerializedExam>> GetExam([FromRoute] Guid examId)
            => await Execute(() => isService.GetExam(GetStudentIdentityId(), examId));

        [HttpGet("courses/{courseId:guid}/tests")]
        public async Task<ActionResult<List<SerializedTest>>> GetCourseTests([FromRoute] Guid courseId)
            => await Execute(() => isService.GetCourseTests(GetStudentIdentityId(), courseId));

        [HttpGet("tests/{testId:guid}")]
        public async Task<ActionResult<SerializedTest>> GetTest([FromRoute] Guid testId)
            => await Execute(() => isService.GetTest(GetStudentIdentityId(), testId));

        [HttpPut("exams/mcqs/response")]
        public async Task<ActionResult<SerializedStudentMcqResponse>> SubmitExamMcqResponse([FromBody] SubmitMcqResponseRequest request)
            => await Execute(() => isService.SubmitExamMcqResponse(GetStudentIdentityId(), request));

        [HttpPut("exams/redaction-questions/response")]
        public async Task<ActionResult<SerializedStudentRedactionResponse>> SubmitExamRedactionResponse([FromBody] SubmitRedactionResponseRequest request)
            => await Execute(() => isService.SubmitExamRedactionResponse(GetStudentIdentityId(), request));

        [HttpPut("tests/mcqs/response")]
        public async Task<ActionResult<SerializedStudentMcqResponse>> SubmitTestMcqResponse([FromBody] SubmitMcqResponseRequest request)
            => await Execute(() => isService.SubmitTestMcqResponse(GetStudentIdentityId(), request));

        [HttpPut("tests/redaction-questions/response")]
        public async Task<ActionResult<SerializedStudentRedactionResponse>> SubmitTestRedactionResponse([FromBody] SubmitRedactionResponseRequest request)
            => await Execute(() => isService.SubmitTestRedactionResponse(GetStudentIdentityId(), request));


        [HttpPost("course/add")]
        public async Task<ActionResult> AddStudentToClass([FromQuery] string classCode)
            => await ExecuteNoContent(async () =>
            {
                await isService.AddStudentToClass(GetStudentIdentityId(), classCode);
            }, "Student added to class successfully.");

        private Guid GetStudentIdentityId()
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

        private async Task<ActionResult> ExecuteNoContent(Func<Task> action, string? okMessage = null)
        {
            try
            {
                await action();
                if (okMessage != null)
                {
                    return Ok(okMessage);
                }
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

