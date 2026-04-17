import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

/*
## 47. Add Exam Redaction Question

- **Endpoint:** `POST /professor/exams/{examId}/redaction-questions`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `questionText` (string, required)
  - `questionMark` (int, required)
  - `attachments` (file[], optional)
- **Response:**
  - 200 OK: `SerializedRedactionQuestion`
  - 400 Bad Request: Error message

---


*/

export interface Rq {
  id?: string;
  questionText: string;
  questionMark: number;
  attachments: File[];
}
interface Props {
  params: {
    examId: string;
  };
  rq: Rq;
}

export default function useAddExamRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ params, rq }: Props) => {
      const form = new FormData();
      form.append("questionText", rq.questionText);
      form.append("questionMark", String(rq.questionMark));
      rq.attachments?.forEach((file) => form.append("attachments", file));

      const response = await api.post(
        `/professor/exams/${params.examId}/redaction-questions`,
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
