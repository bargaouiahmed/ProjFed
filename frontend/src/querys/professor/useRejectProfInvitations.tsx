/*

## 33. Reject Professor Invitation

- **Endpoint:** `PUT /accounts/professor-invitations/{invitationId}/reject`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `invitationId` (GUID, required)
- **Response:**
  - 200 OK: Invitation rejected message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Sets invitation `Status = rejected`
  - Does not assign the professor to the course
  - Creates a notification confirming rejection
  - Fails if the invitation does not belong to the authenticated `professor` user
  - Fails if the invitation status is already not `pending`

---
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useRejectProfInvitations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.put(
        `/accounts/professor-invitations/${invitationId}/reject`,
      );
      return response.data;
    },

    onError: () => {
      toast.error("an error ocurred while rejecting invitation");
    },

    onSuccess: () => {
      toast.success("invitation rejected");
      queryClient.invalidateQueries({ queryKey: ["professor-invitations"] });
    },
  });
}
