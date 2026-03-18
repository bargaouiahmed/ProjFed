using System;
using Backend.Auth.DataTransferObjects.Requests;
using Microsoft.AspNetCore.Identity;

namespace Backend.Auth.Entities;

public class AuthIdentity
{
    public Guid Id { get; set; }
    //Creds
    public string Email { get; set; } = string.Empty;
    public string HashedPassword { get; set; } = string.Empty;
    //Role
    public string Role { get; set; } = string.Empty; //["super_admin","admin","uni_admin","uni_staff","professor","student"]

    //Tokens
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }

    public string? ActivateAccountToken { get; set; }
    public DateTime? ActivateAccountTokenExpiresAt { get; set; }

    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }

    public string? Status { get; set; } = "pending"; //["pending","accepted","rejected"]

    public DateTime CreatedAt = DateTime.UtcNow;
    public DateTime UpdatedAt = DateTime.UtcNow;




    public bool HashPassword(string password)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 8 || !password.Any(char.IsLower) || !password.Any(char.IsUpper) || !password.Any(char.IsDigit) || !password.Any(c => !char.IsLetterOrDigit(c)))
        {
            return false;
        }
        HashedPassword = new PasswordHasher<AuthIdentity>().HashPassword(this, password);
        return true;
    }
    public bool CompareHash(string password)
    {
        return new PasswordHasher<AuthIdentity>().VerifyHashedPassword(this, HashedPassword, password)==PasswordVerificationResult.Success;
    }



    public string GenerateActivateAccountToken()
    {
        ActivateAccountToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        ActivateAccountTokenExpiresAt = DateTime.UtcNow.AddMinutes(15);
        return ActivateAccountToken;
    }

    public string GenerateRefreshToken(int length = 64)
    {
        var randomBytes = new byte[length];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        RefreshToken = Convert.ToBase64String(randomBytes).Substring(0, length).Replace("+", "A").Replace("/", "B").Replace("=", "C");
        RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
        return RefreshToken;
    }


    public string GeneratePasswordResetToken(int length=6)
    {
        var randomBytes = new byte[length];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        PasswordResetToken = Convert.ToBase64String(randomBytes).Substring(0, length).Replace("+", "A").Replace("/", "B").Replace("=", "C"); 
        PasswordResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(15);
        return PasswordResetToken;
    }




}




