using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.FileSystem
{
    [Route("api/v0/fs")]
    [ApiController]
    public class FsController(IFSService fSService) : ControllerBase
    {
        [Authorize(Roles = "admin,super_admin")]
        [HttpGet("pending-requests/{pendingRequestId:guid}/identity-document")]
        public async Task<IActionResult> GetDocumentIdentityFileForDownloadAsync(Guid pendingRequestId)
        {
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var reviewerIdentityId))
            {
                return Unauthorized("Invalid user identity.");
            }

            var resolvedFile = await fSService.GetDocumentIdentityFileForDownloadAsync(pendingRequestId, reviewerIdentityId);
            return PhysicalFile(resolvedFile.FullPath, resolvedFile.ContentType);
        }

        [Authorize(Roles = "admin,super_admin")]
        [HttpGet("pending-requests/{pendingRequestId:guid}/proof-document")]
        public async Task<IActionResult> GetDocumentProofFileForDownloadAsync(Guid pendingRequestId)
        {
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var reviewerIdentityId))
            {
                return Unauthorized("Invalid user identity.");
            }

            var resolvedFile = await fSService.GetDocumentProofFileForDownloadAsync(pendingRequestId, reviewerIdentityId);
            return PhysicalFile(resolvedFile.FullPath, resolvedFile.ContentType);
        }

        [Authorize]
        [HttpGet("chapters/{chapterId:guid}/attachments")]
        public async Task<IActionResult> GetChapterFilesForDownloadAsync(Guid chapterId)
        {
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var requesterIdentityId))
            {
                return Unauthorized("Invalid user identity.");
            }

            var requesterRole = User.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrWhiteSpace(requesterRole))
            {
                return Unauthorized("Invalid user role.");
            }

            var archive = await fSService.GetChapterFilesForDownloadAsync(chapterId, requesterIdentityId, requesterRole);
            return File(archive.Content, archive.ContentType, archive.FileName);
        }
    }
}
