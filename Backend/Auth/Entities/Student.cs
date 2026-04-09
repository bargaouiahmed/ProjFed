using System;

namespace Backend.Auth.Entities;

public class Student
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public AuthIdentity? Identity { get; set; } 

    public Guid UniClassId { get; set; }
    public UniClass? UniClass { get; set; }    
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PfpUrl { get; set; }


}
