using System.Security.Claims;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;
using Backend.Account.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Account.Controllers
{
    [Route("api/v0/accounts")]
    [ApiController]
    public class AccountController(IAccountService accountService) : ControllerBase
    {
        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<SerializedUser>> GetUserById()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (userId==null || role == null)
            {
                return Unauthorized("Invalid token: missing user ID or role claim.");
            }
            try
            {
                GetUserByIdRequest request = new()
                {
                    UserId = Guid.Parse(userId),
                    Role = role
                };
                var user = await accountService.GetUserByIdAsync(request);
                return Ok(user);
            }
            catch (InvalidOperationException)
            {
                return NotFound("User not found.");
            }
        }



    }
}
