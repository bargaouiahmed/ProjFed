import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { SerializedStudentMcqResponse } from "./useSubmitExamMcqResponse";

interface McqResponsePayload {
  questionId: string;
  selectedOptionIndex: number;
}

export default function useSubmitTestMcqResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: McqResponsePayload) => {
      const response = await api.put<SerializedStudentMcqResponse>(
        "/student/tests/mcqs/response",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("MCQ response submitted");
      queryClient.invalidateQueries({ queryKey: ["student-tests"] });
    },
    onError: () => {
      toast.error("Failed to submit MCQ response");
    },
  });
}
