import { Input } from "@/shared/ui/input";
import type { ComponentProps } from "react";
export function FormField({
  label,
  error,
  hint,
  id,
  ...props
}: ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? id + "-help" : undefined}
        {...props}
      />
      {(error || hint) && (
        <p id={id + "-help"} className={error ? "error-text" : "muted"}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
