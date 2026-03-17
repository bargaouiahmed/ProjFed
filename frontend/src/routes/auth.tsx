import SignIn from "@/components/examples/signIn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignIn />
    </div>
  );
}
