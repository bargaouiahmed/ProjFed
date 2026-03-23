import { cn } from "@/lib/utils";
import type { FormikConfig, FormikValues } from "formik";
import type { PropsWithChildren } from "react";

export type FormikStepProps = Pick<
  FormikConfig<FormikValues>,
  "validate" | "validationSchema"
> & {
  title: string;
  className?: string;
};

export default function FormikStep({
  className,
  children,
}: PropsWithChildren<FormikStepProps>) {
  return <div className={cn(className)}>{children}</div>;
}
