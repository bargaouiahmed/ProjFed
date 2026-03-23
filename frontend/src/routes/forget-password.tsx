import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import useRequestPasswordReset from "@/querys/useRequestPasswordReset";
import { IconLoader, IconMail } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Form, Formik, type FormikValues } from "formik";

export const Route = createFileRoute("/forget-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    mutate: sendRequest,
    isPending,
    isSuccess,
  } = useRequestPasswordReset();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 ">
      <div className="w-full max-w-md">
        <Formik
          initialValues={{ email: "" }}
          validate={validation}
          onSubmit={(values) => {
            sendRequest(values.email);
          }}
        >
          {() => (
            <Form className="bg-card rounded-2xl shadow-sm border p-6 flex flex-col gap-6">
              {/* Heading */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold">
                  Forgot your password?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we’ll send you a reset link
                </p>
              </div>

              {/* Input */}
              <FormikInput
                label="Email"
                icon={<IconMail size={18} />}
                name="email"
                placeholder="you@example.com"
              />

              {/* Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 w-full"
              >
                {isPending ? (
                  <IconLoader className="animate-spin" />
                ) : (
                  "Send reset link"
                )}
              </Button>

              {/* Success message */}
              {isSuccess && (
                <p className="text-green-600 text-sm text-center">
                  Check your email for the reset link
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}

const validation = (values: FormikValues) => {
  const errors: { email?: string } = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};
