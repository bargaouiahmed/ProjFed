using System;

namespace Backend.Auth.DataTransferObjects.Requests;

public class RegisterNewInstituteRequest
{
    public required string AdminFirstname { get; set; }
    public required string AdminLastname { get; set; }
    public required string AdminEmail { get; set; }
    public required string AdminPassword { get; set; }
    public required string Name { get; set; }
    public required string Country { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required IFormFile ProofDocument { get; set; }
    public required IFormFile IdentityDocument { get; set; }

}
