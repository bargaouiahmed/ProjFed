/*
## 45. Update Exam Redaction Question

- **Endpoint:** `PUT /professor/exams/redaction-questions`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - `questionText` (string, optional)
  - `questionMark` (int, optional)
  - `attachments` (file[], optional)
- **Response:**
  - 200 OK: `SerializedRedactionQuestion`
  - 400 Bad Request: Error message

---

*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import type { Rq } from "./useAddExamRq";
import { toast } from "sonner";

interface Props {
  id: string;
  formData: Rq;
}

export default function useUpdateExamRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, id }: Props) => {
      const form = new FormData();
      form.append("id", id);
      if (formData.questionText)
        form.append("questionText", formData.questionText);
      if (formData.questionMark)
        form.append("questionMark", String(formData.questionMark));
      formData.attachments?.forEach((file) => form.append("attachments", file));

      const response = await api.put(
        `/professor/exams/redaction-questions`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("redaction question updated");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
