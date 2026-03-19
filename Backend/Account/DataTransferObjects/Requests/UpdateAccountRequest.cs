using System;

namespace Backend.Account.DataTransferObjects.Requests;

public class UpdateAccountRequest
{
    public string? Firstname {get;set;} 
    public string? Lastname {get;set;} 
    public string? Email {get;set;} 
    public IFormFile? Pfp{get;set;}

}
