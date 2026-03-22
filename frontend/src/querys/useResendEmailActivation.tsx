import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";

export default function useResendEmailActivation() {
  return useMutation({
    mutationKey: ["resend email activation"],
    mutationFn: async (email: string) => {
      const response = await api.post(
        "/auth/resend-activation-email",
        {},
        {
          params: { email },
        },
      );
      return response.data;
    },

    onSuccess: (message) => {
      toast.success(message);
    },

    onError: () => {
      toast.error("something went wrong please try again");
    },
  });
}
