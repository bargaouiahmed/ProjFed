import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export default function useAddUniStaff() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await api.post("/administration/staff/add-existing", {
        email,
      });

      return response.data;
    },
  });
}
