import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface Chapter {
  id: string;
  title?: string;
  description: string;
  attachments?: File[];
}

export default function useChapters(courseId: string) {
  return useQuery({
    queryKey: ["chapters"],
    queryFn: async () => {
      const response = await api.get<Chapter[]>(
        `/professor/courses/${courseId}/chapters`,
      );
      return response.data;
    },
  });
}
