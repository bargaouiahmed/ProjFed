import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import useTryAddProf from "@/querys/professor/useTryAddProf";
import useAddNewProf from "@/querys/professor/useAddNewProf";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { IconUserPlus } from "@tabler/icons-react";

type ProfStep = "email" | "full";

interface AddProfessorFormProps {
  courseId: string;
}
export function AddProfessorForm({ courseId }: AddProfessorFormProps) {
  const [step, setStep] = useState<ProfStep>("email");
  const [pendingEmail, setPendingEmail] = useState("");

  const { mutate: tryAdd, isPending: isTrying } = useTryAddProf();
  const { mutate: addNew, isPending: isAdding } = useAddNewProf();

  function handleEmailSubmit(email: string) {
    tryAdd(
      { courseId, email },
      {
        onSuccess: () => {
          setStep("email");
          setPendingEmail("");
          toast.success("Professor added to course successfully.");
        },
        onError: (err) => {
          if (
            isAxiosError(err) &&
            (err.response?.data === "No professor with given email found" ||
              err.response?.data === "Professor doesn't exist")
          ) {
            setPendingEmail(email);
            setStep("full");
          } else {
            toast.error("Adding professor failed, please try again.");
          }
        },
      },
    );
  }

  function handleFullSubmit(firstname: string, lastname: string) {
    addNew(
      {
        params: { courseId },
        body: { email: pendingEmail, firstname, lastname },
      },
      {
        onSuccess: () => {
          setStep("email");
          setPendingEmail("");
        },
      },
    );
  }

  if (step === "email") {
    return (
      <Formik
        key="email_form"
        initialValues={{ email: "" }}
        validationSchema={yup.object({
          email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        })}
        onSubmit={(values) => handleEmailSubmit(values.email.trim())}
      >
        {() => (
          <Form className="grid gap-3 rounded-md border p-4">
            <p className="text-sm font-medium">Add professor</p>
            <FormikInput name="email" label="Professor email" type="email" />
            <div className="flex justify-end">
              <Button type="submit" disabled={isTrying}>
                <IconUserPlus className="mr-1" size={16} />
                {isTrying ? "Checking…" : "Add professor"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Formik
      key="full_form"
      initialValues={{ firstname: "", lastname: "" }}
      validationSchema={yup.object({
        firstname: yup.string().required("First name is required"),
        lastname: yup.string().required("Last name is required"),
      })}
      onSubmit={(values) =>
        handleFullSubmit(values.firstname.trim(), values.lastname.trim())
      }
    >
      {() => (
        <Form className="grid gap-3 rounded-md border p-4">
          <div>
            <p className="text-sm font-medium">New professor account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              No account found for{" "}
              <span className="font-medium text-foreground">
                {pendingEmail}
              </span>
              . Please provide their name to create one.
            </p>
          </div>
          <FormikInput name="firstname" label="First name" />
          <FormikInput name="lastname" label="Last name" />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("email");
                setPendingEmail("");
              }}
            >
              Back
            </Button>
            <Button type="submit" disabled={isAdding}>
              <IconUserPlus className="mr-1" size={16} />
              {isAdding ? "Adding…" : "Create & add"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
