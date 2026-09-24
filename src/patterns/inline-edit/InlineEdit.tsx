import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";
import { Button } from "../../components/button";
import { cn } from "../../utils/cn";

/**
 * InlineEdit — the read ↔ edit toggle pattern.
 *
 * Renders the current value as text with a subtle edit affordance on
 * hover. Click / focus enters edit mode: an Input (or Textarea) with
 * Save + Cancel buttons. Enter saves, Escape cancels — the standard
 * keyboard grammar.
 *
 * Consumer owns the value. The DS calls `onSave` when the user commits
 * and the draft value is different from the current value; consumers
 * update state and (typically) fire an API call from there.
 *
 *   <InlineEdit
 *     value={patient.name}
 *     onSave={(next) => savePatient({ ...patient, name: next })}
 *   />
 */

export type InlineEditProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSave"> & {
  /** Current value. */
  value: string;
  /**
   * Fired when the user saves. Receives the new value; only fires when
   * the draft differs from the current value.
   */
  onSave: (value: string) => void;
  /** Called when the user cancels edit mode. */
  onCancel?: () => void;
  /** Placeholder when the value is empty. @default 'Click to edit' */
  placeholder?: string;
  /**
   * Multi-line edit surface — renders Textarea inside instead of Input.
   * @default false
   */
  multiline?: boolean;
  /** Disable edit mode entirely — renders as read-only text. */
  disabled?: boolean;
  /**
   * Custom read-mode renderer. Receives the current value and returns
   * the read view (formatted date, badge, etc.). Overrides default text.
   */
  renderValue?: (value: string) => ReactNode;
  /** Label used on the edit affordance for AT ("Edit name"). */
  editLabel?: string;
};

export function InlineEdit({
  value,
  onSave,
  onCancel,
  placeholder = "Click to edit",
  multiline = false,
  disabled = false,
  renderValue,
  editLabel = "Edit",
  className,
  ...rest
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [editing, value]);

  const enterEdit = () => {
    if (disabled) return;
    setEditing(true);
  };

  const save = () => {
    if (draft !== value) onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      save();
    } else if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    }
  };

  if (!editing) {
    const displayValue = value || placeholder;
    const isEmpty = !value;
    return (
      <div
        data-slot="inline-edit"
        data-mode="read"
        className={cn(
          "group inline-flex max-w-full items-center gap-1.5",
          "rounded-[var(--hc-radius-8)] px-2 py-1",
          !disabled && "cursor-text hover:bg-[color:var(--hc-color-bg-subtle)]",
          disabled && "cursor-default",
          className,
        )}
        onClick={enterEdit}
        {...rest}
      >
        <span
          className={cn(
            "min-w-0 truncate",
            isEmpty ? "text-[color:var(--hc-color-text-tertiary)] italic" : "text-[color:var(--hc-color-text-primary)]",
          )}
        >
          {renderValue && !isEmpty ? renderValue(value) : displayValue}
        </span>
        {!disabled && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={editLabel}
            onClick={(e) => {
              e.stopPropagation();
              enterEdit();
            }}
            className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <Pencil />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="inline-edit"
      data-mode="edit"
      className={cn("flex flex-col gap-1.5", className)}
      {...rest}
    >
      {multiline ? (
        <Textarea
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          minRows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      ) : (
        <Input
          ref={inputRef as React.Ref<HTMLInputElement>}
          size="sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      )}
      <div className="flex items-center gap-1.5">
        <Button variant="default" size="sm" onClick={save}>
          <Check />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={cancel}>
          <X />
          Cancel
        </Button>
        {!multiline && (
          <span className="ml-auto text-[11px] text-[color:var(--hc-color-text-tertiary)]">
            Enter to save · Esc to cancel
          </span>
        )}
      </div>
    </div>
  );
}
