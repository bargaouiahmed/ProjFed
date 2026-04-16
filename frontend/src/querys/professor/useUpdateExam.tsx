/*
## 42. Update Exam

- **Endpoint:** `PUT /professor/exams`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `id` (GUID, required)
  - `title` (string, optional)
  - `description` (string, optional)
  - `totalMarks` (int, optional)
- **Response:**
  - 200 OK: Updated `SerializedExam`
  - 400 Bad Request: Error message

---


*/
interface Exam {
  id: string;
  title?: string;
  description: string;
  totalMarks?: number;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Exam) => {
      const response = await api.put(`/professor/exams`, data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("exam updated successfully");
    },
    onError: () => {
      toast.error("failed to update please try again");
    },
  });
}
