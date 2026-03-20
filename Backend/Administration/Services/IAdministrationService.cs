using System;
using Backend.Administration.DataTransferObjects.Requests;
using Backend.Administration.DataTransferObjects.Responses;

namespace Backend.Administration.Services;

public interface IAdministrationService
{
    Task AddNewClassMetaData(NewClassMetaDataRequest request, Guid uniAdminIdentityId);
    Task<List<SerializedClassMetaData>> GetAllClassMetaData(Guid instituteId, Guid uniAdminIdentityId, int pageNumber = 1, int pageSize = 10);
    Task<ClassPrettyName> AddClassToMetadataType(Guid uniAdminIdentityId, Guid metadataId);
    Task<SerializedClassMetaData> UpdateClassMetaData(SerializedClassMetaData request, Guid uniAdminIdentityId);
}
