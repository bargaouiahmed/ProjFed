import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
}
interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export default function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (formData: FormData) => {
      const response = await api.post<Tokens>("/auth/login", {
        ...formData,
      });
      return response.data;
    },

    onError: (error) => {
      console.log(error.message);
      toast.error("Login failed. Please check your credentials and try again.");
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      toast.success("Login successful!");
      navigate({ to: "/" });
    },
  });
}
