/*
- **Endpoint:** `DELETE /administration/courses/{courseId}/professors`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: `Professor removed from course successfully.`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claim
- **Side Effects:**
  - Clears the course's assigned professor

---
*/

import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useRemoveProfFromCourse() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await api.delete(
        `/administration/courses/${courseId}/professors`,
      );
      return response.data;
    },

    onSuccess: (message) => {
      toast.success(message);
    },
    onError: () => {
      toast.success("failed to remove professor please try again");
    },
  });
}
