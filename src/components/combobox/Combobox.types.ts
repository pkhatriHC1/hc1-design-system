import type { HTMLAttributes, ReactNode } from "react";

export type ComboboxSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ComboboxValidation = "error" | "warning" | "success";

/**
 * A single option in the Combobox's option list. Same shape as SelectOption
 * so the two are droppable.
 */
export type ComboboxOption = {
  /** Human-readable label shown in the row and in the trigger when selected. */
  label: string;
  /** Value written back through `onChange` when this option is selected. */
  value: string;
  /** Optional secondary text shown under the label. */
  description?: string;
  /** Optional leading icon rendered inside the option row. */
  icon?: ReactNode;
  /** Disabled options are visible but unselectable and skipped by keyboard nav. */
  disabled?: boolean;
  /** Group header this option belongs to. Options with the same group render together. */
  group?: string;
};

export type ComboboxProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  /** The option list. */
  options: ComboboxOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial selected value. */
  defaultValue?: string;
  /** Fires when the selected value changes. */
  onChange?: (value: string, option: ComboboxOption) => void;

  /**
   * Optional server-side search callback. When provided, the DS skips
   * built-in client filtering and defers to whatever `options` the
   * consumer passes in response.
   */
  onSearch?: (query: string) => void;
  /**
   * Custom filter predicate. Default: case-insensitive substring match
   * on `label` + `description`.
   */
  filter?: (option: ComboboxOption, query: string) => boolean;

  /** Trigger placeholder when nothing is selected. */
  placeholder?: string;
  /** Placeholder inside the search input at the top of the popup. */
  searchPlaceholder?: string;
  /** Message shown in the popup when no options match. */
  emptyMessage?: ReactNode;

  /**
   * Size ladder — aligned with Input / Button / Select so a Combobox on
   * the same row as any of them sits pixel-flush.
   * @default 'md'
   */
  size?: ComboboxSize;

  /**
   * Visible label. Rendered above the trigger and linked to the trigger
   * via `aria-labelledby`.
   */
  label?: ReactNode;
  /** Optional "(Optional)" marker next to the label. Ignored when required. */
  optional?: boolean;
  /** Custom required-marker character. @default '*' */
  requiredMarker?: ReactNode;
  /** Native required semantics — renders a required marker on the label. */
  required?: boolean;

  /** Helper text under the trigger. Suppressed while a validation message shows. */
  helperText?: ReactNode;
  /** Error message — applies error state + `aria-invalid`. */
  errorMessage?: ReactNode;
  /** Warning message — applies warning state. */
  warningMessage?: ReactNode;
  /** Success message — applies success state. */
  successMessage?: ReactNode;
  /** Explicit validation state without a message. */
  validation?: ComboboxValidation;

  /** Icon rendered inside the trigger before the selected label. */
  leadingIcon?: ReactNode;

  /** Show a spinner in the popup — for async search / loading options. */
  loading?: boolean;

  /** Native disabled — trigger doesn't open and shows the muted surface. */
  disabled?: boolean;

  /**
   * Grow the trigger to fill its parent's width. Defaults on so a
   * Combobox in a form sits at the column width.
   * @default true
   */
  fullWidth?: boolean;

  /** Native name for form association. */
  name?: string;
  /** Override the auto-generated trigger id. */
  id?: string;
};
