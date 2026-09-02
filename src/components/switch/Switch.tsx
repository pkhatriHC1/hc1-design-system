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
  SwitchDescriptionProps,
  SwitchIndicatorProps,
  SwitchLabelProps,
  SwitchProps,
  SwitchSize,
} from "./Switch.types";

/**
 * HC1 Switch — the canonical binary toggle control.
 *
 * Migrated from Switch.css to shadcn-style (cva + Tailwind utilities).
 * Same architectural choice as Checkbox / Radio: preserve the real native
 * `<input type="checkbox" role="switch">` (not @radix-ui/react-switch) so
 * form serialization, native keyboard, screen-reader semantics, and
 * forwardRef<HTMLInputElement> all continue to work exactly as before.
 *
 * The pill track and sliding thumb are painted via cva variants. `peer`
 * on the native input lets the sibling track paint the focus ring via
 * `peer-focus-visible:`; `group` on the root wrapper propagates hover
 * via `group-hover:`.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type SwitchContextValue = {
  inputId: string;
  descriptionId: string;
  size: SwitchSize;
  disabled: boolean;
  required: boolean;
  registerDescription: (present: boolean) => void;
};

const SwitchContext = createContext<SwitchContextValue | null>(null);

function useSwitchContext(source: string): SwitchContextValue {
  const ctx = useContext(SwitchContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Switch] ${source} must be rendered inside a <Switch> parent.`,
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
      case "Switch.Indicator":
        buckets.indicator ??= child as ReactElement;
        return;
      case "Switch.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Switch.Description":
        buckets.description ??= child as ReactElement;
        return;
      default:
        buckets.fallbackLabel.push(child);
    }
  });
  return buckets;
}

/* ══════ SPINNER GLYPH ═════════════════════════════════════════════ */

