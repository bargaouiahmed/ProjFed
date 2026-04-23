import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Assessment } from "./useCourses";

export default function useGetStudentExam(examId: string) {
  return useQuery({
    queryKey: ["student-exam", examId],
    queryFn: async () => {
      const response = await api.get<Assessment>(`/student/exams/${examId}`);
      return response.data;
    },
    enabled: !!examId,
  });
}
