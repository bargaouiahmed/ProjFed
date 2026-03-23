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
    [Authorize(Roles = "uni_admin,uni_user")]
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
    }
}
