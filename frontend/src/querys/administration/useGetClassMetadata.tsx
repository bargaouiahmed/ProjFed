import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface QueryParameters {
  instituteId: string;
  pageNumber?: number;
  pageSize?: number;
}

interface ClassMetadata {
  metadataId: string;
  specialty: string;
  levelOfStudies: string;
  maxYears: number;
  level: number;
  maxTerms: number;
  numberOfClasses: number;
}

export default function useGetClassMetadata({
  instituteId,
  pageNumber,
  pageSize,
  enabled,
}: QueryParameters & { enabled: boolean }) {
  return useQuery({
    queryKey: ["classMetadata", instituteId, pageNumber, pageSize],
    queryFn: async () => {
      const response = await api.get<ClassMetadata[]>(
        "/administration/metadata",
        {
          params: {
            instituteId,
            pageNumber,
            pageSize,
          },
        },
      );
      return response.data;
    },
    enabled,
  });
}
