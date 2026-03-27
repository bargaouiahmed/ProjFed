import ErrorComponent from "@/components/ErrorComponent";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <main>
      <Outlet />
      <Toaster />
    </main>
  );
}
