import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface QueryParameters {
  instituteId: string;
  pageNumber?: number;
  pageSize?: number;
}

export default function useGetClassMetadata({
  instituteId,
  pageNumber,
  pageSize,
}: QueryParameters) {
  return useQuery({
    queryKey: ["classMetadata"],
    queryFn: async () => {
      const response = await api.get("/administration/metadata", {
        params: {
          instituteId,
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    },
  });
}
