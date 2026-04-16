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

interface Props {
  id: string;
  formData: Rq;
}

export default function useUpdateExamRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, id }: Props) => {
      const response = await api.put(`/professor/exams/redaction-questions`, {
        id,
        ...formData,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
