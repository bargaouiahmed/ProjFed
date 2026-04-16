/*
## 45. Update Exam MCQ

- **Endpoint:** `PUT /professor/exams/mcqs`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - other MCQ fields optional
  - `attachments` (file[], optional)
- **Response:**
  - 200 OK: `SerializedMcqQuestion`
  - 400 Bad Request: Error message

---

*/

import type { Mcq } from "./useAddExamMcq";

interface Props {
  formData: Mcq;
  id: string;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useUpdateExamMcq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, id }: Props) => {
      const form = new FormData();
      form.append("id", id);
      if (formData.questionText)
        form.append("questionText", formData.questionText);
      if (formData.options) form.append("options", formData.options);
      if (formData.correctOptions)
        form.append("correctOptions", formData.correctOptions);
      if (formData.questionMark)
        form.append("questionMark", formData.questionMark);
      if (formData.explanation)
        form.append("explanation", formData.explanation);
      formData.attachments?.forEach((file) => form.append("attachments", file));

      const response = await api.put(`/professor/exams/mcqs`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("mcq question updated");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
