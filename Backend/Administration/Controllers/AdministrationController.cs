using System.Security.Claims;
using Backend.Administration.DataTransferObjects.Requests;
using Backend.Administration.DataTransferObjects.Responses;
using Backend.Administration.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Administration.Controllers
{
    [Route("api/v0/administration")]
    [ApiController]
    [Authorize(Roles = "uni_admin,uni_staff")]
    public class AdministrationController(IAdministrationService admservice) : ControllerBase
    {
        [HttpPost("metadata")]
        public async Task<ActionResult> AddNewClassMetaData([FromBody] NewClassMetaDataRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                await admservice.AddNewClassMetaData(request, Guid.Parse(userId));
                return Ok("Class metadata added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("metadata")]

        public async Task<ActionResult<List<SerializedClassMetaData>>> GetAllClassMetaData([FromQuery] string instituteId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var metadataList = await admservice.GetAllClassMetaData(Guid.Parse(instituteId), Guid.Parse(userId), pageNumber, pageSize);
                return Ok(metadataList);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("professor-invitations")]
        public async Task<ActionResult<List<SerializedProfessorInvitationForAdministration>>> GetAllProfessorInvitations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                return Ok(await admservice.GetAllProfessorInvitations(Guid.Parse(userId)));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("metadata/addClass")]
        public async Task<ActionResult<ClassPrettyName>> AddClassToMetadataType([FromQuery] Guid metadataId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var result = await admservice.AddClassToMetadataType(Guid.Parse(userId), metadataId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("metadata")]
        public async Task<ActionResult<SerializedClassMetaData>> UpdateClassMetaData([FromBody] SerializedClassMetaData request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var result = await admservice.UpdateClassMetaData(request, Guid.Parse(userId));
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "uni_admin")]
        [HttpPost("staff/register")]
        public async Task<ActionResult> RegisterUniStaff([FromBody] RegisterUniStaffRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                await admservice.RegisterUniStaff(Guid.Parse(userId), request);
                return Ok("Staff invitation created successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "uni_admin")]
        [HttpPost("staff/add-existing")]
        public async Task<ActionResult> AddExistingUniStaff([FromBody] AddExistingUniStaffRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                await admservice.AddExistingUniStaff(Guid.Parse(userId), request);
                return Ok("Staff member added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "uni_admin,uni_staff")]
        [HttpPost("courses/{courseId:guid}/professors")]
        public async Task<ActionResult> AddNewProfessor([FromRoute] Guid courseId, [FromBody] AddNewProfessorRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                await admservice.AddNewProfessor(Guid.Parse(userId), courseId, request);
                return Ok("Professor invitation created successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "uni_admin,uni_staff")]
        [HttpPost("courses/{courseId:guid}/professors/add-existing")]
        public async Task<ActionResult> AddExistingProfessor([FromRoute] Guid courseId, [FromBody] AddExistingProfessorRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                await admservice.AddExistingProfessor(Guid.Parse(userId), courseId, request);
                return Ok("Professor assignment processed successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("staff/institute")]
        public async Task<ActionResult<UniId>> GetInstituteIdForStaffMember()
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {                var result = await admservice.GetInstituteIdForStaffMember(userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [HttpPost("classes/{classId:guid}/courses")]
        public async Task<ActionResult> AddCourseToClass([FromRoute] Guid classId, [FromBody] AddNewCourseToClassMetadataInstance request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                await admservice.AddCourseToClass(userId, classId, request);
                return Ok("Course added to class successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("courses/{courseId:guid}/professors")]
        public async Task<ActionResult> RemoveProfessorFromCourse([FromRoute] Guid courseId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                await admservice.RemoveProfessorFromCourse(userId, courseId);
                return Ok("Professor removed from course successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("classes/{classId:guid}/courses")]
        public async Task<ActionResult> RemoveCourseFromClass([FromRoute] Guid classId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                await admservice.RemoveCourseFromClass(userId, classId);
                return Ok("Course removed from class successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("metadata/{metadataId:guid}/increment-term")]
        public async Task<ActionResult<int>> IncrementClassMetadataTerm([FromRoute] Guid metadataId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                var currentTerm = await admservice.IncrementClassMetadataTerm(userId, metadataId);
                return Ok(currentTerm);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
    }
}
