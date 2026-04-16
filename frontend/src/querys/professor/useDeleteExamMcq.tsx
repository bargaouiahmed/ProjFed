/* 
## 46. Delete Exam MCQ

- **Endpoint:** `DELETE /professor/exams/mcqs/{mcqId}`
- **Auth:** Bearer token required, role `professor`

---

*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useDeleteExamMcq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mcqId: string) => {
      const response = await api.delete(`/professor/exams/mcqs/${mcqId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("course deleted");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },

    onError: () => {
      toast.error("failed to delete  question");
    },
  });
}
