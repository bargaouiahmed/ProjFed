using System;
using Backend.Auth.Entities;

namespace Backend.Administration.Entities;

public class Notification
{
    public Guid Id{get;set;}
    public Guid IdentityId{get;set;}
    public AuthIdentity? Identity{get;set;}
    public string Message{get;set;}=string.Empty;
    public DateTime CreatedAt{get;set;}=DateTime.UtcNow;
    public bool Seen{get;set;}=false;
}
