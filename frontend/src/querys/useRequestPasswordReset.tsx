import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";
export default function useRequestPasswordReset() {
  return useMutation({
    mutationKey: ["request password reset"],
    mutationFn: async (email: string) => {
      const response = await api.post(
        "/auth/request-password-reset",
        {},
        {
          params: {
            email,
          },
        },
      );

      return response.data;
    },

    onSuccess: () => {
      toast.success("Check your email for the reset link");
    },
    onError: () => {
      toast.error("somthing went wrong please try again");
    },
  });
}
