using System;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Backend.Administration.DataTransferObjects.Responses;

public class SerializedUniClass
{
    public Guid Id{get;set;}
    
    public int Number{get;set;}
    public string ClassCode{get;set;} = string.Empty;
    public string ClassName{get;set;} = string.Empty;
    public int CurrentTerm{get;set;}
    public int MaxTerms{get;set;}
    
}
