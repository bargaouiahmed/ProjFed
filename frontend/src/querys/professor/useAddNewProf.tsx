import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

interface props {
  params: {
    courseId: string;
  };
  body: {
    email: string;
    firstname: string;
    lastname: string;
  };
}

export default function useAddNewProf() {
  return useMutation({
    mutationFn: async ({ params, body }: props) => {
      const response = await api.post(
        `/administration/courses/${params.courseId}/professors`,
        body,
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("proffesor added to course successfully");
    },
    onError: () => {
      toast.error("failed to add professor please try again");
    },
  });
}
