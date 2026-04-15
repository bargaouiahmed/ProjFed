/*

## 38. Delete Chapter

- **Endpoint:** `DELETE /professor/chapters/{chapterId}`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK
  - 400 Bad Request: Error message

---

*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useDeleteChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId: string) => {
      const response = await api.delete(`/professor/chapters/${chapterId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("chapter deleted !");
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
    onError: () => {
      toast.error("failed to delete chapter please try again");
    },
  });
}
