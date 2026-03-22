import FormikStep from "@/components/form/FormikStep";
import { FormikStepper } from "@/components/form/FormikStepper";
import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import useRegisterUniAdmin from "@/querys/useRegisterUniAdmin";
import { IconLoader } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import * as yup from "yup";

export const Route = createFileRoute("/admin/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: register } = useRegisterUniAdmin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <FormikStepper
        className="flex flex-col "
        renderButtons={({
          currentStep,
          isLastStep,
          isSubmitting,

          prevStep,
        }) => (
          <div className="flex justify-between  pt-4">
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
          className="flex flex-col gap-4 w-md"
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
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[+!-@#$%^&*(),.?":{}|<>])/,
                "Password must contain uppercase, number and special character",
              )
              .required("Password is required"),
          })}
        >
          <FormikInput label="First Name" name="adminFirstname" type="text" />
          <FormikInput label="Last Name" name="adminLastname" type="text" />
          <FormikInput label="Email" name="adminEmail" type="email" />
          <FormikInput label="Password" name="adminPassword" type="password" />
        </FormikStep>

        {/* STEP 2 */}
        <FormikStep
          className="flex flex-col gap-4 w-md"
          title="University Information"
          validationSchema={yup.object({
            name: yup.string().required("University name is required"),
            country: yup.string().required("Country is required"),
            city: yup.string().required("City is required"),
            postalCode: yup.string().required("Postal code is required"),
          })}
        >
          <FormikInput label="University Name" name="name" type="text" />
          <FormikInput label="Country" name="country" type="text" />
          <FormikInput label="City" name="city" type="text" />
          <FormikInput label="Postal Code" name="postalCode" type="text" />
        </FormikStep>

        {/* STEP 3 */}
        <FormikStep
          className="flex flex-col gap-4 w-md"
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
            label="Proof Document"
            type="file"
          />
          <FormikInput
            name="identityDocument"
            label="Identity Document"
            type="file"
          />
        </FormikStep>
      </FormikStepper>
    </div>
  );
}
