using System;

namespace Backend.Auth.Entities;

public class Institute
{
    public Guid Id { get; set; }

    public ICollection<UniUser> Admins { get; set; } = [];

    public ICollection<ClassMetadata> AvailableClassSelection { get; set; } = [];
    //classet



}
