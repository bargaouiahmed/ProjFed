import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { SerializedStudentRedactionResponse } from "./useSubmitExamRqResponse";

interface RqResponsePayload {
  questionId: string;
  answerText: string;
}

export default function useSubmitTestRqResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RqResponsePayload) => {
      const response = await api.put<SerializedStudentRedactionResponse>(
        "/student/tests/redaction-questions/response",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Response submitted");
      queryClient.invalidateQueries({ queryKey: ["student-tests"] });
    },
    onError: () => {
      toast.error("Failed to submit response");
    },
  });
}
