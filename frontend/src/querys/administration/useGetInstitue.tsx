import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export default function useGetInstitue() {
  return useQuery({
    queryKey: ["institutes"],
    queryFn: async () => {
      const response = await api.get<{ id: string }>(
        "/administration/staff/institute",
      );
      return response.data;
    },
  });
}