function Spinner({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-slot="switch-spinner"
      className="block text-current animate-spin motion-reduce:[animation-duration:2400ms]"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path
        d="M14 8A6 6 0 0 0 8 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════ CVA — ROOT (<label>) ═════════════════════════════════════ */

const switchRootVariants = cva(
  cn(
    "group relative inline-flex items-start",
    "font-sans text-neutral-900 cursor-pointer select-none",
  ),
  {
    variants: {
      size: {
        sm: "min-h-[var(--hc-switch-row-sm)] gap-8",
        md: "min-h-[var(--hc-switch-row-md)] gap-8",
        lg: "min-h-[var(--hc-switch-row-lg)] gap-12",
      },
      hasText: {
        false: "!min-h-0 items-center",
        true: "",
      },
      disabled: {
        true: cn(
          "cursor-not-allowed text-neutral-400",
          "[&_[data-slot=switch-label]]:text-neutral-400",
          "[&_[data-slot=switch-description]]:text-neutral-400",
        ),
        false: "",
      },
      loading: {
        true: "cursor-progress",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      hasText: false,
      disabled: false,
      loading: false,
    },
  },
);

/* ══════ CVA — NATIVE INPUT (visually hidden, keyboard target) ═════ */

const switchInputVariants = cva(
  cn(
    "peer absolute left-0 m-0 p-0 opacity-0 cursor-inherit",
  ),
  {
    variants: {
      size: {
        sm: "w-[var(--hc-switch-track-w-sm)] h-[var(--hc-switch-track-h-sm)]",
        md: "w-[var(--hc-switch-track-w-md)] h-[var(--hc-switch-track-h-md)]",
        lg: "w-[var(--hc-switch-track-w-lg)] h-[var(--hc-switch-track-h-lg)]",
      },
      hasText: {
        false: "top-0",
        true: "",
      },
    },
    compoundVariants: [
      { size: "sm", hasText: true, className: "top-[calc((var(--hc-switch-row-sm)-var(--hc-switch-track-h-sm))/2)]" },
      { size: "md", hasText: true, className: "top-[calc((var(--hc-switch-row-md)-var(--hc-switch-track-h-md))/2)]" },
      { size: "lg", hasText: true, className: "top-[calc((var(--hc-switch-row-lg)-var(--hc-switch-track-h-lg))/2)]" },
    ],
    defaultVariants: {
      size: "md",
      hasText: false,
    },
  },
);

/* ══════ CVA — TRACK (the visible pill) ═══════════════════════════ */

type BoxState = "unchecked" | "checked";

const switchTrackVariants = cva(
  cn(
    "relative inline-flex items-center shrink-0 p-0",
    "border rounded-full",
    "transition-[background-color,border-color] duration-150 ease-standard motion-reduce:duration-0",
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
  ),
  {
    variants: {
      size: {
        sm: "w-[var(--hc-switch-track-w-sm)] h-[var(--hc-switch-track-h-sm)]",
        md: "w-[var(--hc-switch-track-w-md)] h-[var(--hc-switch-track-h-md)]",
        lg: "w-[var(--hc-switch-track-w-lg)] h-[var(--hc-switch-track-h-lg)]",
      },
      hasText: {
        false: "",
        true: "",
      },
      boxState: {
        unchecked: cn(
          "bg-neutral-200 border-neutral-300",
          "group-hover:border-brand-500",
        ),
        checked: cn(
          "bg-brand-500 border-brand-500",
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
      /* Vertical alignment: for rows with text, the track sits centered
         on the row so it aligns with the label's baseline. */
      { size: "sm", hasText: true, className: "mt-[calc((var(--hc-switch-row-sm)-var(--hc-switch-track-h-sm))/2)]" },
      { size: "md", hasText: true, className: "mt-[calc((var(--hc-switch-row-md)-var(--hc-switch-track-h-md))/2)]" },
      { size: "lg", hasText: true, className: "mt-[calc((var(--hc-switch-row-lg)-var(--hc-switch-track-h-lg))/2)]" },

      /* invalid × unchecked — red border, no hover paint change beyond border */
      { invalid: true, boxState: "unchecked", className: cn(
        "border-red-500",
        "group-hover:border-red-500",
      )},
      /* invalid × checked — red fill, color-mix darken on hover (verbatim) */
      { invalid: true, boxState: "checked", className: cn(
        "bg-red-500 border-red-500",
        "group-hover:bg-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
        "group-hover:border-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
      )},

      /* disabled × unchecked — muted, suppress hover */
      { disabled: true, boxState: "unchecked", className: cn(
        "bg-neutral-100 border-neutral-100",
        "group-hover:bg-neutral-100 group-hover:border-neutral-100",
      )},
      /* disabled × checked — action-primary-disabled fill */
      { disabled: true, boxState: "checked", className: cn(
        "bg-neutral-200 border-neutral-200",
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

/* ══════ CVA — THUMB (the sliding circle) ═════════════════════════ */

const switchThumbVariants = cva(
  cn(
    "inline-flex items-center justify-center",
    "rounded-full bg-white shadow-xs",
    "absolute top-1/2 left-[2px] -translate-y-1/2 translate-x-0",
    "transition-[transform,background-color,color] duration-150 ease-standard motion-reduce:duration-0",
  ),
  {
    variants: {
      size: {
        sm: "w-[var(--hc-switch-thumb-sm)] h-[var(--hc-switch-thumb-sm)]",
        md: "w-[var(--hc-switch-thumb-md)] h-[var(--hc-switch-thumb-md)]",
        lg: "w-[var(--hc-switch-thumb-lg)] h-[var(--hc-switch-thumb-lg)]",
      },
      boxState: {
        unchecked: "text-neutral-500",
        /* Checked: brand-500 spinner tint; still white thumb bg. */
        checked: "text-brand-500",
      },
      disabled: {
        /* Disabled removes the drop shadow — matches Switch.css `.hc-switch--disabled .hc-switch__thumb { box-shadow: none }`. */
        true: "shadow-none",
        false: "",
      },
      loading: {
        /* When loading, thumb color forces to brand-500 so the spinner
           reads as an in-flight cue (overrides the unchecked-only neutral). */
        true: "!text-brand-500",
        false: "",
      },
    },
    compoundVariants: [
      /* Checked slide: translateX = track-width - thumb-width - 4px
         (2px inset on each side of the track). */
      { boxState: "checked", size: "sm", className: "translate-x-[calc(var(--hc-switch-track-w-sm)-var(--hc-switch-thumb-sm)-4px)]" },
      { boxState: "checked", size: "md", className: "translate-x-[calc(var(--hc-switch-track-w-md)-var(--hc-switch-thumb-md)-4px)]" },
      { boxState: "checked", size: "lg", className: "translate-x-[calc(var(--hc-switch-track-w-lg)-var(--hc-switch-thumb-lg)-4px)]" },
    ],
    defaultVariants: {
      size: "md",
      boxState: "unchecked",
      disabled: false,
      loading: false,
    },
  },
);

/* ══════ CVA — LABEL ═══════════════════════════════════════════════ */

const switchLabelVariants = cva(
  cn(
    "text-neutral-900 font-medium inline",
  ),
  {
    variants: {
      size: {
        sm: "text-12 leading-[var(--hc-switch-row-sm)]",
        md: "text-14 leading-[var(--hc-switch-row-md)]",
        lg: "text-16 leading-[var(--hc-switch-row-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ══════ CVA — DESCRIPTION ═════════════════════════════════════════ */

const switchDescriptionVariants = cva(
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

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = "md",
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    invalid = false,
    disabled = false,
    required = false,
    loading = false,
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

  const effectiveDisabled = disabled || loading;

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

  const contextValue: SwitchContextValue = {
    inputId,
    descriptionId,
    size,
    disabled: effectiveDisabled,
    required,
    registerDescription,
  };

  const boxState: BoxState = currentChecked ? "checked" : "unchecked";

  const describedIds: string[] = [];
  if (ariaDescribedByProp) describedIds.push(ariaDescribedByProp);
  if (hasDescriptionRegistered) describedIds.push(descriptionId);
  const ariaDescribedBy = describedIds.length > 0 ? describedIds.join(" ") : undefined;

  /* Spinner size per switch size — sized to fit inside the thumb. */
  const spinnerSize = size === "sm" ? 8 : size === "lg" ? 12 : 10;

  return (
    <SwitchContext.Provider value={contextValue}>
      {/* Outer <label> wraps input for click-to-toggle without htmlFor
          (double-click bug in some browsers — same fix as Checkbox). */}
      <label
        data-slot="switch-root"
        data-state={currentChecked ? "checked" : "unchecked"}
        data-disabled={effectiveDisabled || undefined}
        data-invalid={invalid || undefined}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        style={style as CSSProperties}
        className={cn(
          switchRootVariants({
            size,
            hasText,
            disabled: effectiveDisabled,
            loading,
          } as VariantProps<typeof switchRootVariants>),
          className,
        )}
      >
        <input
          {...rest}
          ref={innerRef}
          id={inputId}
          type="checkbox"
          role="switch"
          checked={currentChecked}
          disabled={effectiveDisabled}
          required={required}
          onChange={handleChange}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={switchInputVariants({
            size,
            hasText,
          } as VariantProps<typeof switchInputVariants>)}
        />

        {buckets.indicator ?? (
          <span
            data-slot="switch-track"
            aria-hidden="true"
            className={switchTrackVariants({
              size,
              hasText,
              boxState,
              invalid,
              disabled: effectiveDisabled,
            } as VariantProps<typeof switchTrackVariants>)}
          >
            <span
              data-slot="switch-thumb"
              className={switchThumbVariants({
                size,
                boxState,
                disabled: effectiveDisabled,
                loading,
              } as VariantProps<typeof switchThumbVariants>)}
            >
              {loading && <Spinner size={spinnerSize} />}
            </span>
          </span>
        )}

        {hasText && (
          <span className="inline-flex flex-col gap-4 min-w-0">
            {(buckets.label || buckets.fallbackLabel.length > 0) && (
              <span
                data-slot="switch-label"
                className={cn(
                  switchLabelVariants({ size }),
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
    </SwitchContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLInputElement, SwitchProps>> & {
  Indicator:   typeof SwitchIndicator;
  Label:       typeof SwitchLabel;
  Description: typeof SwitchDescription;
};

(Switch as unknown as { displayName: string }).displayName = "Switch";

/* ══════ INDICATOR (composable escape hatch) ═══════════════════════ */

const SwitchIndicator = forwardRef<HTMLSpanElement, SwitchIndicatorProps>(function SwitchIndicator(
  { className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="switch-track"
      aria-hidden="true"
      className={cn(
        "relative inline-flex items-center shrink-0 p-0",
        "border border-neutral-300 rounded-full bg-neutral-200",
        className,
      )}
      {...rest}
    >
      {children ?? (
        <span
          data-slot="switch-thumb"
          className="inline-flex items-center justify-center rounded-full bg-white shadow-xs absolute top-1/2 left-[2px] -translate-y-1/2"
        />
      )}
    </span>
  );
});
SwitchIndicator.displayName = "Switch.Indicator";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const SwitchLabel = forwardRef<HTMLSpanElement, SwitchLabelProps>(function SwitchLabel(
  { className, children, ...rest },
  ref,
) {
  const ctx = useSwitchContext("Switch.Label");
  return (
    <span
      ref={ref}
      data-slot="switch-label"
      className={cn(
        switchLabelVariants({ size: ctx.size }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
SwitchLabel.displayName = "Switch.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const SwitchDescription = forwardRef<HTMLSpanElement, SwitchDescriptionProps>(function SwitchDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useSwitchContext("Switch.Description");
  const descId = idProp ?? ctx.descriptionId;

  useEffect(() => {
    ctx.registerDescription(true);
    return () => ctx.registerDescription(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={descId}
      data-slot="switch-description"
      className={cn(
        switchDescriptionVariants({ size: ctx.size }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
SwitchDescription.displayName = "Switch.Description";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Switch.Indicator   = SwitchIndicator;
Switch.Label       = SwitchLabel;
Switch.Description = SwitchDescription;

export {
  switchRootVariants,
  switchTrackVariants,
  switchThumbVariants,
  switchLabelVariants,
  switchDescriptionVariants,
};
