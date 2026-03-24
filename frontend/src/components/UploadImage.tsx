import { IconCamera, IconUserCircle } from "@tabler/icons-react";

import { FormikInput } from "./form/formikInput";
import { useState } from "react";

export default function ImageUpload({
  name,
  preview,
}: {
  name: string;
  preview?: string;
}) {
  const [localPreview, setLocalPreview] = useState<string>();

  function localPreviewChange(file: File) {
    setLocalPreview(URL.createObjectURL(file));
  }
  return (
    <label className="relative cursor-pointer group">
      {preview || localPreview ? (
        <img
          src={preview || localPreview}
          className="w-24 h-24 rounded-full object-cover border"
        />
      ) : (
        <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-muted">
          <IconUserCircle size={60} />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
        <IconCamera className="text-white" />
      </div>

      {/* Hidden file input */}
      <FormikInput
        type="file"
        name={name}
        label=""
        className="hidden"
        setLocalPreview={localPreviewChange}
      />
    </label>
  );
}
