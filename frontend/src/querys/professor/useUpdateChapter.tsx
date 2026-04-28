/*
## 37. Update Chapter

- **Endpoint:** `PUT /professor/chapters`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - `title` (string, optional)
  - `description` (string, optional)
  - `attachments` (file[], optional; allowed: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`; max 25MB each)
- **Response:**
  - 200 OK: Updated `SerializedChapter`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Uploads files under `wwwroot/uploads/professor-space/chapters/...`
  - Stores generated static URLs in `attachmentUrls`

---


*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useUpdateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [""],
    mutationFn: async ({ data }: { data: FormData }) => {
      const response = await api.put(`/professor/chapters`, data);
      return response.data;
    },

    onError: () => {
      toast.error("upadting the chapter failed ");
    },

    onSuccess: () => {
      toast.success("chapter updated !");
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}
