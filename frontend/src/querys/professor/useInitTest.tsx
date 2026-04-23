import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { Exam as Test } from "./useExams";

export default function useInitTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await api.post<Test>(
        `/professor/courses/${courseId}/tests/init`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test initialized");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: () => {
      toast.error("Failed to initialize test");
    },
  });
}
