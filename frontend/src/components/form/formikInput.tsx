import { cn } from "@/lib/utils";
import { useField, useFormikContext } from "formik";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const BaseInput = ({
  label,
  error,
  icon,
  rightElement,
  className,
  ...props
}: BaseInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        className={cn("text-sm font-medium pl-1", error && "text-red-400")}
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-transparent outline-none transition",
            "focus:ring-2",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-input focus:ring-primary",
            className,
          )}
        />

        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      <div className="h-2">
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
};

interface FormikInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const FormikInput = ({
  name,
  type = "text",

  ...props
}: FormikInputProps) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  if (type === "file") {
    return (
      <BaseInput
        {...props}
        name={name}
        type="file"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          setFieldValue(name, file);
        }}
        error={meta.touched && meta.error ? meta.error : ""}
      />
    );
  }

  return (
    <BaseInput
      {...field}
      {...props}
      type={type}
      error={meta.touched && meta.error ? meta.error : ""}
    />
  );
};
