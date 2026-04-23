import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface GradePayload {
  responseId: string;
  score: number;
}

export default function useGradeExamRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ responseId, score }: GradePayload) => {
      const response = await api.put(
        `/professor/responses/exam-redaction-questions/${responseId}/grade`,
        { score }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Grade updated");
      queryClient.invalidateQueries({ queryKey: ["course-grades"] });
    },
    onError: () => {
      toast.error("Failed to update grade");
    },
  });
}
