using System;
using System.Security.Cryptography;
using Backend.StudentSpace.Entities;
using Humanizer;

namespace Backend.Auth.Entities;

public class UniClass
{
    public Guid Id { get; set; }

    public Guid MetadataId { get; set; }
    public ClassMetadata Metadata { get; set; } = new();

    public int Number { get; set; }

    public ICollection<Student> Students { get; set; } = [];
    public ICollection<Course> Courses {get;set;} = [];
    public string ClassCode { get; set; } = string.Empty;


    public string CreateClassCode(int length =6)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var token = new char[length];
        for (int i = 0; i < length; i++)
        {
            token[i] = chars[RandomNumberGenerator.GetInt32(chars.Length)];
        }
        
        ClassCode=new string(token);
        return ClassCode;

    }
}
