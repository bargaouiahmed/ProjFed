import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Assessment } from "./useCourses";

export default function useGetStudentTest(testId: string) {
  return useQuery({
    queryKey: ["student-test", testId],
    queryFn: async () => {
      const response = await api.get<Assessment>(`/student/tests/${testId}`);
      return response.data;
    },
    enabled: !!testId,
  });
}
