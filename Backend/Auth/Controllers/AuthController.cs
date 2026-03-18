using Backend.Auth.DataTransferObjects.Requests;
using Backend.Auth.DataTransferObjects.Responses;
using Backend.Auth.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Auth.Controllers
{
    [Route("api/v0")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("student/auth/register")]
        public async Task<ActionResult<string>> RegisterStudent([FromBody] RegisterStudentRequest request)
        {
            try
            {
                await authService.RegisterStudent(request);

                return Ok("Registration successful, check your email for activation link");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }
        }
        [HttpPost("institute/auth/admin/register")]
        public async Task<ActionResult<string>> RegisterInstituteAdmin([FromForm] RegisterNewInstituteRequest request)
        {
            try
            {
                await authService.RegisterNewInstituteHead(request);

                return Ok("Your registration request has been submitted successfully. We will review your application and get back to you shortly.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }
        }


        [HttpPost("student/auth/login")]
        public async Task<ActionResult<TokenPairResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var tokens = await authService.Login(request);

                return Ok(tokens);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }

        }
        [HttpGet("student/auth/activate-account")]
        public async Task<ActionResult> ActivateAccount([FromQuery] string id, [FromQuery] string token)
        {
            token = token.Replace(' ', '+');
            try
            {
                await authService.ActivateAccount(new Guid(id), token);
                return Ok("Account activated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }

        }
        [HttpPost("auth/request-password-reset")]
        public async Task<ActionResult> RequestPasswordReset([FromQuery] string email)
        {
            try
            {
                await authService.RequestPasswordReset(email);
                return Ok("Password reset email sent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }

        }
        [HttpPost("auth/reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                await authService.ResetPassword(request);
                return Ok("Password reset successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }

        }
        [HttpPost("auth/resend-activation-email")]
        public async Task<ActionResult> ResendActivationEmail([FromQuery] string email)
        {
            try
            {
                await authService.ResendActivationEmail(email);
                return Ok("Activation email resent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }

        }
        [HttpPost("auth/refresh-token")]
        public async Task<ActionResult<RefreshTokenResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var newTokens = await authService.RefreshToken(request);
                return Ok(newTokens);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error:{ex.Message}");
            }
        }
    }
}

