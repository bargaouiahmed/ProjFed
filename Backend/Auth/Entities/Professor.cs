using System;

namespace Backend.Auth.Entities;

public class Professor
{
    public Guid Id { get; set; }
    public Guid IdentityId { get; set; }
    public AuthIdentity Identity { get; set; } = new();

    public string Firstname { get; set; } = string.Empty;
    public string Lasttname { get; set; } = string.Empty;
    public string? PfpUrl { get; set; }

    public ICollection<ProfessorUniClass> Classes { get; set; } = [];


}
