import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface Props {
  classId: string;
  enabled?: boolean;
}

export default function useListClassCourses({ classId, enabled }: Props) {
  return useQuery({
    queryKey: ["class-courses", classId],
    enabled,
    queryFn: async () => {
      const res = await api.get(`/administration/classes/${classId}/courses`);
      return res.data;
    },
  });
}
