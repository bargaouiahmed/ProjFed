/*
## 40. List Course Exams

- **Endpoint:** `GET /professor/courses/{courseId}/exams`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: List of `SerializedExam`
  - 400 Bad Request: Error message

---
*/

import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export default function useExams(courseId: string) {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await api.get(`/professor/courses/${courseId}/exams`);
      return response.data;
    },
  });
}
