import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface RegisterUniStaff {
  firstname: string;
  lastname: string;
  email: string;
}

export default function useRegisterUniStaff() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post<RegisterUniStaff>(
        "/administration/staff/register",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Staff invitation created successfully!");
    },
    onError: () => {
      toast.error("Failed to register staff.please try again!");
    },
  });
}
