using System;

namespace Backend.Auth.Entities;

public class UniUser
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public AuthIdentity Identity { get; set; } = new();
    public Guid? InstituteId { get; set; }
    public Institute? Institute { get; set; }


    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;

    public string? PfpUrl { get; set; }



}
