import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface UniClass {
  id: string;
  number: string;
  classCode: string;
  className: string;
  currentTerm: string;
  maxTerms: string;
}

export default function useListMClasses({
  metadataId,
  enabled,
}: {
  metadataId: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["listclasses"],
    queryFn: async () => {
      const response = await api.get<UniClass[]>(
        `/administration/metadata/${metadataId}/classes`,
      );
      return response.data;
    },

    enabled,
  });
}
