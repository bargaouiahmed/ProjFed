using System;

namespace Backend.Administration.DataTransferObjects.Requests;

public class AddExistingProfessorRequest
{
    public required string Email { get; set; }
}
