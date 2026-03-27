import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface ClassMetaData {
  metadataId: string;
  levelOfStudies: string;
  specialty: string;
  maxYears: number;
  level: number;
  maxTerms: number;
  numberOfClasses: number;
}

export default function useUpdateClass() {
  return useMutation({
    mutationFn: async (data: ClassMetaData) => {
      const response = await api.put("/administration/metadata", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Class metadata updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update class metadata.");
    },
  });
}
