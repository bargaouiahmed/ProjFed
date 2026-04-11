import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface ListInstitueUsers {
  params: {
    pageNumber: number;
    pageSize: number;
  };
}

interface User {
  id: string;
  identityId: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  pfpUrl: string;
  totalCount: string;
}

interface Response {
  totalCount: number;
  users: User[];
}

export default function useListInstitueUsers(data: ListInstitueUsers) {
  return useQuery({
    queryKey: ["listinstitueusers"],
    queryFn: async () => {
      const response = await api.get<Response>(
        "/administration/institute/users",
        {
          params: data.params,
        },
      );
      return response.data;
    },
  });
}
