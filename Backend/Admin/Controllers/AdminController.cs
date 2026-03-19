using System.Security.Claims;
using Backend.Admin.DataTransferObjects.Requests;
using Backend.Admin.DataTransferObjects.Responses;
using Backend.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Admin.Controllers
{
    [Authorize(Roles = "admin,super_admin")]
    [Route("api/v0/admin")]
    [ApiController]
    
    public class AdminController(IAdminService adminService) : ControllerBase
    {

        [HttpGet("requests")]
        public async Task<ActionResult<List<PendingRequestResponse>>> GetAllPendingRequests([FromQuery] int pageNumber=1, [FromQuery] int pageSize=10)
        {
            try
            {
                var requests = await adminService.GetAllPendingRequestsAsync(pageNumber, pageSize);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }
        }


        [HttpPut("requests/{requestId}/accept")]
        public async Task<ActionResult<PendingRequestResponse>> AcceptPendingRequest([FromRoute] Guid requestId)
        {
            var reviewerIdentityId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException("Invalid token: missing user ID claim."));
            try
            {
                var request = await adminService.AcceptPendingRequest(requestId, reviewerIdentityId);
                return Ok(request);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }
        }


        [HttpPut("requests/{requestId}/reject")]
        public async Task<ActionResult<PendingRequestResponse>> RejectPendingRequest([FromRoute] Guid requestId, [FromBody] RejectRequest? rejectBody = null)
        {
            var reviewerIdentityId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException("Invalid token: missing user ID claim."));
            try
            {
                var request = await adminService.RejectPendingRequest(requestId, reviewerIdentityId, rejectBody?.Message);
                return Ok(request);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }
        }

    }
}
