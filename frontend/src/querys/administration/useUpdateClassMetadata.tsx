import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface UpdateClassMetadataData {
  metadataId: string;
  levelOfStudies: string;
  specialty: string;
  maxYears: number;
  level: number;
  maxTerms: number;
  numberOfClasses: number;
}

export default function useUpdateClassMetadata() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateClassMetadataData) => {
      const response = await api.put("/administration/metadata", data);
      return response.data;
    },

    onSuccess: () => {
      toast.success("class metadata updated succesfully");
      queryClient.invalidateQueries({ queryKey: ["classMetadata"] });
    },

    onError: () => {
      toast.error("updating class metadata failed please try again.");
    },
  });
}
