import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  CheckboxDescriptionProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxProps,
  CheckboxSize,
} from "./Checkbox.types";

/**
 * HC1 Checkbox — the canonical multi-selection control.
 *
 * Migrated from Checkbox.css to shadcn-style (cva + Tailwind utilities).
 * A deliberate design choice: this component preserves the real native
 * `<input type="checkbox">` (rather than switching to a Radix
 * `<button role="checkbox">`) so form serialization, native keyboard,
 * screen-reader semantics, and forwardRef<HTMLInputElement> continue to
 * work exactly as before.
 *
 * The visible box is a sibling span; the native input is visually hidden
 * (opacity 0) but absolute-positioned over the box so focus rings and
 * pointer targets both land on the visible chrome. `peer` on the input
 * lets the box paint the focus ring via `peer-focus-visible:`; `group`
 * on the root wrapper propagates hover to the box via `group-hover:`.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type CheckboxContextValue = {
  inputId: string;
  descriptionId: string;
  size: CheckboxSize;
  disabled: boolean;
  required: boolean;
  registerDescription: (present: boolean) => void;
};

const CheckboxContext = createContext<CheckboxContextValue | null>(null);

function useCheckboxContext(source: string): CheckboxContextValue {
  const ctx = useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Checkbox] ${source} must be rendered inside a <Checkbox> parent.`,
    );
  }
  return ctx;
}

/* ══════ CHILD SPLIT ═══════════════════════════════════════════════ */

type ChildBuckets = {
  indicator?: ReactElement;
  label?: ReactElement;
  description?: ReactElement;
  fallbackLabel: ReactNode[];
};

function splitChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = { fallbackLabel: [] };
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) buckets.fallbackLabel.push(child);
      return;
    }
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Checkbox.Indicator":
        buckets.indicator ??= child as ReactElement;
        return;
      case "Checkbox.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Checkbox.Description":
        buckets.description ??= child as ReactElement;
        return;
      default:
        buckets.fallbackLabel.push(child);
    }
  });
  return buckets;
}

/* ══════ GLYPHS ════════════════════════════════════════════════════ */

function CheckGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block text-current"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block text-current"
    >
      <path
        d="M4 8H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════ CVA — ROOT (<label>) ══════════════════════════════════════ */

