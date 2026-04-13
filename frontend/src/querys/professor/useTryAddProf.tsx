import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useTryAddProf() {
  return useMutation({
    mutationFn: async ({
      courseId,
      email,
    }: {
      courseId: string;
      email: string;
    }) => {
      const response = await api.post(
        `/administration/courses/${courseId}/professors/try-add`,
        {},
        {
          params: { email },
        },
      );
      return response.data;
    },
  });
}
