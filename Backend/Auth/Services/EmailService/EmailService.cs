using System;
using System.Net;
using System.Net.Mail;

namespace Backend.Auth.Services;

public class EmailService : IEmailService
{
    private readonly string SmtpHost = Environment.GetEnvironmentVariable("SMTP_HOST")!;
    private readonly string SmtpPass = Environment.GetEnvironmentVariable("SMTP_PASS")!;
    private readonly int SmtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT")!);
    private readonly bool SmtpSecure = bool.Parse(Environment.GetEnvironmentVariable("SMTP_SECURE")!);
    private readonly string SmtpUser = Environment.GetEnvironmentVariable("SMTP_USER")!;





    public async Task<bool> SendEmail(string to, string subject, string message)
    {
        using(var client= new SmtpClient(SmtpHost, SmtpPort))
        {
            client.EnableSsl=SmtpSecure;
            client.Timeout = 10000;
            client.Credentials = new NetworkCredential(SmtpUser, SmtpPass);

        var fromAddress = new MailAddress(SmtpUser);
        var toAddress = new MailAddress(to);

        MailMessage mailMessage = new();
        mailMessage.From = fromAddress;
        mailMessage.To.Add(toAddress);
        mailMessage.Subject=subject;
        mailMessage.Body=message;

    
        try{

        await client.SendMailAsync(mailMessage);
        return true;
        }catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }


            
            
        }
        

        
    }


    

    

}
