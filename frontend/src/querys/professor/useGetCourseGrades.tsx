import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface GradeEntry {
  assessmentId: string;
  title: string;
  assessmentType: "exam" | "test";
  score: number;
  totalMarks: number;
  normalizedScoreOn20: number;
}

export interface StudentGradeSummary {
  studentId: string;
  firstname: string;
  lastname: string;
  overallExamScore: number;
  overallExamTotalMarks: number;
  overallExamScoreOn20: number;
  overallTestScore: number;
  overallTestTotalMarks: number;
  overallTestScoreOn20: number;
  examGrades: GradeEntry[];
  testGrades: GradeEntry[];
}

export default function useGetCourseGrades(courseId: string) {
  return useQuery({
    queryKey: ["course-grades", courseId],
    queryFn: async () => {
      const response = await api.get<StudentGradeSummary[]>(
        `/professor/courses/${courseId}/students/grades`
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}
