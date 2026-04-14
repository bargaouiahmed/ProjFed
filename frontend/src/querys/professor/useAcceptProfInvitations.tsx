/*
## 32. Accept Professor Invitation

- **Endpoint:** `PUT /accounts/professor-invitations/{invitationId}/accept`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `invitationId` (GUID, required)
- **Response:**
  - 200 OK: Invitation accepted message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Sets invitation `Status = accepted`
  - Fails if the invitation does not belong to the authenticated `professor` user
  - Fails if the invitation status is already not `pending`
  - Assigns the invited professor to the invitation’s course
  - Creates a notification confirming acceptance

---
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useAcceptProfInvitations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.put(
        `/accounts/professor-invitations/${invitationId}/accept`,
      );
      return response.data;
    },

    onError: () => {
      toast.error("an error ocurred while accepting invitation");
    },

    onSuccess: () => {
      toast.success("invitation accepted");
      queryClient.invalidateQueries({ queryKey: ["professor-invitations"] });
    },
  });
}
