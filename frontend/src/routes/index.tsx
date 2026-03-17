import Example from "@/components/examples/example";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      home
      <Example />
    </main>
  );
}
