using System;

namespace Backend.FileSystem;

public interface IFSService
{
    public Task<ResolvedFile> GetDocumentIdentityFileForDownloadAsync(Guid pendingRequestId, Guid reviewerIdentityId);
    public Task<ResolvedFile> GetDocumentProofFileForDownloadAsync(Guid pendingRequestId, Guid reviewerIdentityId);
    public Task<DownloadArchive> GetChapterFilesForDownloadAsync(Guid chapterId, Guid requesterIdentityId, string role);
}
