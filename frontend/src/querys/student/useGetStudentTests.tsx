import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Assessment } from "./useCourses";

export default function useGetStudentTests(courseId: string) {
  return useQuery({
    queryKey: ["student-tests", courseId],
    queryFn: async () => {
      const response = await api.get<Assessment[]>(
        `/student/courses/${courseId}/tests`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}
