import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["reset password"],

    mutationFn: async ({
      identityId,
      resetToken,
      newPassword,
    }: {
      identityId: string;
      resetToken: string;
      newPassword: string;
    }) => {
      const response = await api.post("/auth/reset-password", {
        identityId,
        resetToken,
        newPassword,
      });

      return response.data;
    },

    onSuccess: (message) => {
      toast.success(
        message || "your password has changed you can login with it now",
      );
      navigate({ to: "/password-reset-success" });
    },

    onError: (error) => {
      toast.error(error.message || "something went wrong please try again");
    },
  });
}
