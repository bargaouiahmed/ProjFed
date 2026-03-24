using System;
using Backend.Auth.Entities;

namespace Backend.Administration.Entities;

public class UniStaffInvitation
{
    public Guid Id {get;set;}
    public Guid IdentityId{get;set;}
    public AuthIdentity Identity{get;set;}=new();
    public Guid InstituteId{get;set;}
    public Institute Institute{get;set;}=new();
    public DateTime InvitedAt{get;set;}=DateTime.UtcNow;
    public string Status{get;set;}="pending";//"pending", "accepted", "rejected"
}
