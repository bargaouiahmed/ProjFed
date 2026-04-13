import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface Invitation {
  id: string;
  instituteId: string;
  instituteName: string;
  status: string;
  invitedAt: string;
}

export default function useGetInvitations() {
  return useQuery<Invitation[]>({
    queryKey: ["uni-staff-invitations"],
    queryFn: async () => {
      const response = await api.get("/accounts/uni-staff-invitations");
      return response.data;
    },
  });
}
