using System;

namespace Backend.Account.DataTransferObjects.Requests;

public class GetUserByIdRequest
{
    public required Guid UserId{get;set;}
    public required string Role{get;set;}
}
