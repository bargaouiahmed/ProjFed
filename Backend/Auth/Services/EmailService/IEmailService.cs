using System;

namespace Backend.Auth.Services;

public interface IEmailService
{
    public Task<bool> SendEmail(string to,string subject,  string message);
}
