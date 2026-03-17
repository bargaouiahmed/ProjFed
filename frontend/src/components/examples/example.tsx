import { useCounter } from "@/store/useCounter";
import { Button } from "../ui/button";
import useTodos from "@/querys/useTodos";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../theme-provider";
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
export default function Example() {
  const counter = useCounter();
  const { setTheme, theme } = useTheme();
  const { data: todo, isError, refetch } = useTodos();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  if (isError) return <div>error occured please try again</div>;
  // if (isLoading) return <p>loading...</p>;
  return (
    <main className="flex flex-col justify-center items-center mt-40 gap-2">
      <div className="grid grid-cols-2 items-center">
        <p>{counter.count}</p>
        <Button variant={"outline"} size={"icon"} onClick={counter.inc}>
          +
        </Button>
      </div>

      <Button
        onClick={() => {
          refetch();
        }}
      >
        fetch todo
      </Button>

      <Button onClick={toggleTheme} variant={"secondary"}>
        toggle theme
      </Button>
      <AnimatePresence mode="wait">
        {todo && (
          <motion.p
            key={todo.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {todo.title} - {String(todo.completed)}
          </motion.p>
        )}
      </AnimatePresence>
    </main>
  );
}
