using System.Security.Claims;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;
using Backend.Account.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

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


        [Authorize]
        [HttpPut]
        public async Task<ActionResult<SerializedUser>> UpdateUserAsync([FromForm] UpdateAccountRequest request)
        {
            var userId = GetClaim("id");
            var role = GetClaim("role");
            if(string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))return Unauthorized("You are not authorized to do this action");
            try
            {
                var id = Guid.Parse(userId);
                return Ok(await accountService.UpdateAccountAsync(request, id,role));
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }

        }




























































        //key could also be role 
        private string? GetClaim(string key="id")
        {
            if(key=="id")return User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(key=="role")return User.FindFirstValue(ClaimTypes.Role);
            return null;
        }
    }
}
