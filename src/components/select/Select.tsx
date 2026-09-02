import { Fragment, forwardRef, useCallback, useId, useMemo } from "react";
import type { ReactNode } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  SelectOption,
  SelectProps,
  SelectSize,
  SelectValidation,
} from "./Select.types";

/**
 * HC1 Select — the canonical single-selection control.
 *
 * Migrated from a hand-built implementation (~600 lines of keyboard nav +
 * flip positioning + outside-click + aria-activedescendant) to a wrapper
 * around @radix-ui/react-select. Radix owns: floating-ui positioning,
 * portal-to-body, focus management, keyboard nav (Arrow keys / Home / End
 * / typeahead), Escape close, and all aria wiring (role="combobox" /
 * "listbox" / "option", aria-expanded, aria-selected).
 *
 * The public API surface is preserved verbatim — data-driven `options`
 * array with `label / value / description / icon / disabled / group` on
 * each option — even though Radix Select expects compound children. We
 * translate options → Radix children internally.
 *
 * Two intentional micro-differences worth flagging:
 *   - Focus model: Radix uses roving focus on the listbox (moves focus
 *     INTO the popup on open, restores to trigger on close). Our previous
 *     impl kept focus on the trigger via aria-activedescendant. Both are
 *     valid ARIA patterns; Radix's is the standard listbox pattern.
 *   - Bonus: Radix adds typeahead (typing letters jumps to matching
 *     option). Pure addition, not a break.
 */

/* ══════ ICONS ═════════════════════════════════════════════════════ */

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="block">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="block">
      <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════ HELPERS ═══════════════════════════════════════════════════ */

function resolveValidation(
  errorMessage: unknown,
  warningMessage: unknown,
  successMessage: unknown,
  validation: SelectValidation | undefined,
): SelectValidation | undefined {
  if (errorMessage)   return "error";
  if (warningMessage) return "warning";
  if (successMessage) return "success";
  return validation;
}

/** Group options in first-appearance order, preserving intra-group order. */
function groupOptions(options: SelectOption[]): Array<{ name: string; items: SelectOption[] }> {
  const groups: Array<{ name: string; items: SelectOption[] }> = [];
  const byName = new Map<string, SelectOption[]>();
  for (const opt of options) {
    const name = opt.group ?? "";
    if (!byName.has(name)) {
      const items: SelectOption[] = [];
      byName.set(name, items);
      groups.push({ name, items });
    }
    byName.get(name)!.push(opt);
  }
  return groups;
}

/* ══════ CVA — TRIGGER ════════════════════════════════════════════ */

/**
 * Trigger matches the Input frame exactly — same border, radius, focus
 * ring, disabled bg, validation state palette. Reuse via
 * `import { inputFrameVariants }` when Combobox / MultiSelect land.
 */
type FrameState = "default" | "error" | "warning" | "success" | "disabled";

