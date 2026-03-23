import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";

export default function useAcceptRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["accept-request"],
    mutationFn: async ({ requestId }: { requestId: string }) => {
      const response = await api.put(`/admin/requests/${requestId}/accept`);
      return response.data;
    },

    onSuccess: () => {
      toast.success("request accepted");
      queryClient.invalidateQueries({ queryKey: ["accept-request"] });
    },

    onError: (error) => {
      toast.warning("acception failed");
      console.log(error.message);
    },
  });
}
