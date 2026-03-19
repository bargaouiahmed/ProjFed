import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
export default function useRegisterStudent() {
  return useMutation({
    mutationKey: [],
    mutationFn: async (formData: FormData) => {
      const response = await api.post<string>("/student/auth/register", {
        ...formData,
      });

      return response.data;
    },
    onError: (error) => {
      toast.error(error.message || "registration failed");
      console.log(error);
    },
    onSuccess: (message) => {
      toast.success(message || "registration succesed");
      console.log(message);
    },
  });
}
