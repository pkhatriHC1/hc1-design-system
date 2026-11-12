import { useId, useRef, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { CloudUpload } from "lucide-react";
import { cn } from "../../utils/cn";
import { Badge } from "../../components/badge";

/**
 * FileUpload — the one drop zone for every hc1 product.
 *
 * SourceIQ standard (2026-11-11), taken from the "Add Files to Analyze"
 * flow: dashed 2px border, radius 12, 48px padding, upload icon, title,
 * supporting line, file-type chips, size hint. Products supply the
 * accepted types and a handler; they never restyle the zone.
 *
 *   <FileUpload
 *     accept={[".pdf", ".xlsx", ".csv", ".docx"]}
 *     typeLabels={["PDF", "Excel", "CSV", "Word"]}
 *     hint="Up to 100 MB per file · Multiple files supported"
 *     multiple
 *     onFiles={(files) => startUpload(files)}
 *   />
 *
 * The whole zone is a native <label> for a hidden <input type="file">,
 * so click, keyboard (Enter/Space on the focused zone) and screen
 * readers work without extra wiring.
 */
export type FileUploadProps = {
  /** Called with the chosen or dropped files. */
  onFiles: (files: File[]) => void;
  /** File extensions or MIME types passed to the input's `accept`. */
  accept?: string[];
  /** Human-readable type chips, e.g. ["PDF", "Excel", "CSV"]. */
  typeLabels?: string[];
  /** Size / count hint under the chips. */
  hint?: ReactNode;
  /** Allow several files. @default false */
  multiple?: boolean;
  /** @default "Drag and drop files here" */
  title?: ReactNode;
  /** @default "or click to browse your computer" */
  description?: ReactNode;
  disabled?: boolean;
};

export function FileUpload({
  onFiles,
  accept,
  typeLabels,
  hint,
  multiple = false,
  title = "Drag and drop files here",
  description = "or click to browse your computer",
  disabled = false,
}: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <label
      htmlFor={id}
      data-slot="file-upload"
      data-dragging={dragging || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-[var(--hc-space-8)] text-center",
        "rounded-[var(--hc-radius-surface)] border-2 border-dashed p-[var(--hc-space-48)]",
        "bg-[color:var(--hc-color-bg-surface)] [font-family:var(--hc-font-sans)]",
        "transition-[background-color,border-color] duration-150 ease-standard motion-reduce:duration-0",
        dragging
          ? "border-[color:var(--hc-color-action-primary)] bg-[color:var(--hc-color-brand-50)]"
          : "border-[color:var(--hc-color-border-strong)]",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-[color:var(--hc-color-action-primary)]",
        "focus:outline-none focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
      )}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="sr-only"
        accept={accept?.join(",")}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <CloudUpload aria-hidden="true" className="size-6 text-[color:var(--hc-color-action-primary)]" />
      <span className="text-[18px] font-bold text-[color:var(--hc-color-text-heading)]">{title}</span>
      <span className="text-[14px] text-[color:var(--hc-color-text-supporting)]">{description}</span>
      {typeLabels && typeLabels.length > 0 && (
        <span className="mt-[var(--hc-space-4)] flex flex-wrap justify-center gap-[var(--hc-space-8)]">
          {typeLabels.map((t) => (
            <Badge key={t} variant="neutral" size="sm">
              {t}
            </Badge>
          ))}
        </span>
      )}
      {hint && <span className="text-[12px] text-[color:var(--hc-color-text-tertiary)]">{hint}</span>}
    </label>
  );
}
