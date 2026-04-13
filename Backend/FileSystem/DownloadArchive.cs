namespace Backend.FileSystem;

public sealed record DownloadArchive(byte[] Content, string ContentType, string FileName);
