import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export default function useAddEProfToCourse() {
  return useMutation({
    mutationFn: async ({
      courseId,
      email,
    }: {
      courseId: string;
      email: string;
    }) => {
      const response = await api.post(
        `/administration/courses/${courseId}/professors/`,
        email,
      );
      return response.data;
    },

    onSuccess: () => {
      toast.success("invitation to professor created succesfully");
    },
    onError: () => {
      toast.success("invitation failed please try again");
    },
  });
}
