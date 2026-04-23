import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export interface SerializedStudentMcqResponse {
  id: string;
  questionId: string;
  selectedOptionIndex: number;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface McqResponsePayload {
  questionId: string;
  selectedOptionIndex: number;
}

export default function useSubmitExamMcqResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: McqResponsePayload) => {
      const response = await api.put<SerializedStudentMcqResponse>(
        "/student/exams/mcqs/response",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("MCQ response submitted");
      queryClient.invalidateQueries({ queryKey: ["student-exams"] });
    },
    onError: () => {
      toast.error("Failed to submit MCQ response");
    },
  });
}
