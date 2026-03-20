using System;

namespace Backend.Administration.DataTransferObjects.Requests;

public class NewClassMetaDataRequest
{
    public required string Specialty{get;set;}
    public Guid InstituteId{get;set;}
    public required string LevelOfStudies{get;set;}
    public required int MaxYears{get;set;}
    public required int DefaultMaxTerms{get;set;}

}

public record ClassPrettyName(string Name);

// public class ClassMetadata
// {
//     public Guid Id { get; set; }
//     public Guid InstituteId { get; set; }
//     public Institute Institute { get; set; } = new();

//     public string LevelOfStudies { get; set; } = string.Empty; //Ex: mastére, license, cycle ingenieur etc..
//     public string Specialty { get; set; } = string.Empty;
//     public int MaxYears { get; set; }
//     public int Level { get; set; }

//     public ICollection<UniClass> Classes { get; set; } = [];



// }