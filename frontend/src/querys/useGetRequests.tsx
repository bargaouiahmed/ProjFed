import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";

interface Request {
  email: string;
  firstname: string;
  identityDocumentUrl: string;
  instituteCity: string;
  instituteCountry: string;
  instituteName: string;
  institutePostalCode: string;
  lastname: string;
  message: string;
  proofDocumentUrl: string;
  requestId: string;
  requestedAt: string;
  reviewedAt: string | null;
  status: string;
  totalRequestsCount: number;
}

export default function useGetRequests(pageNumber?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["requests", pageNumber, pageSize],
    queryFn: async () => {
      const response = await api.get<Request[]>("/admin/requests", {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    },
  });
}
