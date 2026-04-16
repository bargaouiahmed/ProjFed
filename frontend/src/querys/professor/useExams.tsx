/*
## 40. List Course Exams

- **Endpoint:** `GET /professor/courses/{courseId}/exams`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: List of `SerializedExam`
  - 400 Bad Request: Error message

---
*/

export interface Exam {
  courseId: string;
  createdAt: Date;
  description: string;
  id: string;
  mcqs: Mcq[];
  redactionQuestions: Rq[];
  title: string;
  totalMarks: 20;
  updatedAt: Date;
}

import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Mcq } from "./useAddExamMcq";
import type { Rq } from "./useAddExamRq";

export default function useExams(courseId: string) {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await api.get<Exam[]>(
        `/professor/courses/${courseId}/exams`,
      );
      return response.data;
    },
  });
}
