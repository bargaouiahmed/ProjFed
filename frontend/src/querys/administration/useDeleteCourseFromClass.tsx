// /querys/administration/useRemoveCourse.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

export default function useRemoveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await api.delete(`/administration/courses/${courseId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["metadata-classes"],
      });
    },
  });
}
