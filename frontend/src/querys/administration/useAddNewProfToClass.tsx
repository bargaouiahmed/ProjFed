import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface AddProfToClass {
  courseId: string;
  data: {
    email: string;
    firstname: string;
    lastname: string;
  };
}

export default function useAddNewProfToClass() {
  return useMutation({
    mutationFn: async ({ courseId, data }: AddProfToClass) => {
      const response = await api.post(
        `/administration/courses/${courseId}/professors`,
        data,
      );
      return response.data;
    },

    onSuccess: () => {
      toast.success("Professor invitation created");
    },
    onError: () => {
      toast.error("invitation failed please try again");
    },
  });
}
