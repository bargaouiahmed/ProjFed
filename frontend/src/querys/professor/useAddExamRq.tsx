import { useMutation } from "@tanstack/react-query";
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

interface Rq {
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
  return useMutation({
    mutationFn: async ({ params, rq }: Props) => {
      const response = await api.post(
        `/professor/exams/${params.examId}/redaction-questions`,
        rq,
      );
      return response.data;
    },
  });
}
