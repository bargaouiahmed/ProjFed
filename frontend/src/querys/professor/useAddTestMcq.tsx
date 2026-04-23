import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { Mcq } from "./useAddExamMcq";

interface AddTestMcqProps {
  testId: string;
  formData: Mcq;
}

export default function useAddTestMcq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ testId, formData }: AddTestMcqProps) => {
      const form = new FormData();
      form.append("questionText", formData.questionText);
      form.append("options", formData.options);
      form.append("correctOptions", formData.correctOptions);
      form.append("questionMark", formData.questionMark);

      if (formData.explanation) {
        form.append("explanation", formData.explanation);
      }

      formData.attachments?.forEach((file) => {
        form.append("attachments", file);
      });

      const response = await api.post(`/professor/tests/${testId}/mcqs`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("MCQ added to test");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to add MCQ");
    },
  });
}
