import FormikStep from "@/components/form/FormikStep";
import { FormikStepper } from "@/components/form/FormikStepper";
import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import useRegisterUniAdmin from "@/querys/useRegisterUniAdmin";
import {
  IconLoader,
  IconLock,
  IconLockOpen,
  IconMail,
  IconMap,
  IconSchool,
  IconUser,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as yup from "yup";
import ThemeToggler from "@/components/ThemeToggler";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/uni/admin/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const { mutate: register } = useRegisterUniAdmin();

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-8">
      <Card
        className={cn(
          "w-full max-w-2xl shadow-lg relative",
          theme === "dark" ? "bg-grain" : "bg-card",
        )}
      >
        <section className="absolute top-4 right-4">
          <ThemeToggler />
        </section>
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">
            Register University Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormikStepper
            className="flex flex-col space-y-6"
            renderButtons={({
              currentStep,
              isLastStep,
              isSubmitting,
              prevStep,
            }) => (
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <IconLoader className="animate-spin" />
                  ) : isLastStep ? (
                    "Register"
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            )}
            onSubmit={(values) => {
              const formData = new FormData();

              Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
              });

              console.log("Submitting form data:");
              for (const [key, value] of formData.entries()) {
                console.log(key, value);
              }

              register(formData);
            }}
            initialValues={{
              adminFirstname: "",
              adminLastname: "",
              adminEmail: "",
              adminPassword: "",
              name: "",
              country: "",
              city: "",
              postalCode: "",
              proofDocument: null,
              identityDocument: null,
            }}
          >
            {/* STEP 1 */}
            <FormikStep
              className="flex flex-col gap-4"
              title="Admin Information"
              validationSchema={yup.object({
                adminFirstname: yup.string().required("First name is required"),
                adminLastname: yup.string().required("Last name is required"),
                adminEmail: yup
                  .string()
                  .email("Invalid email")
                  .required("Email is required"),
                adminPassword: yup
                  .string()
                  .min(8, "Password must be at least 8 characters")
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+*#]).{8,}$/,
                    "Password must contain uppercase, number and special character",
                  )
                  .required("Password is required"),
              })}
            >
              <FormikInput
                label="First Name"
                name="adminFirstname"
                type="text"
                rightElement={<IconUser />}
              />
              <FormikInput
                label="Last Name"
                name="adminLastname"
                type="text"
                rightElement={<IconUser />}
              />
              <FormikInput
                label="Email"
                name="adminEmail"
                type="email"
                rightElement={<IconMail />}
              />
              <FormikInput
                label="Password"
                name="adminPassword"
                type={showPassword ? "text" : "password"}
                rightElement={
                  <div
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                  >
                    {showPassword ? <IconLockOpen /> : <IconLock />}
                  </div>
                }
              />
            </FormikStep>

            {/* STEP 2 */}
            <FormikStep
              className="flex flex-col gap-4"
              title="University Information"
              validationSchema={yup.object({
                name: yup.string().required("University name is required"),
                country: yup.string().required("Country is required"),
                city: yup.string().required("City is required"),
                postalCode: yup.string().required("Postal code is required"),
              })}
            >
              <FormikInput
                label="University Name"
                name="name"
                type="text"
                rightElement={<IconSchool />}
              />
              <FormikInput
                label="Country"
                name="country"
                type="text"
                rightElement={<IconMap />}
              />
              <FormikInput
                label="City"
                name="city"
                type="text"
                rightElement={<IconMap />}
              />
              <FormikInput
                label="Postal Code"
                name="postalCode"
                type="text"
                rightElement={<IconMap />}
              />
            </FormikStep>

            {/* STEP 3 */}
            <FormikStep
              className="flex flex-col gap-4"
              title="Documents Upload"
              validationSchema={yup.object({
                proofDocument: yup
                  .mixed()
                  .test(
                    "fileRequired",
                    "Proof document is required",
                    (value) => value instanceof File,
                  ),
                identityDocument: yup
                  .mixed()
                  .test(
                    "fileRequired",
                    "Identity document is required",
                    (value) => value instanceof File,
                  ),
              })}
            >
              <FormikInput
                name="proofDocument"
                label="Proof Document:"
                type="file"
              />
              <FormikInput
                name="identityDocument"
                label="Identity Document:"
                type="file"
              />
            </FormikStep>
          </FormikStepper>
        </CardContent>
      </Card>
    </div>
  );
}
