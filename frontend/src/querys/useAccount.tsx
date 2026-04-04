import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";

export interface Account {
  createdAt: string;
  email: string;
  firstname: string;
  id: string;
  identityId: string;
  lastname: string;
  pfpUrl: string;
  role: string;
  updatedAt: string;
  instituteId?: string;
}

export default function useAccount() {
  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await api.get<Account>("/accounts");
      return response.data;
    },
    retry: false,
  });
}
