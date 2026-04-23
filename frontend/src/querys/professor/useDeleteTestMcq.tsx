import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useDeleteTestMcq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mcqId: string) => {
      const response = await api.delete(`/professor/tests/mcqs/${mcqId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("MCQ deleted");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to delete MCQ");
    },
  });
}
