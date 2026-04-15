/* 

## 49. Delete Exam Redaction Question

- **Endpoint:** `DELETE /professor/exams/redaction-questions/{questionId}`
- **Auth:** Bearer token required, role `professor`

*/

import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useDeleteExamRq() {
  return useMutation({
    mutationFn: async (questionId: string) => {
      const response = await api.delete(
        `/professor/exams/redaction-questions/${questionId}`,
      );
      return response.data;
    },
  });
}
