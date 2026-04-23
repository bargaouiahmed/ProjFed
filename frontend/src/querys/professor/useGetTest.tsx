import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import { Exam as Test } from "./useExams";

export default function useGetTest(testId: string) {
  return useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      const response = await api.get<Test>(`/professor/tests/${testId}`);
      return response.data;
    },
    enabled: !!testId,
  });
}
