/*

## 34. Initialize Empty Chapter

- **Endpoint:** `POST /professor/courses/{courseId}/chapters/init`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: `SerializedChapter`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Creates an empty chapter with title `Untitled chapter`
  - Professor must own the course

---
*/

import { api } from "../axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export default function useInitChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await api.post(
        `/professor/courses/${courseId}/chapters/init`,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error.message || "initatising failed , please try again");
    },

    onSuccess: () => {
      toast.success("chapter inialised");
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}
