// /querys/administration/useAddCourseToClass.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

interface AddCoursePayload {
  classId: string;
  courseName: string;
  term: number;
  description?: string;
}

export default function useAddCourseToClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      courseName,
      term,
      description,
    }: AddCoursePayload) => {
      const res = await api.post(`/administration/classes/${classId}/courses`, {
        courseName,
        term,
        description,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["metadata-classes"],
      });
    },
  });
}
