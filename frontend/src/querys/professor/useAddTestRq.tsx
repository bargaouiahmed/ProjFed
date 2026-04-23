import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { Rq } from "./useAddExamRq";

interface AddTestRqProps {
  testId: string;
  rq: Rq;
}

export default function useAddTestRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ testId, rq }: AddTestRqProps) => {
      const form = new FormData();
      form.append("questionText", rq.questionText);
      form.append("questionMark", String(rq.questionMark));
      rq.attachments?.forEach((file) => form.append("attachments", file));

      const response = await api.post(
        `/professor/tests/${testId}/redaction-questions`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Redaction question added");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to add question");
    },
  });
}
