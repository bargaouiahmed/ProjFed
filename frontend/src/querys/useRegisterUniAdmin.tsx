import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
export interface RegisterAdmin {
  adminFirstname?: string;
  adminLastname?: string;
  adminEmail?: string;
  adminPassword?: string;
  name?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  proofDocument?: File;
  identityDocument?: File;
}

export default function useRegisterUniAdmin() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["register admin"],
    mutationFn: async (formData: FormData) => {
      const response = await api.post<string>(
        "/institute/auth/admin/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },

    onSuccess: () => {
      navigate({ to: "/auth" });
      toast.success("your request is submitted we will send you an email soon");
    },

    onError: (error) => {
      console.log(error.message);
      toast.warning("registration failed account with this email might exists");
    },
  });
}
