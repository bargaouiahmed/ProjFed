/*

## 39. Initialize Empty Exam

- **Endpoint:** `POST /professor/courses/{courseId}/exams/init`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: `SerializedExam`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Creates an empty exam with title `Untitled exam`

---

*/

import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useInitExam() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await api.post(
        `/professor/courses/${courseId}/exams/init`,
      );
      return response.data;
    },
  });
}
