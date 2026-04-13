import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

export default function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.put(
        `/accounts/uni-staff-invitations/${invitationId}/accept`,
      );
      return response.data;
    },

    onSuccess: () => {
      // refresh invitations list
      queryClient.invalidateQueries({
        queryKey: ["uni-staff-invitations"],
      });
    },
  });
}
