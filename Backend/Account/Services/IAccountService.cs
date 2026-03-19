using System;
using Backend.Account.DataTransferObjects.Requests;
using Backend.Account.DataTransferObjects.Responses;

namespace Backend.Account.Services;

public interface IAccountService
{

public Task<SerializedUser> GetUserByIdAsync(GetUserByIdRequest request);
}
