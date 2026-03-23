import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";

export default function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["accept-request"],
    mutationFn: async ({
      requestId,
      message,
    }: {
      requestId: string;
      message: string;
    }) => {
      const body = message ? { message } : {};
      const response = await api.put(
        `/admin/requests/${requestId}/reject`,
        body,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("request rejected ");
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },

    onError: (error) => {
      toast.warning("rejection failed");
      console.log(error.message);
    },
  });
}
