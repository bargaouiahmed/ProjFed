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

import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useUpdateExamMcq() {
  return useMutation({
    mutationFn: async ({ formData, id }: Props) => {
      const response = await api.put(`/professor/exams/mcqs`, {
        ...formData,
        id,
      });
      return response.data;
    },
  });
}
