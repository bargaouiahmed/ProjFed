import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface Props {
  classId: string;
  enabled?: boolean;
}

interface Course {
  id: string;
  courseName: string;
  description: string;
  term: string;
  studentCount: string;
}

export default function useListClassCourses({ classId, enabled }: Props) {
  return useQuery({
    queryKey: ["class-courses", classId],
    enabled,
    queryFn: async () => {
      const res = await api.get<Course[]>(
        `/administration/classes/${classId}/courses`,
      );
      return res.data;
    },
  });
}
