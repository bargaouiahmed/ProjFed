using System;
using System.Diagnostics.CodeAnalysis;
using Humanizer;
using Microsoft.Build.Framework;

namespace Backend.Auth.Entities;

public class ClassMetadata
{
    public Guid Id { get; set; }
    public Guid InstituteId { get; set; }
    public Institute Institute { get; set; } = new();

    public string LevelOfStudies { get; set; } = string.Empty; //Ex: mastére, license, cycle ingenieur etc..
    public string Specialty { get; set; } = string.Empty; //Ex: Informatique, gestion etc
    public int MaxYears { get; set; }
    public int Level { get; set; }
    public int MaxTerms { get; set; }
    public int CurrentTerm { get; set; } = 1;

    public ICollection<UniClass> Classes { get; set; } = [];



}
