/*
## 17. Delete Class Metadata

- **Endpoint:** `DELETE /administration/metadata/{metadataId}`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `metadataId` (GUID, required)
- **Response:**
  - 200 OK: Class metadata deleted successfully message
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
  - 403 Forbidden: Not allowed to delete this metadata
- **Side Effects:**
  - Deletes the specified ClassMetadata and all associated classes/courses (if implemented in backend)

---
*/

import { toast } from "sonner";

import { api } from "./axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteClassMetadata() {
  const queryClinet = useQueryClient();
  return useMutation({
    mutationFn: async (metadataId: string) => {
      const response = await api.delete(
        `/administration/metadata/${metadataId}`,
      );
      return response.data;
    },

    onError: () => {
      toast.error("deleting class metadata failed please try again");
    },
    onSuccess: () => {
      toast.success(" class metadata deleted succesfully");
      queryClinet.invalidateQueries({ queryKey: ["classMetadata"] });
    },
  });
}
