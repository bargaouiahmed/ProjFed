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
  id: string;
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
      const form = new FormData();
      form.append("questionText", formData.questionText);
      form.append("options", formData.options);
      form.append("correctOptions", formData.correctOptions);
      form.append("questionMark", formData.questionMark);

      if (formData.explanation) {
        form.append("explanation", formData.explanation);
      }

      formData.attachments?.forEach((file) => {
        form.append("attachments", file); // matches List<IFormFile> Attachments
      });

      const response = await api.post(
        `/professor/exams/${params.examId}/mcqs`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
