import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { IconCircleCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/password-reset-success")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-6 text-center space-y-4">
        <IconCircleCheck className="mx-auto w-10 h-10 text-green-500" />
        <h2 className="text-xl font-semibold text-green-500">
          Password Reset Successful
        </h2>
        <p className="text-muted-foreground text-sm">
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>
        <Link to="/auth">
          <Button variant="secondary" className="mt-2 w-full">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