const selectTriggerVariants = cva(
  cn(
    "relative flex items-center w-full min-w-0",
    "border rounded-control bg-white text-neutral-900",
    "font-sans leading-none",
    "cursor-pointer [-webkit-tap-highlight-color:transparent]",
    "transition-[background-color,border-color,color,outline-color] duration-150 ease-standard motion-reduce:duration-0",
    "border-neutral-200",
    "outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:border-brand-500",
    "hover:border-neutral-300",
    "data-[state=open]:border-brand-500",
    /* Text alignment inside trigger: label left, chevron right. */
    "text-left",
  ),
  {
    variants: {
      size: {
        xs: cn(
          "h-[20px] px-4 gap-4 text-12 rounded-[4px]",
          "[&_[data-slot=select-leading]_svg]:size-[12px]",
          "[&_[data-slot=select-chevron]_svg]:size-[12px]",
        ),
        sm: cn(
          "h-[28px] px-8 gap-4 text-12",
          "[&_[data-slot=select-leading]_svg]:size-[14px]",
          "[&_[data-slot=select-chevron]_svg]:size-[14px]",
        ),
        md: cn(
          "h-[36px] px-12 gap-8 text-14",
          "[&_[data-slot=select-leading]_svg]:size-[16px]",
          "[&_[data-slot=select-chevron]_svg]:size-[16px]",
        ),
        lg: cn(
          "h-[44px] px-12 gap-8 text-16",
          "[&_[data-slot=select-leading]_svg]:size-[20px]",
          "[&_[data-slot=select-chevron]_svg]:size-[20px]",
        ),
        xl: cn(
          "h-[56px] px-16 gap-12 text-18",
          "[&_[data-slot=select-leading]_svg]:size-[24px]",
          "[&_[data-slot=select-chevron]_svg]:size-[24px]",
        ),
      },
      state: {
        default: "",
        error: cn(
          "border-red-500",
          "hover:border-red-500",
          "focus-visible:border-red-500 focus-visible:outline-red-500",
          "data-[state=open]:border-red-500",
        ),
        warning: cn(
          "border-accent-700",
          "hover:border-accent-700",
          "focus-visible:border-accent-700 focus-visible:outline-accent-700",
          "data-[state=open]:border-accent-700",
        ),
        success: cn(
          "border-green-500",
          "hover:border-green-500",
          "focus-visible:border-green-500 focus-visible:outline-green-500",
          "data-[state=open]:border-green-500",
        ),
        disabled: cn(
          "bg-neutral-100 border-neutral-100 text-neutral-400 cursor-not-allowed",
          "hover:border-neutral-100",
        ),
      },
      loading: {
        true: "cursor-progress",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
      loading: false,
    },
  },
);

/* ══════ CVA — POPUP + LISTBOX ════════════════════════════════════ */

const selectPopupVariants = cva(
  cn(
    "z-popover overflow-hidden",
    "rounded-control border border-neutral-200 bg-white text-neutral-900",
    "shadow-lg",
    "font-sans text-14",
    "min-w-[var(--radix-select-trigger-width)]",
    "max-h-[var(--radix-select-content-available-height)]",
    /* Enter/exit transitions driven by Radix data-state. */
    "opacity-0 data-[state=open]:opacity-100",
    "data-[side=bottom]:translate-y-[-2px] data-[side=top]:translate-y-[2px]",
    "data-[state=open]:translate-y-0",
    "transition-[opacity,transform] duration-150 ease-standard motion-reduce:duration-0",
    "origin-[var(--radix-select-content-transform-origin)]",
    "outline-none",
  ),
);

const selectViewportVariants = cva(
  cn(
    "flex flex-col p-4 min-w-0",
  ),
);

/* ══════ CVA — OPTION ══════════════════════════════════════════════ */

const selectOptionVariants = cva(
  cn(
    "relative flex items-center gap-8 min-w-0",
    "rounded-[6px] cursor-pointer select-none outline-none",
    "text-neutral-900",
    "transition-[background-color,color] duration-150 ease-standard motion-reduce:duration-0",
    /* Highlighted (Radix's data-highlighted, driven by keyboard OR pointer). */
    "data-[highlighted]:bg-neutral-100",
    /* Selected — show check icon in the trailing slot. */
    "data-[state=checked]:font-medium",
    /* Disabled */
    "data-[disabled]:text-neutral-400 data-[disabled]:cursor-not-allowed",
    "data-[disabled]:data-[highlighted]:bg-transparent",
  ),
  {
    variants: {
      size: {
        xs: cn(
          "min-h-[24px] py-4 px-4 text-12",
          "[&_[data-slot=select-option-icon]_svg]:size-[12px]",
          "[&_[data-slot=select-option-check]_svg]:size-[12px]",
        ),
        sm: cn(
          "min-h-[28px] py-4 px-8 text-12",
          "[&_[data-slot=select-option-icon]_svg]:size-[14px]",
          "[&_[data-slot=select-option-check]_svg]:size-[14px]",
        ),
        md: cn(
          "min-h-[36px] py-8 px-8 text-14",
          "[&_[data-slot=select-option-icon]_svg]:size-[16px]",
          "[&_[data-slot=select-option-check]_svg]:size-[16px]",
        ),
        lg: cn(
          "min-h-[44px] py-8 px-12 text-16",
          "[&_[data-slot=select-option-icon]_svg]:size-[20px]",
          "[&_[data-slot=select-option-check]_svg]:size-[20px]",
        ),
        xl: cn(
          "min-h-[52px] py-12 px-12 text-18",
          "[&_[data-slot=select-option-icon]_svg]:size-[24px]",
          "[&_[data-slot=select-option-check]_svg]:size-[24px]",
        ),
      },
      withDescription: {
        true:  "items-start",
        false: "items-center",
      },
    },
    defaultVariants: {
      size: "md",
      withDescription: false,
    },
  },
);

/* ══════ COMPONENT ═════════════════════════════════════════════════ */

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = "Select…",
    size = "md",
    label,
    optional = false,
    requiredMarker = "*",
    required,
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    leadingIcon,
    loading = false,
    fullWidth = true,
    emptyStateMessage = "No options",
    open,
    onOpenChange,
    disabled,
    className,
    id: idProp,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    ...rest
  },
  ref,
) {
  const reactId   = useId();
  const id        = idProp ?? reactId;
  const labelId   = `${id}-label`;
  const helperId  = `${id}-helper`;
  const messageId = `${id}-message`;

  /* ─── Resolved validation ─── */
  const activeValidation = resolveValidation(
    errorMessage, warningMessage, successMessage, validation,
  );
  const isError = activeValidation === "error";

  const frameState: FrameState = disabled
    ? "disabled"
    : activeValidation ?? "default";

  /* ─── aria-describedby composition ─── */
  const describedIds: string[] = [];
  if (helperText && !activeValidation) describedIds.push(helperId);
  if (activeValidation)                describedIds.push(messageId);
  const ariaDescribedBy = [ariaDescribedByProp, ...describedIds]
    .filter(Boolean)
    .join(" ") || undefined;

  /* ─── Value handling — support undefined selection ─── */
  const handleValueChange = useCallback(
    (next: string) => {
      const opt = options.find((o) => o.value === next);
      if (opt) onChange?.(next, opt);
    },
    [options, onChange],
  );

  /* ─── Group options for rendering ─── */
  const grouped = useMemo(() => groupOptions(options), [options]);

  /* ─── Selected label / icon lookup (for trigger display) ─── */
  const selectedOption = useMemo(
    () => options.find((o) => o.value === value || o.value === defaultValue),
    [options, value, defaultValue],
  );

  const showFooter = Boolean(helperText || activeValidation);
  const message =
    (errorMessage as unknown) ||
    (warningMessage as unknown) ||
    (successMessage as unknown) ||
    null;

  const isEmpty = options.length === 0;

  return (
    <div
      data-slot="select-field"
      className={cn(
        "inline-flex flex-col gap-4 font-sans text-neutral-900 min-w-0",
        fullWidth && "flex w-full",
        disabled && cn(
          "[&_[data-slot=select-label]]:text-neutral-400 [&_[data-slot=select-label]]:cursor-not-allowed",
          "[&_[data-slot=select-marker]]:text-neutral-400",
        ),
        className,
      )}
    >
      {label && (
        <div className="flex items-baseline justify-between gap-8 min-w-0">
          <span
            id={labelId}
            data-slot="select-label"
            className="text-14 leading-[1.4] font-semibold text-neutral-900 cursor-pointer"
          >
            {label}
            {required && (
              <span
                data-slot="select-marker"
                aria-hidden="true"
                className="text-12 leading-none font-semibold text-red-500 ml-4"
              >
                {requiredMarker}
              </span>
            )}
          </span>
          {!required && optional && (
            <span
              data-slot="select-marker"
              className="text-12 leading-none font-normal text-neutral-500"
            >
              Optional
            </span>
          )}
        </div>
      )}

      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={onOpenChange}
        disabled={disabled}
        required={required}
      >
        <RadixSelect.Trigger
          {...rest}
          ref={ref}
          id={id}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={ariaInvalidProp ?? (isError || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-busy={loading || undefined}
          data-slot="select-trigger"
          className={selectTriggerVariants({
            size,
            state: frameState,
            loading,
          } as VariantProps<typeof selectTriggerVariants>)}
        >
          {leadingIcon && (
            <span
              data-slot="select-leading"
              aria-hidden="true"
              className="inline-flex items-center justify-center shrink-0 text-neutral-500 [&_svg]:block"
            >
              {leadingIcon}
            </span>
          )}
          <span
            data-slot="select-value"
            className="flex-1 min-w-0 truncate"
          >
            {selectedOption ? (
              selectedOption.label
            ) : (
              <RadixSelect.Value placeholder={<span className="text-neutral-500">{placeholder}</span>} />
            )}
          </span>
          {loading ? (
            <span
              data-slot="select-spinner"
              aria-hidden="true"
              className={cn(
                "inline-block shrink-0 rounded-full size-[14px] border-2",
                "border-neutral-200 border-t-brand-500",
                "animate-spin motion-reduce:[animation-duration:2500ms]",
              )}
            />
          ) : (
            <RadixSelect.Icon asChild>
              <span
                data-slot="select-chevron"
                aria-hidden="true"
                className={cn(
                  "inline-flex items-center justify-center shrink-0 text-neutral-500",
                  "transition-transform duration-150 ease-standard motion-reduce:duration-0",
                  "data-[state=open]:rotate-180",
                )}
              >
                <ChevronDown />
              </span>
            </RadixSelect.Icon>
          )}
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            collisionPadding={8}
            data-slot="select-popup"
            className={selectPopupVariants()}
          >
            <RadixSelect.Viewport
              data-slot="select-viewport"
              className={selectViewportVariants()}
            >
              {isEmpty ? (
                <div
                  role="status"
                  data-slot="select-empty"
                  className="py-8 px-8 text-14 text-neutral-500 text-center"
                >
                  {emptyStateMessage}
                </div>
              ) : (
                grouped.map(({ name, items }, idx) => {
                  const groupKey = name || `__ungrouped-${idx}`;
                  const content = items.map((opt) => renderOption(opt, size));
                  if (!name) {
                    /* Ungrouped options — flat render. */
                    return (
                      <Fragment key={groupKey}>{content}</Fragment>
                    );
                  }
                  return (
                    <RadixSelect.Group key={groupKey} data-slot="select-group">
                      <RadixSelect.Label
                        data-slot="select-group-header"
                        className="px-8 pt-8 pb-4 text-12 font-semibold text-neutral-500 uppercase tracking-wide"
                      >
                        {name}
                      </RadixSelect.Label>
                      {content}
                    </RadixSelect.Group>
                  );
                })
              )}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {showFooter && (
        <div
          data-slot="select-footer"
          className="flex items-start justify-between gap-12 min-w-0"
        >
          {activeValidation && message ? (
            <span
              id={messageId}
              role={activeValidation === "error" ? "alert" : undefined}
              className={cn(
                "text-12 leading-[1.4] min-w-0 flex-1",
                activeValidation === "error"   && "text-red-500",
                activeValidation === "warning" && "text-accent-700",
                activeValidation === "success" && "text-green-500",
              )}
            >
              {message as React.ReactNode}
            </span>
          ) : helperText ? (
            <span
              id={helperId}
              className="text-12 leading-[1.4] text-neutral-500 min-w-0 flex-1"
            >
              {helperText}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
});

Select.displayName = "Select";

/* ══════ OPTION RENDERER ═══════════════════════════════════════════ */

function renderOption(opt: SelectOption, size: SelectSize): ReactNode {
  const hasDesc = Boolean(opt.description);
  return (
    <RadixSelect.Item
      key={opt.value}
      value={opt.value}
      disabled={opt.disabled}
      data-slot="select-option"
      className={selectOptionVariants({
        size,
        withDescription: hasDesc,
      } as VariantProps<typeof selectOptionVariants>)}
    >
      {opt.icon && (
        <span
          data-slot="select-option-icon"
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center shrink-0 text-current [&_svg]:block",
            hasDesc && "mt-[2px]",
          )}
        >
          {opt.icon}
        </span>
      )}
      <span
        data-slot="select-option-body"
        className="flex-1 min-w-0 flex flex-col gap-[2px]"
      >
        <RadixSelect.ItemText asChild>
          <span
            data-slot="select-option-label"
            className="text-current min-w-0 truncate"
          >
            {opt.label}
          </span>
        </RadixSelect.ItemText>
        {hasDesc && (
          <span
            data-slot="select-option-description"
            className="text-12 text-neutral-500 leading-normal min-w-0"
          >
            {opt.description}
          </span>
        )}
      </span>
      <RadixSelect.ItemIndicator asChild>
        <span
          data-slot="select-option-check"
          aria-hidden="true"
          className="inline-flex items-center justify-center shrink-0 text-brand-500 [&_svg]:block"
        >
          <Check />
        </span>
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
}

export {
  selectTriggerVariants,
  selectPopupVariants,
  selectViewportVariants,
  selectOptionVariants,
};
