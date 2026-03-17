import Login from "@/components/examples/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      auth <Login />
    </div>
  );
}
