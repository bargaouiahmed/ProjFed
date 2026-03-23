import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import useResetPassword from "@/querys/useResetPassword";
import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Formik, Form, type FormikValues } from "formik";

import { useState } from "react";
import { z } from "zod";
export const Route = createFileRoute("/reset-password")({
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string().optional(),
    id: z.string().optional(),
  }),
});

function RouteComponent() {
  const { token, id } = Route.useSearch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-md">
        <Formik
          enableReinitialize:false
          initialValues={{ password: "", confirmPassword: "" }}
          validate={validation}
          onSubmit={(values) => {
            resetPassword({
              newPassword: values.password,
              resetToken: token!,
              identityId: id!,
            });
          }}
        >
          {({ isValid }) => (
            <Form className="bg-card rounded-2xl shadow-sm border p-6 flex flex-col gap-5">
              {/* Heading */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold">Reset your password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter a new password for your account
                </p>
              </div>

              <FormikInput
                name={"password"}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                }
              />

              <FormikInput
                name={"confirmPassword"}
                label="Confirm Password "
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                }
              />
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending || !isValid}
                className="mt-2 w-full"
              >
                {isPending ? (
                  <IconLoader className="animate-spin" />
                ) : (
                  "Reset password"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}

const validation = (values: FormikValues) => {
  const errors: { password?: string; confirmPassword?: string } = {};
  function isValidPassword(password: string) {
    return /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Minimum 8 characters required";
  } else if (!isValidPassword(values.password)) {
    errors.password = "Must include 1 uppercase & 1 special character";
  }

  if (!(values.confirmPassword === values.password)) {
    errors.confirmPassword = "confirm password should be equal to password";
  }

  return errors;
};
