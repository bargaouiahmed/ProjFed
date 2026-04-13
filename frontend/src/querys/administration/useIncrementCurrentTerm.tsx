/*
## 26. Increment Class Metadata Term

- **Endpoint:** `POST /administration/metadata/{metadataId}/increment-term`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `metadataId` (GUID, required)
- **Response:**
  - 200 OK: current term as integer
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Increments `ClassMetadata.CurrentTerm` by 1
  - Fails if the caller is outside the institute or if `CurrentTerm >= MaxTerms`

---
*/

import { api } from "../axios";

import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useIncrementCurrentTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (metadataId: string) => {
      const response = await api.post(
        `/administration/metadata/${metadataId}/increment-term`,
      );
      return response.data;
    },

    onError: () => {
      toast.error("failed to increment current term please try again");
    },

    onSuccess: () => {
      toast.success("current term incremented");
      queryClient.invalidateQueries({ queryKey: ["classMetadata"] });
    },
  });
}
