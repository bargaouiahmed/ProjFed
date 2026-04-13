import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useAddClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ metadataId }: { metadataId: string }) => {
      const response = await api.post(
        "/administration/metadata/addClass",
        {},
        {
          params: {
            metadataId,
          },
        },
      );
      return response.data;
    },

    onSuccess: () => {
      toast.success("Class added successfully!");
      queryClient.invalidateQueries({ queryKey: ["classMetadata"] });
    },

    onError: () => {
      toast.error("failed to add class , please try again");
    },
  });
}
