using System;

namespace Backend.Administration.DataTransferObjects.Requests;

public class RegisterUniStaffRequest
{
    public required string Firstname { get; set; }
    public required string Lastname { get; set; }
    public required string Email { get; set; }

     public bool Validate()
    {
        return !string.IsNullOrEmpty(Firstname) && !string.IsNullOrEmpty(Lastname) && !string.IsNullOrEmpty(Email);
    }

}
