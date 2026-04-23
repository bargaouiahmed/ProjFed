import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { Mcq } from "./useAddExamMcq";

interface UpdateTestMcqProps {
  id: string;
  formData: Partial<Mcq>;
}

export default function useUpdateTestMcq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: UpdateTestMcqProps) => {
      const form = new FormData();
      form.append("id", id);
      if (formData.questionText)
        form.append("questionText", formData.questionText);
      if (formData.options) form.append("options", formData.options);
      if (formData.correctOptions)
        form.append("correctOptions", formData.correctOptions);
      if (formData.questionMark)
        form.append("questionMark", formData.questionMark);
      if (formData.explanation)
        form.append("explanation", formData.explanation);

      formData.attachments?.forEach((file) => {
        form.append("attachments", file);
      });

      const response = await api.put("/professor/tests/mcqs", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("MCQ updated");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to update MCQ");
    },
  });
}
