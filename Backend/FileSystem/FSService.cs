using Backend.Admin.Entities;
using Backend.Database.Auth;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;

namespace Backend.FileSystem;

public class FSService(AppDbContext db, IWebHostEnvironment env) : IFSService
{
    public async Task<ResolvedFile> GetDocumentIdentityFileForDownloadAsync(Guid pendingRequestId, Guid reviewerIdentityId)
    {
        var pendingRequest = await GetAuthorizedPendingRequestAsync(pendingRequestId, reviewerIdentityId);
        return ResolveWebContentUrlToFile(pendingRequest.IdentityDocumentUrl);
    }

    public async Task<ResolvedFile> GetDocumentProofFileForDownloadAsync(Guid pendingRequestId, Guid reviewerIdentityId)
    {
        var pendingRequest = await GetAuthorizedPendingRequestAsync(pendingRequestId, reviewerIdentityId);
        return ResolveWebContentUrlToFile(pendingRequest.ProofDocumentUrl);
    }

    public async Task<DownloadArchive> GetChapterFilesForDownloadAsync(Guid chapterId, Guid requesterIdentityId, string requesterRole)
    {
        var chapter = await db.Chapters
            .AsNoTracking()
            .Where(c => c.Id == chapterId)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.AttachmentUrls
            })
            .FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Chapter not found.");

        if (!await IsUserAuthorizedToAccessFileAsync(chapterId, requesterIdentityId, requesterRole))
        {
            throw new UnauthorizedAccessException("Requester identity is not authorized to access these files.");
        }

        if (string.IsNullOrWhiteSpace(chapter.AttachmentUrls))
        {
            throw new InvalidOperationException("No files found for the specified chapter.");
        }

        var chapterFiles = chapter.AttachmentUrls
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(ResolveWebContentUrlToFile)
            .ToList();

        using var archiveStream = new MemoryStream();
        using (var archive = new ZipArchive(archiveStream, ZipArchiveMode.Create, true))
        {
            foreach (var file in chapterFiles)
            {
                var entry = archive.CreateEntry(Path.GetFileName(file.FullPath), CompressionLevel.Fastest);
                await using var entryStream = entry.Open();
                await using var fileStream = File.OpenRead(file.FullPath);
                await fileStream.CopyToAsync(entryStream);
            }
        }

        return new DownloadArchive(
            archiveStream.ToArray(),
            "application/zip",
            BuildChapterArchiveName(chapter.Title, chapter.Id)
        );
    }

    private async Task<PendingJoinRequest> GetAuthorizedPendingRequestAsync(Guid pendingRequestId, Guid reviewerIdentityId)
    {
        var isAuthorizedReviewer = await db.Identities
            .AnyAsync(i => i.Id == reviewerIdentityId && (i.Role == "admin" || i.Role == "super_admin"));

        if (!isAuthorizedReviewer)
        {
            throw new UnauthorizedAccessException("Reviewer identity is not authorized to access this file.");
        }

        return await db.PendingJoinRequests
            .AsNoTracking()
            .FirstOrDefaultAsync(pr => pr.Id == pendingRequestId)
            ?? throw new InvalidOperationException("Pending request not found.");
    }

    private ResolvedFile ResolveWebContentUrlToFile(string webContentUrl)
    {
        if (string.IsNullOrWhiteSpace(webContentUrl))
        {
            throw new InvalidOperationException("File url is missing.");
        }

        var webRootPath = env.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
        }

        if (!webContentUrl.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Invalid file url.");
        }

        var relativePath = webContentUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var fullPath = Path.GetFullPath(Path.Combine(webRootPath, relativePath));

        var uploadsRoot = Path.GetFullPath(Path.Combine(webRootPath, "uploads"));
        if (!fullPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Invalid file path.");
        }

        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException("File not found.", fullPath);
        }

        var provider = new FileExtensionContentTypeProvider();
        provider.TryGetContentType(fullPath, out var resolvedContentType);

        return new ResolvedFile(fullPath, resolvedContentType ?? "application/octet-stream");
    }

    private async Task<bool> IsUserAuthorizedToAccessFileAsync(Guid chapterId, Guid requesterIdentityId, string role)
    {
        switch (role)
        {
            case "admin":
            case "super_admin":
                return true;
            case "professor":
                return await IsProfessorAuthorizedToAccessFileAsync(requesterIdentityId, chapterId);
            case "student":
                return await IsStudentAuthorizedToAccessFileAsync(requesterIdentityId, chapterId);
            case "uni_staff":
            case "uni_admin":
                return await IsUniPersonnelAuthorizedToAccessFileAsync(requesterIdentityId, chapterId);
            default:
                return false;
        }
    }

    private async Task<bool> IsProfessorAuthorizedToAccessFileAsync(Guid professorIdentityId, Guid chapterId)
    {
        return await db.Chapters
            .Where(ch => ch.Id == chapterId && ch.Course != null && ch.Course.Professor != null && ch.Course.Professor.IdentityId == professorIdentityId)
            .AnyAsync();
    }

    private async Task<bool> IsStudentAuthorizedToAccessFileAsync(Guid studentIdentityId, Guid chapterId)
    {
        return await db.Chapters
            .Where(ch => ch.Id == chapterId && ch.Course!.UniClass!.Students.Any(s => s.IdentityId == studentIdentityId))
            .AnyAsync();
    }

    private async Task<bool> IsUniPersonnelAuthorizedToAccessFileAsync(Guid uniPersonnelIdentityId, Guid chapterId)
    {
        var instituteId = await db.Identities
            .Where(i => i.Id == uniPersonnelIdentityId)
            .Select(i => i.UniUser!.InstituteId)
            .FirstOrDefaultAsync();

        if (!instituteId.HasValue)
        {
            return false;
        }

        return await db.Chapters
            .Where(ch => ch.Id == chapterId && ch.Course!.UniClass!.Metadata!.InstituteId == instituteId.Value)
            .AnyAsync();
    }

    private static string BuildChapterArchiveName(string title, Guid chapterId)
    {
        var safeTitleChars = title
            .Select(c => Path.GetInvalidFileNameChars().Contains(c) ? '-' : c)
            .ToArray();

        var safeTitle = new string(safeTitleChars).Trim();
        if (string.IsNullOrWhiteSpace(safeTitle))
        {
            safeTitle = $"chapter-{chapterId}";
        }

        return $"{safeTitle}-attachments.zip";
    }
}
