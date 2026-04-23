import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
import type { Rq } from "./useAddExamRq";

interface UpdateTestRqProps {
  id: string;
  formData: Partial<Rq>;
}

export default function useUpdateTestRq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: UpdateTestRqProps) => {
      const form = new FormData();
      form.append("id", id);
      if (formData.questionText)
        form.append("questionText", formData.questionText);
      if (formData.questionMark)
        form.append("questionMark", String(formData.questionMark));
      formData.attachments?.forEach((file) => form.append("attachments", file));

      const response = await api.put(
        "/professor/tests/redaction-questions",
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Redaction question updated");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });
}
