/* 
## 46. Delete Exam MCQ

- **Endpoint:** `DELETE /professor/exams/mcqs/{mcqId}`
- **Auth:** Bearer token required, role `professor`

---

*/

import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useDeleteExamMcq() {
  return useMutation({
    mutationFn: async (mcqId: string) => {
      const response = await api.delete(`/professor/exams/mcqs/${mcqId}`);
      return response.data;
    },
  });
}
