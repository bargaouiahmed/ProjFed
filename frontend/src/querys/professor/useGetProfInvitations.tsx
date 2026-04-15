import { api } from "../axios";
import { useQuery } from "@tanstack/react-query";

export interface ProfessorInvitation {
  id: string;
  courseId: string;
  courseName: string;
  classPrettyName: string;
  status: string;
  invitedAt: string;
  institueName: string;
}

export default function useGetProfInvitations() {
  return useQuery({
    queryKey: ["professor-invitations"],
    queryFn: async () => {
      const response = await api.get<ProfessorInvitation[]>(
        "/accounts/professor-invitations",
      );
      return response.data;
    },
  });
}
