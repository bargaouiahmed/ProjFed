using System;

namespace Backend.Account.DataTransferObjects.Responses;

public class SerializedNotification
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool Seen { get; set; }
}
