using System.Security.Claims;
using Backend.Account.DataTransferObjects.Responses;
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
        [HttpGet("metadata/{metadataId:guid}/reset-term")]
        public async Task<ActionResult<List<SerializedClassMetaData>>> ResetClassMetadataTerm([FromRoute] Guid metadataId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var metadataList = await admservice.ResetClassMetadataTerm(Guid.Parse(userId), metadataId);
                return Ok(metadataList);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("metadata/{metadataId:guid}/reset-term-paginated")]
        public async Task<ActionResult<List<SerializedClassMetaData>>> ResetClassMetadataTerm([FromRoute] Guid metadataId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var metadataList = await admservice.ResetClassMetadataTerm(Guid.Parse(userId), metadataId, pageNumber, pageSize);
                return Ok(metadataList);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("metadata/{metadataId:guid}/reset-term")]
        public async Task<ActionResult<List<SerializedClassMetaData>>> ResetClassMetadataTermPost([FromRoute] Guid metadataId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var metadataList = await admservice.ResetClassMetadataTerm(Guid.Parse(userId), metadataId);
                return Ok(metadataList);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("metadata/{metadataId:guid}/reset-term-paginated")]
        public async Task<ActionResult<List<SerializedClassMetaData>>> ResetClassMetadataTermPost([FromRoute] Guid metadataId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                var metadataList = await admservice.ResetClassMetadataTerm(Guid.Parse(userId), metadataId, pageNumber, pageSize);
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
        [HttpGet("uni-staff-invitations")]
        public async Task<ActionResult<List<SerializedUniStaffInvitationForAdministration>>> GetAllUniStaffInvitations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                return Ok(await admservice.GetAllUniStaffInvitations(Guid.Parse(userId)));
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

        [Authorize(Roles = "uni_admin")]
        [HttpPost("staff/try-add")]
        public async Task<ActionResult> AddUniStaffToInstitute([FromQuery] string email)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Invalid token: missing user ID claim.");
            }
            try
            {
                await admservice.AddUniStaffToInstitute(Guid.Parse(userId), email);
                return Ok("Staff member added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidDataException)
            {
                return BadRequest("Staff member doesn't exist");
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
        [HttpDelete("courses/{courseId:guid}")]
        public async Task<ActionResult> RemoveCourseFromClass([FromRoute] Guid courseId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                await admservice.RemoveCourseFromClass(userId, courseId);
                return Ok("Course removed from class successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("courses/{courseId:guid}/professors/try-add")]
        public async Task<ActionResult> AddProfessorToCourse([FromRoute] Guid courseId, [FromQuery] string email)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                await admservice.AddProfessorToCourse(userId, courseId, email);
                return Ok("Professor added to course successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch(InvalidDataException )
            {
                return BadRequest("Professor doesn't exist");
            }

        }
        [HttpGet("classes/{classId:guid}/courses")]
        public async Task<ActionResult<List<SerializedCourse>>> GetAllCoursesForClass([FromRoute] Guid classId)
        {            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try            {
                var courses = await admservice.GetAllCoursesForClass(userId, classId);
                return Ok(courses);
            }            catch (InvalidOperationException ex)            {
                return BadRequest(ex.Message);
            }
        }   
        [HttpGet("metadata/{metadataId:guid}/classes")]
        public async Task<ActionResult<List<SerializedUniClass>>> GetAllClassesForMetadata([FromRoute] Guid metadataId)
        {            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try            {
                var classes = await admservice.GetAllClassesForMetadata(userId, metadataId);
                return Ok(classes);
            }            catch (InvalidOperationException ex)            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("institute/users")]
        public async Task<ActionResult<SerializedUserListResponse>> GetAllUsersForInstitute([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                var users = await admservice.GetAllUsersForInstitute(userId, pageNumber, pageSize);
                return Ok(users);
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
        
        [HttpDelete("metadata/{metadataId:guid}")]
        public async Task<ActionResult> DeleteClassMetaData([FromRoute] Guid metadataId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized("Invalid token: missing or invalid user ID claim.");
            }
            try
            {
                await admservice.DeleteClassMetaData(userId, metadataId);
                return Ok("Class metadata deleted successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
