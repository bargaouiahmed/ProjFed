import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface AddProfToClass {
  courseId: string;
  data: {
    email: string;
  };
}

export default function useAddNewProfToClass() {
  return useMutation({
    mutationFn: async ({ courseId, data }: AddProfToClass) => {
      const response = await api.post(
        `/administration/courses/${courseId}/professors/add-existing`,
        data,
      );
      return response.data;
    },

    onSuccess: () => {
      toast.success("Professor assignment processed");
    },
    onError: () => {
      toast.error("adding professor failed please try again");
    },
  });
}
