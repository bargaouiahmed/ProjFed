import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";

interface FormData {
  email: string;
  password: string;
}
interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export default function useLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (formData: FormData) => {
      const response = await api.post<Tokens>("/auth/login", {
        ...formData,
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
}
