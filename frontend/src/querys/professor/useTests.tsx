import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Exam as Test } from "./useExams";

export default function useTests(courseId: string) {
  return useQuery({
    queryKey: ["tests", courseId],
    queryFn: async () => {
      const response = await api.get<Test[]>(
        `/professor/courses/${courseId}/tests`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}
