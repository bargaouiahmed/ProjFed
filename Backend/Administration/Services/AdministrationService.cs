using System;
using Backend.Administration.DataTransferObjects.Requests;
using Backend.Administration.DataTransferObjects.Responses;
using Backend.Auth.Entities;
using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;

namespace Backend.Administration.Services;

public class AdministrationService(AppDbContext db)
{


    public async Task AddNewClassMetaData(NewClassMetaDataRequest request, Guid uniAdminIdentityId)
    {
        var institute = await db.Institutes.Include(u=>u.Admins).FirstOrDefaultAsync(i => i.Id == request.InstituteId) ?? throw new InvalidOperationException("Institute not found");
        if (!institute.Admins.Any(a => a.IdentityId == uniAdminIdentityId))
        {
            throw new InvalidOperationException("Only institute admins can add class metadata");
        }
        List<ClassMetadata> classes = [];
        for (int i=1; i<=request.MaxYears; i++)
        {
            var newClassMetaData = new ClassMetadata
        {
            InstituteId = request.InstituteId,
            LevelOfStudies = request.LevelOfStudies,
            Specialty = request.Specialty,
            MaxYears = request.MaxYears,
            MaxTerms=request.DefaultMaxTerms,
            Level=i
        };
        classes.Add(newClassMetaData);

        }
         db.ClassMetadata.AddRange(classes);

        await db.SaveChangesAsync();

    }
    public async Task<List<SerializedClassMetaData>> GetAllClassMetaData(Guid instituteId,  Guid uniAdminIdentityId,int pageNumber=1, int pageSize=10)
    {
        int skip = (pageNumber - 1) * pageSize;
        int take = pageSize;
        if(!await db.UniUsers.AnyAsync(au=>au.IdentityId==uniAdminIdentityId && au.InstutiteId==instituteId))throw new InvalidOperationException("Only administration members may consult this resource");
       var classMetaDatas = await db.ClassMetadata.Include(u=>u.Classes).Where(c=>c.InstituteId == instituteId ).Select( c=> new SerializedClassMetaData
       {
            MetadataId=c.Id,
           LevelOfStudies=c.LevelOfStudies,
           MaxYears=c.MaxYears,
           Level=c.Level,
           Specialty=c.Specialty,
           MaxTerms=c.MaxTerms,
           NumberOfClasses=c.Classes.Count()
       }).Skip(skip).Take(take).ToListAsync();
       return classMetaDatas;

    }
    public async Task<ClassPrettyName> AddClassToMetadataType(Guid uniAdminIdentityId, Guid metadataId)
    {
        var metadata = await db.ClassMetadata.Include(cm=>cm.Institute).ThenInclude(i=>i.Admins).FirstOrDefaultAsync(cm=>cm.Id == metadataId && cm.Institute.Admins.Any(a=>a.IdentityId == uniAdminIdentityId))??throw new InvalidOperationException("Invalid ClassMetaData or UnauthorizedAccessAttempt");
        UniClass newClass = new()
        {
            Number=await db.UniClasses.CountAsync(uc=>uc.MetadataId==metadataId)+1,
            MetadataId=metadataId
        };
        newClass.CreateClassCode();
        db.Add(newClass);
        await db.SaveChangesAsync();
        var number = newClass.Number.ToString();
        var speciality = metadata.Specialty;
        var year = metadata.Level.ToString();
        var levelOfStudies = metadata.LevelOfStudies.ToString();
        return new ClassPrettyName($"{year}{levelOfStudies}{speciality}{number}");
        
}

    public async Task<SerializedClassMetaData> UpdateClassMetaData(SerializedClassMetaData request, Guid uniAdminIdentityId)
    {

        var response = await db.ClassMetadata.Include(cm=>cm.Institute).ThenInclude(i=>i.Admins).FirstOrDefaultAsync(cm=>cm.Id==request.MetadataId)??throw new InvalidOperationException("invalid metadata id");
        if(!response.Institute.Admins.Any(a=>a.IdentityId==uniAdminIdentityId))throw new InvalidOperationException("unauthorized access");
        
        response.Level=request.Level;
        response.LevelOfStudies=request.LevelOfStudies;
        response.MaxYears=request.MaxYears;
        response.MaxTerms=request.MaxTerms;
        response.Specialty=request.Specialty;
        await db.SaveChangesAsync();
        return request;
        
    }

    
    



}
