using System;

namespace Backend.Auth.Entities;

public class Institute
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;


    public ICollection<UniUser> Admins { get; set; } = [];

    public ICollection<ClassMetadata> AvailableClassSelection { get; set; } = [];
    //classet



}
