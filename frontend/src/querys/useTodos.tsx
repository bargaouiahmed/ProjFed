import type { Todo } from "@/components/examples/example";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function useTodos() {
  return useQuery<Todo>({
    queryKey: [""],
    queryFn: async () => {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/todos/1",
      );

      return result.data;
    },
    enabled: false,
  });
}