const checkboxRootVariants = cva(
  cn(
    "group relative inline-flex items-start",
    "font-sans text-neutral-900 cursor-pointer select-none",
  ),
  {
    variants: {
      size: {
        sm: "min-h-[var(--hc-checkbox-row-sm)] gap-8",
        md: "min-h-[var(--hc-checkbox-row-md)] gap-8",
        lg: "min-h-[var(--hc-checkbox-row-lg)] gap-12",
      },
      hasText: {
        /* Bare row (no text) — collapse row height + center-align so
           checkboxes in a table cell don't inject vertical space. */
        false: "!min-h-0 items-center",
        true: "",
      },
      disabled: {
        true: cn(
          "cursor-not-allowed text-neutral-400",
          "[&_[data-slot=checkbox-label]]:text-neutral-400",
          "[&_[data-slot=checkbox-description]]:text-neutral-400",
        ),
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      hasText: false,
      disabled: false,
    },
  },
);

/* ══════ CVA — NATIVE INPUT (visually hidden, keyboard target) ═════ */

const checkboxInputVariants = cva(
  cn(
    "peer absolute left-0 m-0 p-0 opacity-0 cursor-inherit",
  ),
  {
    variants: {
      size: {
        sm: "size-[var(--hc-checkbox-control-sm)]",
        md: "size-[var(--hc-checkbox-control-md)]",
        lg: "size-[var(--hc-checkbox-control-lg)]",
      },
      hasText: {
        false: "top-0",
        true: "",
      },
    },
    compoundVariants: [
      /* When text is present, align the input over the visible box so its
         focus ring lands on the box (not the row baseline). */
      { size: "sm", hasText: true, className: "top-[calc((var(--hc-checkbox-row-sm)-var(--hc-checkbox-control-sm))/2)]" },
      { size: "md", hasText: true, className: "top-[calc((var(--hc-checkbox-row-md)-var(--hc-checkbox-control-md))/2)]" },
      { size: "lg", hasText: true, className: "top-[calc((var(--hc-checkbox-row-lg)-var(--hc-checkbox-control-lg))/2)]" },
    ],
    defaultVariants: {
      size: "md",
      hasText: false,
    },
  },
);

/* ══════ CVA — INDICATOR (the visible box) ═════════════════════════ */

type BoxState = "unchecked" | "checked" | "indeterminate";

const checkboxIndicatorVariants = cva(
  cn(
    "inline-flex items-center justify-center shrink-0",
    "border rounded-chip bg-white",
    "transition-[background-color,border-color,color] duration-150 ease-standard motion-reduce:duration-0",
    /* Focus ring lifts from the peer (native input) — brand by default,
       compound-overridden to red when invalid. */
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
  ),
  {
    variants: {
      size: {
        sm: "size-[var(--hc-checkbox-control-sm)]",
        md: "size-[var(--hc-checkbox-control-md)]",
        lg: "size-[var(--hc-checkbox-control-lg)]",
      },
      hasText: {
        false: "",
        true: "",
      },
      boxState: {
        unchecked: cn(
          "border-neutral-300 text-white",
          "group-hover:bg-neutral-100 group-hover:border-brand-500",
        ),
        checked: cn(
          "bg-brand-500 border-brand-500 text-white",
          "group-hover:bg-brand-600 group-hover:border-brand-600",
        ),
        indeterminate: cn(
          "bg-brand-500 border-brand-500 text-white",
          "group-hover:bg-brand-600 group-hover:border-brand-600",
        ),
      },
      invalid: {
        true: "peer-focus-visible:outline-red-500",
        false: "",
      },
      disabled: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      /* Vertical alignment: for rows with text, the indicator sits at
         (row-height - control) / 2 from the top so it aligns optically
         with the label's baseline. */
      { size: "sm", hasText: true, className: "mt-[calc((var(--hc-checkbox-row-sm)-var(--hc-checkbox-control-sm))/2)]" },
      { size: "md", hasText: true, className: "mt-[calc((var(--hc-checkbox-row-md)-var(--hc-checkbox-control-md))/2)]" },
      { size: "lg", hasText: true, className: "mt-[calc((var(--hc-checkbox-row-lg)-var(--hc-checkbox-control-lg))/2)]" },

      /* invalid × unchecked — red border, subtle bg on hover */
      { invalid: true, boxState: "unchecked", className: cn(
        "border-red-500",
        "group-hover:bg-neutral-100 group-hover:border-red-500",
      )},
      /* invalid × checked / indeterminate — red fill, darker on hover
         (color-mix preserved verbatim from original CSS). */
      { invalid: true, boxState: "checked", className: cn(
        "bg-red-500 border-red-500",
        "group-hover:bg-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
        "group-hover:border-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
      )},
      { invalid: true, boxState: "indeterminate", className: cn(
        "bg-red-500 border-red-500",
        "group-hover:bg-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
        "group-hover:border-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
      )},

      /* disabled × unchecked — muted; suppress hover paint */
      { disabled: true, boxState: "unchecked", className: cn(
        "bg-neutral-100 border-neutral-100 text-neutral-400",
        "group-hover:bg-neutral-100 group-hover:border-neutral-100",
      )},
      /* disabled × checked / indeterminate — action-primary-disabled fill */
      { disabled: true, boxState: "checked", className: cn(
        "bg-neutral-200 border-neutral-200 text-white",
        "group-hover:bg-neutral-200 group-hover:border-neutral-200",
      )},
      { disabled: true, boxState: "indeterminate", className: cn(
        "bg-neutral-200 border-neutral-200 text-white",
        "group-hover:bg-neutral-200 group-hover:border-neutral-200",
      )},
    ],
    defaultVariants: {
      size: "md",
      hasText: false,
      boxState: "unchecked",
      invalid: false,
      disabled: false,
    },
  },
);

/* ══════ CVA — LABEL ═══════════════════════════════════════════════ */

const checkboxLabelVariants = cva(
  cn(
    "text-neutral-900 font-medium inline",
  ),
  {
    variants: {
      size: {
        /* Line-height matches the row height so the label sits centered
           against the box on single-line labels. When a description is
           present, JSX overrides this back to 1.4 leading so multi-line
           reads correctly. */
        sm: "text-12 leading-[var(--hc-checkbox-row-sm)]",
        md: "text-14 leading-[var(--hc-checkbox-row-md)]",
        lg: "text-16 leading-[var(--hc-checkbox-row-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ══════ CVA — DESCRIPTION ═════════════════════════════════════════ */

const checkboxDescriptionVariants = cva(
  cn(
    "text-neutral-500 font-normal leading-normal block",
  ),
  {
    variants: {
      size: {
        sm: "text-12",
        md: "text-12",
        lg: "text-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = "md",
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    indeterminate = false,
    invalid = false,
    disabled = false,
    required = false,
    id: idProp,
    className,
    style,
    children,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const descriptionId = `${inputId}-description`;

  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  const isControlled = checked !== undefined;
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked);
  const currentChecked = isControlled ? !!checked : innerChecked;

  /* Native `indeterminate` is a runtime property, no HTML attribute.
     Sync every render so DOM reflects the prop. */
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.indeterminate = indeterminate;
  }, [indeterminate, currentChecked]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerChecked(event.target.checked);
      onCheckedChange?.(event.target.checked, event);
      onChange?.(event);
    },
    [isControlled, onCheckedChange, onChange],
  );

  const buckets = splitChildren(children);
  const hasLabel       = !!(buckets.label || buckets.fallbackLabel.length > 0);
  const hasDescription = !!buckets.description;
  const hasText        = hasLabel || hasDescription;

  const [hasDescriptionRegistered, setHasDescriptionRegistered] = useState(hasDescription);
  const registerDescription = useCallback(
    (present: boolean) => setHasDescriptionRegistered(present),
    [],
  );
  useEffect(() => {
    if (hasDescription !== hasDescriptionRegistered) {
      setHasDescriptionRegistered(hasDescription);
    }
  }, [hasDescription, hasDescriptionRegistered]);

  const contextValue: CheckboxContextValue = {
    inputId,
    descriptionId,
    size,
    disabled,
    required,
    registerDescription,
  };

  const boxState: BoxState = indeterminate
    ? "indeterminate"
    : currentChecked
    ? "checked"
    : "unchecked";

  const describedIds: string[] = [];
  if (ariaDescribedByProp) describedIds.push(ariaDescribedByProp);
  if (hasDescriptionRegistered) describedIds.push(descriptionId);
  const ariaDescribedBy = describedIds.length > 0 ? describedIds.join(" ") : undefined;

  const iconSize = size === "sm" ? 10 : size === "lg" ? 16 : 12;

  return (
    <CheckboxContext.Provider value={contextValue}>
      {/* The outer <label> wraps the native input so click-to-toggle works
          via containment alone. Deliberately no htmlFor — pairing htmlFor
          with wrapping causes double synthetic clicks in some browsers,
          netting the toggle back to zero. Wrapping alone is spec-compliant. */}
      <label
        data-slot="checkbox-root"
        data-state={indeterminate ? "indeterminate" : currentChecked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        style={style as CSSProperties}
        className={cn(
          checkboxRootVariants({
            size,
            hasText,
            disabled,
          } as VariantProps<typeof checkboxRootVariants>),
          className,
        )}
      >
        <input
          {...rest}
          ref={innerRef}
          id={inputId}
          type="checkbox"
          checked={currentChecked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...(indeterminate ? { "aria-checked": "mixed" as const } : {})}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={checkboxInputVariants({
            size,
            hasText,
          } as VariantProps<typeof checkboxInputVariants>)}
        />

        {buckets.indicator ?? (
          <span
            data-slot="checkbox-indicator"
            aria-hidden="true"
            className={checkboxIndicatorVariants({
              size,
              hasText,
              boxState,
              invalid,
              disabled,
            } as VariantProps<typeof checkboxIndicatorVariants>)}
          >
            {indeterminate ? (
              <DashGlyph size={iconSize} />
            ) : currentChecked ? (
              <CheckGlyph size={iconSize} />
            ) : null}
          </span>
        )}

        {hasText && (
          <span className="inline-flex flex-col gap-4 min-w-0">
            {(buckets.label || buckets.fallbackLabel.length > 0) && (
              <span
                data-slot="checkbox-label"
                className={cn(
                  checkboxLabelVariants({ size }),
                  /* When description is present, revert to comfortable
                     leading so the two-line stack reads correctly. */
                  hasDescription && "leading-[1.4]",
                )}
              >
                {buckets.label ?? buckets.fallbackLabel}
                {required && (
                  <span
                    aria-hidden="true"
                    className="text-red-500 ml-[4px] font-semibold"
                  >
                    *
                  </span>
                )}
              </span>
            )}
            {buckets.description}
          </span>
        )}
      </label>
    </CheckboxContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLInputElement, CheckboxProps>> & {
  Indicator:   typeof CheckboxIndicator;
  Label:       typeof CheckboxLabel;
  Description: typeof CheckboxDescription;
};

(Checkbox as unknown as { displayName: string }).displayName = "Checkbox";

/* ══════ INDICATOR (composable escape hatch) ═══════════════════════ */

const CheckboxIndicator = forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(function CheckboxIndicator(
  { className, children, ...rest },
  ref,
) {
  /* Composed explicitly. The parent Checkbox reads no state from context
     into this — consumers who compose Indicator own its children entirely. */
  return (
    <span
      ref={ref}
      data-slot="checkbox-indicator"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "border border-neutral-300 rounded-chip bg-white",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
CheckboxIndicator.displayName = "Checkbox.Indicator";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const CheckboxLabel = forwardRef<HTMLSpanElement, CheckboxLabelProps>(function CheckboxLabel(
  { className, children, ...rest },
  ref,
) {
  const ctx = useCheckboxContext("Checkbox.Label");
  return (
    <span
      ref={ref}
      data-slot="checkbox-label"
      className={cn(
        checkboxLabelVariants({ size: ctx.size }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
CheckboxLabel.displayName = "Checkbox.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const CheckboxDescription = forwardRef<HTMLSpanElement, CheckboxDescriptionProps>(function CheckboxDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useCheckboxContext("Checkbox.Description");
  const descId = idProp ?? ctx.descriptionId;

  useEffect(() => {
    ctx.registerDescription(true);
    return () => ctx.registerDescription(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={descId}
      data-slot="checkbox-description"
      className={cn(
        checkboxDescriptionVariants({ size: ctx.size }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
CheckboxDescription.displayName = "Checkbox.Description";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Checkbox.Indicator   = CheckboxIndicator;
Checkbox.Label       = CheckboxLabel;
Checkbox.Description = CheckboxDescription;

export {
  checkboxRootVariants,
  checkboxIndicatorVariants,
  checkboxLabelVariants,
  checkboxDescriptionVariants,
};
