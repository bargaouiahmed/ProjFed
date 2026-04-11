import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useAddStudentToClass() {
  return useMutation({
    mutationFn: async (classCode: string) => {
      const response = await api.post(
        "/student/course/add",
        {},
        {
          params: {
            classCode,
          },
        },
      );
      return response.data;
    },

    onSuccess: () => {
      toast.success("welcome in class");
    },
    onError: () => {
      toast.error("joining class failed please verify your code");
    },
  });
}
