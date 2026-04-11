import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useResetAdminPassword() {
  return useMutation({
    mutationFn: async ({
      params,
      data,
    }: {
      params: { userId: string };
      data: { newPassword: string };
    }) => {
      const response = await api.put(
        `/admin/users/${params.userId}/reset-password`,
        data,
      );

      return response.data;
    },
  });
}
