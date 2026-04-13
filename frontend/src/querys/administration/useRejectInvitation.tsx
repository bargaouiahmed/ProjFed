import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

export default function useRejectInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.put(
        `/accounts/uni-staff-invitations/${invitationId}/reject`,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["uni-staff-invitations"],
      });
    },
  });
}
