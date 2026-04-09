using System;
using Backend.Administration.DataTransferObjects.Requests;
using Backend.Administration.DataTransferObjects.Responses;

namespace Backend.Administration.Services;

public interface IAdministrationService
{
    Task AddNewClassMetaData(NewClassMetaDataRequest request, Guid uniAdminIdentityId);
    Task<List<SerializedClassMetaData>> GetAllClassMetaData(Guid instituteId, Guid uniAdminIdentityId, int pageNumber = 1, int pageSize = 10);
    Task<List<SerializedProfessorInvitationForAdministration>> GetAllProfessorInvitations(Guid uniStaffIdentityId);
    Task<ClassPrettyName> AddClassToMetadataType(Guid uniAdminIdentityId, Guid metadataId);
    Task<SerializedClassMetaData> UpdateClassMetaData(SerializedClassMetaData request, Guid uniAdminIdentityId);
    public  Task AddNewProfessor(Guid uniStaffIdentityId,  Guid courseId, AddNewProfessorRequest request);
    public  Task RegisterUniStaff(Guid uniAdminIdentityId, RegisterUniStaffRequest request);
    public Task AddExistingProfessor(Guid uniStaffIdentityId, Guid courseId, AddExistingProfessorRequest request);
    public Task AddExistingUniStaff(Guid uniAdminIdentityId, AddExistingUniStaffRequest request);
    public Task<UniId> GetInstituteIdForStaffMember(Guid uniStaffIdentityId);
    public Task AddCourseToClass(Guid uniStaffIdentityId, Guid classId, AddNewCourseToClassMetadataInstance request);
    public  Task RemoveProfessorFromCourse(Guid uniStaffIdentityId, Guid courseId);
    public  Task RemoveCourseFromClass(Guid uniStaffIdentityId, Guid courseId);
    public Task<int> IncrementClassMetadataTerm(Guid uniStaffIdentityId, Guid metadataId);

}
