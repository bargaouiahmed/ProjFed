import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useDeleteTestRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      const response = await api.delete(
        `/professor/tests/redaction-questions/${questionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Redaction question deleted");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });
}
