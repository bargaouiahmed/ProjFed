import { cn } from "@/lib/utils";
import { useField, useFormikContext } from "formik";
import { useRef, useState } from "react";
import { IconUpload } from "@tabler/icons-react";

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
    <div
      className={cn(
        "flex flex-col gap-2",
        className?.includes("hidden") && "hidden",
      )}
    >
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
  className?: string;

  setLocalPreview?: (file: File) => void;
}

export const FormikInput = ({
  name,
  type = "text",
  className,
  setLocalPreview,
  ...props
}: FormikInputProps) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (type === "file") {
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setFieldValue(name, file);
        if (setLocalPreview) {
          setLocalPreview(file);
        }
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const selectedFile = field.value as File | null;

    return (
      <div
        className={cn(
          "flex flex-col gap-2",
          className?.includes("hidden") && "hidden",
        )}
      >
        <label
          className={cn(
            "text-sm font-medium pl-1",
            meta.touched && meta.error && "text-red-400",
          )}
        >
          {props.label}
        </label>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-primary bg-primary/10"
              : selectedFile
                ? "border-green-400 bg-green-50 dark:bg-green-950"
                : "border-muted-foreground/25 hover:border-primary/50",
            meta.touched && meta.error && "border-red-400",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              setFieldValue(name, file);
              if (setLocalPreview && file) {
                setLocalPreview(file);
              }
            }}
          />

          <IconUpload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : "Click to select or drag and drop a file"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: JPG, PNG, PDF (max 25MB)
          </p>
        </div>

        <div className="h-2">
          {meta.touched && meta.error && (
            <p className="text-sm text-red-400">{meta.error}</p>
          )}
        </div>
      </div>
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
