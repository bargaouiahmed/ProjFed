import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (testId: string) => {
      const response = await api.delete(`/professor/tests/${testId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test deleted");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: () => {
      toast.error("Failed to delete test");
    },
  });
}
