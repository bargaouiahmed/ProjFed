/*
## 26C. Reset Class Metadata Term (POST)

- **Endpoint:** `POST /administration/metadata/{metadataId}/reset-term`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `metadataId` (GUID, required)
- **Request Body:** None
- **Response:**
  - 200 OK: `ListSerializedClassMetadata`
    - `classMetaData[]`
      - `metadataId` (GUID)
      - `levelOfStudies` (string)
      - `specialty` (string)
      - `maxYears` (int)
      - `level` (int)
      - `maxTerms` (int)
      - `currentTerm` (int)
      - `numberOfClasses` (int)
    - `totalCount` (int)
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
  - 403 Forbidden: Not allowed to reset term for this metadata
- **Side Effects:**
  - Resets the `CurrentTerm` for the specified ClassMetadata to `1`
  - Returns the default metadata page for the institute using `pageNumber=1` and `pageSize=10`
  - Preferred over the GET variant for new clients because this operation mutates server state

---
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useResetCurrentTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (metadataId: string) => {
      const response = await api.post(
        `/administration/metadata/${metadataId}/reset-term`,
      );
      return response.data;
    },
    onError: () => {
      toast.error("failed to reset the current term try again");
    },
    onSuccess: () => {
      toast.success("current term reseted succesfully");
      queryClient.invalidateQueries({ queryKey: ["classMetadata"] });
    },
  });
}
