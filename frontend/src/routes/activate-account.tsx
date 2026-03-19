import useActivateStudentAcount from "@/querys/useActivateStudentAcount";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { IconLoader, IconCircleCheck, IconX } from "@tabler/icons-react";

const searchParams = z.object({
  id: z.string(),
  token: z.string(),
});

export const Route = createFileRoute("/activate-account")({
  component: RouteComponent,
  validateSearch: searchParams.parse,
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  const { status, data } = useActivateStudentAcount(searchParams);
  console.log(data);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-6 text-center space-y-4">
        {status === "pending" && (
          <>
            <IconLoader className="mx-auto animate-spin w-10 h-10 text-primary" />
            <h2 className="text-xl font-semibold">
              Activating your account...
            </h2>
            <p className="text-muted-foreground text-sm">
              Please wait while we verify your information.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <IconX className="mx-auto w-10 h-10 text-red-500" />
            <h2 className="text-xl font-semibold text-red-500">
              Activation Failed
            </h2>
            <p className="text-muted-foreground text-sm">
              Something went wrong. The link may be invalid or expired.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <IconCircleCheck className="mx-auto w-10 h-10 text-green-500" />
            <h2 className="text-xl font-semibold text-green-500">
              Account Activated
            </h2>
            <p className="text-muted-foreground text-sm">
              Your account has been successfully activated. You can now sign in.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
