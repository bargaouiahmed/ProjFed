import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Assessment } from "./useCourses";

export default function useGetStudentExams(courseId: string) {
  return useQuery({
    queryKey: ["student-exams", courseId],
    queryFn: async () => {
      const response = await api.get<Assessment[]>(
        `/student/courses/${courseId}/exams`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}
