import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { Exam as Test } from "./useExams";

interface UpdateTestPayload {
  id: string;
  title?: string;
  description?: string;
  totalMarks?: number;
}

export default function useUpdateTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateTestPayload) => {
      const response = await api.put<Test>("/professor/tests", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test updated");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to update test");
    },
  });
}
