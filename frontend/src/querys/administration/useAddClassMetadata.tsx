import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface ClassMetadata {
  specialty: string;
  instituteId: string;
  levelOfStudies: string;
  maxYears: number;
  defaultMaxTerms: number;
}

export default function useAddClassMetadata() {
  return useMutation({
    mutationFn: async (data: ClassMetadata) => {
      const response = await api.post("/administration/metadata", data);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Class metadata added successfully!");
    },

    onError: () => {
      toast.error("Failed to add class metadata. Please try again.");
    },
  });
}
