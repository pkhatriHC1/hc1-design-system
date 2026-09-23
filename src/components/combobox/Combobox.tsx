import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "../../utils/cn";
import type {
  ComboboxOption,
  ComboboxProps,
  ComboboxSize,
  ComboboxValidation,
} from "./Combobox.types";

/**
 * HC1 Combobox — searchable Select.
 *
 * Trigger looks and sizes exactly like Select. Clicking opens a Popover
 * with a search Input at the top and the filtered options below.
 * Keyboard: type-to-search, Arrow keys navigate, Enter selects, Escape
 * closes, Home/End jump to first/last.
 *
 * Filtering is client-side by default (case-insensitive substring on
 * label + description). Consumers who need server-side search pass
 * `onSearch` — the DS skips its built-in filter and just renders whatever
 * `options` come back on the next render.
 */

/* ══════ Size ladder — matches Input / Select ══════════════════════ */

const TRIGGER_HEIGHT: Record<ComboboxSize, string> = {
  xs: "h-[var(--hc-space-20)] text-[12px]",
  sm: "h-[var(--hc-space-32)] text-[13px]",
  md: "h-[var(--hc-space-32)] text-[14px]",
  lg: "h-[var(--hc-space-48)] text-[16px]",
  xl: "h-[var(--hc-space-64)] text-[18px]",
};

/* ══════ Validation resolution ═════════════════════════════════════ */

function resolveValidation(
  errorMessage: ReactNode,
  warningMessage: ReactNode,
  successMessage: ReactNode,
  validation: ComboboxValidation | undefined,
): ComboboxValidation | undefined {
  if (errorMessage != null) return "error";
  if (warningMessage != null) return "warning";
  if (successMessage != null) return "success";
  return validation;
}

/* ══════ Default filter ════════════════════════════════════════════ */

function defaultFilter(option: ComboboxOption, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    option.label.toLowerCase().includes(q) ||
    (option.description?.toLowerCase().includes(q) ?? false)
  );
}

