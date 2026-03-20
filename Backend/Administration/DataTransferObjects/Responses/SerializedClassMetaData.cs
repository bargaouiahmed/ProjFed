using System;

namespace Backend.Administration.DataTransferObjects.Responses;

public class SerializedClassMetaData
{
    public Guid MetadataId{get;set;}
    public string LevelOfStudies { get; set; } = string.Empty; //Ex: mastére, license, cycle ingenieur etc..
    public string Specialty { get; set; } = string.Empty;
    public int MaxYears { get; set; }
    public int Level { get; set; }

    public int MaxTerms{get;set;}
    public int NumberOfClasses { get; set; }
}
