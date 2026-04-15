/* 

## 43. Delete Exam

- **Endpoint:** `DELETE /professor/exams/{examId}`
- **Auth:** Bearer token required, role `professor`

---

*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

export default function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/professor/exams/{examId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
