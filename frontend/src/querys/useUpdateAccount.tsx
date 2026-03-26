import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";

interface UpdateAccountFormData extends FormData {
  firstname?: string;
  lastname?: string;
  email?: string;
  pfp?: File;
}

export default function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-account"],
    mutationFn: async (formData: UpdateAccountFormData) => {
      const response = await api.put("/accounts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    onError: (error) => {
      console.log(error.message);
      toast.message("update account failed please try again");
    },

    onSuccess: () => {
      toast.success("account updated");
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
}