/* ══════ Component ═════════════════════════════════════════════════ */

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    onSearch,
    filter = defaultFilter,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results",
    size = "md",
    label,
    optional,
    requiredMarker = "*",
    required,
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    leadingIcon,
    loading,
    disabled,
    fullWidth = true,
    name,
    id,
    className,
    ...rest
  },
  forwardedRef,
) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const labelId = `${triggerId}-label`;
  const listboxId = `${triggerId}-listbox`;
  const helperId = `${triggerId}-helper`;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(forwardedRef, () => triggerRef.current as HTMLButtonElement);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (onSearch) return options;
    return options.filter((o) => filter(o, query));
  }, [options, query, filter, onSearch]);

  useEffect(() => {
    if (!open) return;
    setHighlightedIndex(0);
  }, [open, filteredOptions.length]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  const state = resolveValidation(errorMessage, warningMessage, successMessage, validation);

  const handleSelect = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;
      if (!isControlled) setUncontrolledValue(option.value);
      onChange?.(option.value, option);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [isControlled, onChange],
  );

  const moveHighlight = useCallback(
    (delta: number) => {
      if (filteredOptions.length === 0) return;
      let next = highlightedIndex;
      for (let i = 0; i < filteredOptions.length; i++) {
        next = (next + delta + filteredOptions.length) % filteredOptions.length;
        if (!filteredOptions[next]!.disabled) break;
      }
      setHighlightedIndex(next);
    },
    [filteredOptions, highlightedIndex],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveHighlight(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveHighlight(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setHighlightedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setHighlightedIndex(filteredOptions.length - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const opt = filteredOptions[highlightedIndex];
        if (opt) handleSelect(opt);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [moveHighlight, filteredOptions, highlightedIndex, handleSelect],
  );

  /* ══════ Render ═════════════════════════════════════════════════ */

  const triggerBorderColor =
    state === "error"
      ? "border-[color:var(--hc-color-status-error-fg)]"
      : state === "warning"
        ? "border-[color:var(--hc-color-status-warning-fg)]"
        : state === "success"
          ? "border-[color:var(--hc-color-status-success-fg)]"
          : "border-[color:var(--hc-color-border-default)]";

  const triggerClasses = cn(
    "group inline-flex items-center gap-2",
    "rounded-[var(--hc-radius-control)]",
    "border bg-white text-[color:var(--hc-color-text-primary)]",
    "px-3",
    "transition-[background-color,border-color,color,outline-color] duration-150 ease-standard motion-reduce:duration-0",
    "outline-none",
    "focus-visible:border-[color:var(--hc-color-border-focus)] focus-visible:ring-2 focus-visible:ring-[color:var(--hc-color-border-focus)]/25",
    "disabled:cursor-not-allowed disabled:bg-[color:var(--hc-color-bg-subtle)] disabled:text-[color:var(--hc-color-text-disabled)]",
    "aria-[expanded=true]:border-[color:var(--hc-color-border-focus)] aria-[expanded=true]:ring-2 aria-[expanded=true]:ring-[color:var(--hc-color-border-focus)]/25",
    TRIGGER_HEIGHT[size],
    triggerBorderColor,
    fullWidth ? "w-full" : "w-auto",
  );

  return (
    <div
      data-slot="combobox"
      data-size={size}
      data-state={state}
      className={cn("flex flex-col gap-1", fullWidth ? "w-full" : "w-auto", className)}
      {...rest}
    >
      {label && (
        <div className="flex items-center justify-between gap-2">
          <label
            id={labelId}
            htmlFor={triggerId}
            className="text-[13px] font-medium text-[color:var(--hc-color-text-primary)]"
          >
            {label}
            {required && (
              <span
                className="ml-0.5 text-[color:var(--hc-color-status-error-fg)]"
                aria-hidden="true"
              >
                {requiredMarker}
              </span>
            )}
          </label>
          {optional && !required && (
            <span className="text-[12px] text-[color:var(--hc-color-text-tertiary)]">
              (Optional)
            </span>
          )}
        </div>
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-labelledby={label ? labelId : undefined}
            aria-controls={listboxId}
            aria-expanded={open}
            aria-invalid={state === "error" || undefined}
            aria-describedby={helperText || errorMessage || warningMessage || successMessage ? helperId : undefined}
            disabled={disabled}
            name={name}
            data-slot="combobox-trigger"
            className={triggerClasses}
          >
            {leadingIcon && (
              <span
                data-slot="combobox-leading-icon"
                className="inline-flex shrink-0 items-center [&>svg]:size-4 text-[color:var(--hc-color-text-tertiary)]"
                aria-hidden="true"
              >
                {leadingIcon}
              </span>
            )}
            <span
              data-slot="combobox-value"
              className={cn(
                "flex-1 truncate text-left",
                !selectedOption && "text-[color:var(--hc-color-text-tertiary)]",
              )}
            >
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 opacity-60 transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            data-slot="combobox-content"
            className={cn(
              "z-[var(--hc-z-popover)] overflow-hidden",
              "rounded-[var(--hc-radius-control)]",
              "border border-[color:var(--hc-color-border-subtle)]",
              "bg-[color:var(--hc-color-bg-elevated)]",
              "shadow-[var(--hc-shadow-lg)]",
              "min-w-[var(--radix-popover-trigger-width)]",
              "max-w-[min(360px,calc(100vw-16px))]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            )}
          >
            <div className="flex items-center gap-2 border-b border-[color:var(--hc-color-border-subtle)] px-3 py-2">
              <Search
                aria-hidden="true"
                className="size-4 shrink-0 text-[color:var(--hc-color-text-tertiary)]"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  const next = e.target.value;
                  setQuery(next);
                  onSearch?.(next);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full border-0 bg-transparent p-0 text-[14px] leading-tight text-[color:var(--hc-color-text-primary)] outline-none placeholder:text-[color:var(--hc-color-text-tertiary)]"
                aria-controls={listboxId}
                aria-activedescendant={
                  filteredOptions[highlightedIndex]
                    ? `${listboxId}-opt-${highlightedIndex}`
                    : undefined
                }
              />
              {loading && (
                <Loader2
                  aria-hidden="true"
                  className="size-4 shrink-0 animate-spin text-[color:var(--hc-color-text-tertiary)]"
                />
              )}
            </div>

            <ul
              id={listboxId}
              role="listbox"
              className="m-0 max-h-[280px] overflow-y-auto p-1"
            >
              {filteredOptions.length === 0 && (
                <li className="px-3 py-4 text-center text-[13px] text-[color:var(--hc-color-text-tertiary)]">
                  {emptyMessage}
                </li>
              )}
              {filteredOptions.map((option, index) => {
                const selected = option.value === value;
                const highlighted = index === highlightedIndex;
                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-opt-${index}`}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex cursor-default select-none items-center gap-2 rounded-[var(--hc-radius-8)] px-2 py-1.5 text-[14px]",
                      option.disabled && "pointer-events-none opacity-50",
                      highlighted && !option.disabled && "bg-[color:var(--hc-color-brand-50)]",
                      selected && "text-[color:var(--hc-color-brand-700)]",
                    )}
                  >
                    {option.icon && (
                      <span
                        className="inline-flex shrink-0 [&>svg]:size-4"
                        aria-hidden="true"
                      >
                        {option.icon}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="truncate text-[12px] text-[color:var(--hc-color-text-tertiary)]">
                          {option.description}
                        </span>
                      )}
                    </span>
                    {selected && (
                      <Check
                        aria-hidden="true"
                        className="size-4 shrink-0 text-[color:var(--hc-color-brand-600)]"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {(helperText || errorMessage || warningMessage || successMessage) && (
        <div
          id={helperId}
          role={state === "error" ? "alert" : undefined}
          className={cn(
            "text-[12px] leading-normal",
            state === "error"
              ? "text-[color:var(--hc-color-status-error-fg)]"
              : state === "warning"
                ? "text-[color:var(--hc-color-status-warning-fg)]"
                : state === "success"
                  ? "text-[color:var(--hc-color-status-success-fg)]"
                  : "text-[color:var(--hc-color-text-tertiary)]",
          )}
        >
          {errorMessage ?? warningMessage ?? successMessage ?? helperText}
        </div>
      )}
    </div>
  );
});
Combobox.displayName = "Combobox";
