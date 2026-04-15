/*

## 44. Add Exam MCQ

- **Endpoint:** `POST /professor/exams/{examId}/mcqs`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `questionText` (string, required)
  - `options` (string, required)
  - `correctOptions` (string, required)
  - `questionMark` (int, required)
  - `explanation` (string, optional)
  - `attachments` (file[], optional; allowed: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`)
- **Response:**
  - 200 OK: `SerializedMcqQuestion`
  - 400 Bad Request: Error message

---

*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

export interface Mcq {
  questionText: string;
  options: string;
  correctOptions: string;
  questionMark: string;
  explanation?: string;
  attachments?: File[];
}
interface Props {
  params: {
    examId: string;
  };
  formData: Mcq;
}

export default function useAddExamMcq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, params }: Props) => {
      const response = await api.post(
        `/professor/exams/${params.examId}/mcqs`,
        formData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
