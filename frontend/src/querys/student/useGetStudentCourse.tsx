import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { SerializedCourse } from "./useCourses";

export default function useGetStudentCourse(courseId: string) {
  return useQuery({
    queryKey: ["student-course", courseId],
    queryFn: async () => {
      const response = await api.get<SerializedCourse>(
        `/student/courses/${courseId}`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}
