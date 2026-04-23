import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export interface SerializedStudentRedactionResponse {
  id: string;
  questionId: string;
  answerText: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface RqResponsePayload {
  questionId: string;
  answerText: string;
}

export default function useSubmitExamRqResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RqResponsePayload) => {
      const response = await api.put<SerializedStudentRedactionResponse>(
        "/student/exams/redaction-questions/response",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Response submitted");
      queryClient.invalidateQueries({ queryKey: ["student-exams"] });
    },
    onError: () => {
      toast.error("Failed to submit response");
    },
  });
}
