import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Chapter } from "./useCourses";

export default function useGetStudentChapter(chapterId: string) {
  return useQuery({
    queryKey: ["student-chapter", chapterId],
    queryFn: async () => {
      const response = await api.get<Chapter>(`/student/chapters/${chapterId}`);
      return response.data;
    },
    enabled: !!chapterId,
  });
}
