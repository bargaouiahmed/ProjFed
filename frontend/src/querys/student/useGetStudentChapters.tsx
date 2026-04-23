import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Chapter } from "./useCourses";

export default function useGetStudentChapters(courseId: string) {
  return useQuery({
    queryKey: ["student-chapters", courseId],
    queryFn: async () => {
      const response = await api.get<Chapter[]>(
        `/student/courses/${courseId}/chapters`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}
