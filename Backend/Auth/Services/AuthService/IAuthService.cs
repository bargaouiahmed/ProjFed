using System;
using Backend.Auth.DataTransferObjects.Requests;
using Backend.Auth.DataTransferObjects.Responses;

namespace Backend.Auth.Services;

public interface IAuthService
{
    public Task EnsureSuperAdminExistsAsync();

    public Task RegisterStudent(RegisterStudentRequest request);

    public Task<TokenPairResponse> Login(LoginRequest request);


    public Task ActivateAccount(Guid identityId, string activationToken);
    public Task RequestPasswordReset(string email);
    public Task ResetPassword(ResetPasswordRequest request);
    public Task ResendActivationEmail(string email);
    public Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request);
    public Task RegisterNewInstituteHead(RegisterNewInstituteRequest request);
}
