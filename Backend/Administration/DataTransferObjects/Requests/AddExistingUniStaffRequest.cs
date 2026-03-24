using System;

namespace Backend.Administration.DataTransferObjects.Requests;

public class AddExistingUniStaffRequest
{
    public required string Email { get; set; }
}
