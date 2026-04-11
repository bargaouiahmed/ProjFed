import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";
interface AddProfToCourse {
  params: {
    courseId: string;
  };
  data: {
    email: string;
    firstname: string;
    lastname: string;
  };
}

export default function useAddProfToCourse() {
  return useMutation({
    mutationFn: async ({ data, params }: AddProfToCourse) => {
      const response = await api.post(
        `/administration/courses/${params.courseId}/professors`,
        data,
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
