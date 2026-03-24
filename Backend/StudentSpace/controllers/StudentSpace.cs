using System.Security.Claims;
using Backend.StudentSpace.DataTransferObjects.Responses;
using Backend.StudentSpace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.StudentSpace.controllers
{
    [Route("api/v0/student")]
    [ApiController]
    [Authorize(Roles = "student")]

    public class StudentSpaceController(IStudentService isService) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<List<SerializedCourse>>> GetAllStudentCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Forbid("You're not authorized to access this resource.");
            }
            try
            {
                return Ok(await isService.GetAllStudentCourses(Guid.Parse(userId)));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("course/add")]
        public async Task<ActionResult> AddStudentToClass([FromQuery] string classCode)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Forbid("You're not authorized to access this resource.");
            }
            try
            {
                await isService.AddStudentToClass(Guid.Parse(userId), classCode);
                return Ok("Student added to class successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

