import {
  Children,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { Form, Formik, type FormikConfig, type FormikValues } from "formik";
import type { FormikStepProps } from "./FormikStep";
import { cn } from "@/lib/utils";

interface FormikStepperProps extends PropsWithChildren<
  FormikConfig<FormikValues>
> {
  className?: string;
  renderButtons?: (args: {
    currentStep: number;
    isLastStep: boolean;
    nextStep: () => void;
    prevStep: () => void;
    isSubmitting: boolean;
  }) => React.ReactNode;
}

export function FormikStepper({
  children,
  className = "",
  renderButtons,
  ...props
}: FormikStepperProps) {
  const childrenArray = Children.toArray(
    children,
  ) as ReactElement<FormikStepProps>[];

  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];

  return (
    <Formik
      {...props}
      validateOnChange={step != 1}
      validateOnBlur={step != 1}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={(values, helpers) => {
        helpers.setSubmitting(true);
        if (step === childrenArray.length - 1) {
          props.onSubmit(values, helpers);
        } else {
          setStep((s) => s + 1);
        }

        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={cn(className)}>
          <>{currentChild}</>
          {renderButtons &&
            renderButtons({
              currentStep: step,
              isLastStep: step === childrenArray.length - 1,
              isSubmitting: isSubmitting,
              nextStep: () =>
                setStep((s) => Math.min(s + 1, childrenArray.length - 1)),
              prevStep: () => setStep((s) => Math.max(s - 1, 0)),
            })}
        </Form>
      )}
    </Formik>
  );
}
