import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";

/*
## 68. Download Chapter Attachments Archive

- **Endpoint:** `GET /fs/chapters/{chapterId}/attachments`
- **Auth:** Bearer token required
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/zip`
- **Route Parameters:**
  - `chapterId` (GUID, required)
- **Authorization Rules:**
  - `admin` and `super_admin` may download any chapter archive
  - `professor` may download only attachments for chapters belonging to their own courses
  - `student` may download only attachments for chapters in courses attached to their class
  - `uni_admin` and `uni_staff` may download only attachments for chapters belonging to their institute
- **Response:**
  - 200 OK: ZIP archive containing all stored chapter attachments
  - `Content-Type: application/zip`
  - Download filename format: `{chapterTitle}-attachments.zip`
  - 401 Unauthorized: Missing/invalid token claim
  - 403 Forbidden: Authentication failed or caller is rejected by policy before controller execution
  - 500 Internal Server Error: Chapter not found, caller not authorized by service checks, chapter has no attachments, invalid stored path, or a file is missing on disk
- **Side Effects:**
  - None (read-only)
  - Builds the archive in memory from the chapter's comma-separated `attachmentUrls`


*/

export default function useDownloadChapters() {
  return useMutation({
    mutationFn: async (chapterId: string) => {
      const response = await api.get(`/fs/chapters/${chapterId}/attachments`, {
        responseType: "blob",
        headers: {
          Accept: "application/zip",
        },
      });

      return response;
    },

    onSuccess: (response) => {
      const blob = new Blob([response.data], {
        type: "application/zip",
      });

      const contentDisposition = response.headers["content-disposition"];

      let filename = "attachments.zip";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    },

    onError: (error) => {
      console.error("Download failed:", error);
    },
  });
}
