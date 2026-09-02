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
  useMemo,
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
  RadioDescriptionProps,
  RadioGroupOrientation,
  RadioGroupProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioProps,
  RadioSize,
} from "./Radio.types";

/**
 * HC1 Radio + RadioGroup — the canonical single-selection control.
 *
 * Migrated from Radio.css to shadcn-style (cva + Tailwind utilities).
 * Same design choice as Checkbox: preserve the real native
 * `<input type="radio">` (not @radix-ui/react-radio-group) so form
 * serialization, native keyboard, arrow-key navigation between radios
 * sharing a `name`, and forwardRef<HTMLInputElement> all continue to
 * work exactly as before.
 *
 * `peer` on the native input lets the sibling circle paint the focus
 * ring via `peer-focus-visible:`; `group` on the root wrapper propagates
 * hover via `group-hover:` — same technique as Checkbox.
 */

/* ══════ GROUP CONTEXT ═════════════════════════════════════════════ */

type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  onValueChange: (next: string) => void;
  size: RadioSize | undefined;
  disabled: boolean | undefined;
  invalid: boolean | undefined;
  required: boolean | undefined;
  register: (value: string) => () => void;
  rovingValue: string | undefined;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ══════ CHILD SPLIT (Radio) ═══════════════════════════════════════ */

type ChildBuckets = {
  indicator?: ReactElement;
  label?: ReactElement;
  description?: ReactElement;
  fallbackLabel: ReactNode[];
};

function splitRadioChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = { fallbackLabel: [] };
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) buckets.fallbackLabel.push(child);
      return;
    }
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Radio.Indicator":
        buckets.indicator ??= child as ReactElement;
        return;
      case "Radio.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Radio.Description":
        buckets.description ??= child as ReactElement;
        return;
      default:
        buckets.fallbackLabel.push(child);
    }
  });
  return buckets;
}

/* ══════ CVA — ROOT (<label>) ══════════════════════════════════════ */

const radioRootVariants = cva(
  cn(
    "group relative inline-flex items-start",
    "font-sans text-neutral-900 cursor-pointer select-none",
  ),
  {
    variants: {
      size: {
        sm: "min-h-[var(--hc-radio-row-sm)] gap-8",
        md: "min-h-[var(--hc-radio-row-md)] gap-8",
        lg: "min-h-[var(--hc-radio-row-lg)] gap-12",
      },
      hasText: {
        false: "!min-h-0 items-center",
        true: "",
      },
      disabled: {
        true: cn(
          "cursor-not-allowed text-neutral-400",
          "[&_[data-slot=radio-label]]:text-neutral-400",
          "[&_[data-slot=radio-description]]:text-neutral-400",
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

const radioInputVariants = cva(
  cn(
    "peer absolute left-0 m-0 p-0 opacity-0 cursor-inherit",
  ),
  {
    variants: {
      size: {
        sm: "size-[var(--hc-radio-control-sm)]",
        md: "size-[var(--hc-radio-control-md)]",
        lg: "size-[var(--hc-radio-control-lg)]",
      },
      hasText: {
        false: "top-0",
        true: "",
      },
    },
    compoundVariants: [
      { size: "sm", hasText: true, className: "top-[calc((var(--hc-radio-row-sm)-var(--hc-radio-control-sm))/2)]" },
      { size: "md", hasText: true, className: "top-[calc((var(--hc-radio-row-md)-var(--hc-radio-control-md))/2)]" },
      { size: "lg", hasText: true, className: "top-[calc((var(--hc-radio-row-lg)-var(--hc-radio-control-lg))/2)]" },
    ],
    defaultVariants: {
      size: "md",
      hasText: false,
    },
  },
);

/* ══════ CVA — INDICATOR (the visible circle) ══════════════════════ */

type BoxState = "unchecked" | "checked";

const radioIndicatorVariants = cva(
  cn(
    "inline-flex items-center justify-center shrink-0",
    "border rounded-full bg-white",
    "transition-[background-color,border-color,color] duration-150 ease-standard motion-reduce:duration-0",
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
  ),
  {
    variants: {
      size: {
        sm: "size-[var(--hc-radio-control-sm)]",
        md: "size-[var(--hc-radio-control-md)]",
        lg: "size-[var(--hc-radio-control-lg)]",
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
      /* Vertical alignment: for rows with text, the circle sits at
         (row-height - control) / 2 from the top so it aligns with the
         label's baseline. */
      { size: "sm", hasText: true, className: "mt-[calc((var(--hc-radio-row-sm)-var(--hc-radio-control-sm))/2)]" },
      { size: "md", hasText: true, className: "mt-[calc((var(--hc-radio-row-md)-var(--hc-radio-control-md))/2)]" },
      { size: "lg", hasText: true, className: "mt-[calc((var(--hc-radio-row-lg)-var(--hc-radio-control-lg))/2)]" },

      /* invalid × unchecked — red border, subtle bg on hover */
      { invalid: true, boxState: "unchecked", className: cn(
        "border-red-500",
        "group-hover:bg-neutral-100 group-hover:border-red-500",
      )},
      /* invalid × checked — red fill, color-mix darken on hover (verbatim) */
      { invalid: true, boxState: "checked", className: cn(
        "bg-red-500 border-red-500",
        "group-hover:bg-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
        "group-hover:border-[color-mix(in_oklab,var(--hc-color-red-500)_88%,black)]",
      )},

      /* disabled × unchecked — muted, suppress hover */
      { disabled: true, boxState: "unchecked", className: cn(
        "bg-neutral-100 border-neutral-100 text-neutral-400",
        "group-hover:bg-neutral-100 group-hover:border-neutral-100",
      )},
      /* disabled × checked — action-primary-disabled fill */
      { disabled: true, boxState: "checked", className: cn(
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

/* ══════ CVA — DOT (inner filled circle when checked) ══════════════ */

const radioDotVariants = cva(
  cn(
    "block rounded-full bg-current",
    "transition-[transform,opacity] duration-150 ease-standard motion-reduce:duration-0",
  ),
  {
    variants: {
      size: {
        sm: "size-[var(--hc-radio-dot-sm)]",
        md: "size-[var(--hc-radio-dot-md)]",
        lg: "size-[var(--hc-radio-dot-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ══════ CVA — LABEL ═══════════════════════════════════════════════ */

const radioLabelVariants = cva(
  cn(
    "text-neutral-900 font-medium inline",
  ),
  {
    variants: {
      size: {
        /* Line-height locked to row height for single-line alignment;
           JSX reverts to leading-[1.4] when a Description is present. */
        sm: "text-12 leading-[var(--hc-radio-row-sm)]",
        md: "text-14 leading-[var(--hc-radio-row-md)]",
        lg: "text-16 leading-[var(--hc-radio-row-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ══════ CVA — DESCRIPTION ═════════════════════════════════════════ */

const radioDescriptionVariants = cva(
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

/* ══════ RADIO ROOT ════════════════════════════════════════════════ */

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    size: sizeProp,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    invalid: invalidProp,
    disabled: disabledProp,
    required: requiredProp,
    id: idProp,
    name: nameProp,
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
  const group = useContext(RadioGroupContext);
  const inGroup = !!group;

  const size     = sizeProp     ?? group?.size     ?? "md";
  const disabled = disabledProp ?? group?.disabled ?? false;
  const invalid  = invalidProp  ?? group?.invalid  ?? false;
  const required = requiredProp ?? group?.required ?? false;
  const name     = nameProp     ?? group?.name;

  const isControlled = checkedProp !== undefined;
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked);
  const currentChecked =
    inGroup && value !== undefined ? group!.value === value
    : isControlled                  ? !!checkedProp
    :                                 innerChecked;

  /* Register this radio's value with the group so it can pick the
     roving-tabbable radio. */
  useEffect(() => {
    if (!inGroup || value === undefined) return;
    return group!.register(value);
  }, [inGroup, group, value]);

  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const descriptionId = `${inputId}-description`;

  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      /* Native radio change fires only on the newly-checked radio. */
      if (inGroup && value !== undefined) {
        group!.onValueChange(value);
      } else if (!isControlled) {
        setInnerChecked(event.target.checked);
      }
      onCheckedChange?.(event.target.checked, event);
      onChange?.(event);
    },
    [inGroup, group, value, isControlled, onCheckedChange, onChange],
  );

  const buckets = splitRadioChildren(children);
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

  const contextValue: RadioSubcomponentContextValue = {
    inputId,
    descriptionId,
    size,
    registerDescription,
  };

  const boxState: BoxState = currentChecked ? "checked" : "unchecked";

  const describedIds: string[] = [];
  if (ariaDescribedByProp) describedIds.push(ariaDescribedByProp);
  if (hasDescriptionRegistered) describedIds.push(descriptionId);
  const ariaDescribedBy = describedIds.length > 0 ? describedIds.join(" ") : undefined;

  /* Roving tabindex: only the currently-selected radio (or the first if
     none is selected) is tabbable within a RadioGroup. */
  const tabIndex = inGroup
    ? (value !== undefined && group!.rovingValue === value ? 0 : -1)
    : rest.tabIndex;

  return (
    <RadioSubcomponentContext.Provider value={contextValue}>
      {/* Outer <label> wraps input for click-to-select without htmlFor
          (double-click bug in some browsers — same fix as Checkbox). */}
      <label
        data-slot="radio-root"
        data-state={currentChecked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        style={style as CSSProperties}
        className={cn(
          radioRootVariants({
            size,
            hasText,
            disabled,
          } as VariantProps<typeof radioRootVariants>),
          className,
        )}
      >
        <input
          {...rest}
          ref={innerRef}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={currentChecked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          tabIndex={tabIndex}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={radioInputVariants({
            size,
            hasText,
          } as VariantProps<typeof radioInputVariants>)}
        />

        {buckets.indicator ?? (
          <span
            data-slot="radio-indicator"
            aria-hidden="true"
            className={radioIndicatorVariants({
              size,
              hasText,
              boxState,
              invalid,
              disabled,
            } as VariantProps<typeof radioIndicatorVariants>)}
          >
            {currentChecked && (
              <span
                data-slot="radio-dot"
                className={radioDotVariants({ size })}
              />
            )}
          </span>
        )}

        {hasText && (
          <span className="inline-flex flex-col gap-4 min-w-0">
            {(buckets.label || buckets.fallbackLabel.length > 0) && (
              <span
                data-slot="radio-label"
                className={cn(
                  radioLabelVariants({ size }),
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
    </RadioSubcomponentContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLInputElement, RadioProps>> & {
  Indicator:   typeof RadioIndicator;
  Label:       typeof RadioLabel;
  Description: typeof RadioDescription;
};

(Radio as unknown as { displayName: string }).displayName = "Radio";

/* ══════ SUBCOMPONENT CONTEXT (Description ↔ root) ═════════════════ */

type RadioSubcomponentContextValue = {
  inputId: string;
  descriptionId: string;
  size: RadioSize;
  registerDescription: (present: boolean) => void;
};

const RadioSubcomponentContext = createContext<RadioSubcomponentContextValue | null>(null);

function useRadioSubcomponentContext(source: string): RadioSubcomponentContextValue {
  const ctx = useContext(RadioSubcomponentContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Radio] ${source} must be rendered inside a <Radio> parent.`,
    );
  }
  return ctx;
}

/* ══════ INDICATOR (composable escape hatch) ═══════════════════════ */

const RadioIndicator = forwardRef<HTMLSpanElement, RadioIndicatorProps>(function RadioIndicator(
  { className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="radio-indicator"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "border border-neutral-300 rounded-full bg-white",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
RadioIndicator.displayName = "Radio.Indicator";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const RadioLabel = forwardRef<HTMLSpanElement, RadioLabelProps>(function RadioLabel(
  { className, children, ...rest },
  ref,
) {
  const ctx = useRadioSubcomponentContext("Radio.Label");
  return (
    <span
      ref={ref}
      data-slot="radio-label"
      className={cn(
        radioLabelVariants({ size: ctx.size }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
RadioLabel.displayName = "Radio.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const RadioDescription = forwardRef<HTMLSpanElement, RadioDescriptionProps>(function RadioDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useRadioSubcomponentContext("Radio.Description");
  const descId = idProp ?? ctx.descriptionId;

  useEffect(() => {
    ctx.registerDescription(true);
    return () => ctx.registerDescription(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={descId}
      data-slot="radio-description"
      className={cn(
        radioDescriptionVariants({ size: ctx.size }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
RadioDescription.displayName = "Radio.Description";

/* ══════ RADIO GROUP ═══════════════════════════════════════════════ */

const radioGroupItemsVariants = cva(
  "flex min-w-0",
  {
    variants: {
      orientation: {
        vertical:   "flex-col gap-8",
        horizontal: "flex-row flex-wrap gap-16",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

/**
 * HC1 RadioGroup — groups Radio buttons under a shared name + selection.
 *
 * Arrow-key navigation between radios is NATIVE — the browser handles it
 * automatically because all child radios share the same `name`. This
 * component only wires focus + tabIndex so the native behavior works.
 */
export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  name: nameProp,
  orientation = "vertical",
  size,
  disabled,
  invalid,
  required,
  label,
  description,
  errorMessage,
  className,
  children,
  "aria-labelledby": ariaLabelledByProp,
  "aria-describedby": ariaDescribedByProp,
  ...rest
}: RadioGroupProps) {
  const isControlled = controlledValue !== undefined;
  const [innerValue, setInnerValue] = useState<string | undefined>(defaultValue);
  const currentValue = isControlled ? controlledValue : innerValue;

  const generatedName    = useId();
  const generatedLabelId = useId();
  const generatedDescId  = useId();
  const generatedErrorId = useId();
  const name = nameProp ?? generatedName;

  const labelId = label       ? generatedLabelId : undefined;
  const descId  = description ? generatedDescId  : undefined;
  const errorId = errorMessage ? generatedErrorId : undefined;

  const handleValueChange = useCallback(
    (next: string) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const [registered, setRegistered] = useState<string[]>([]);
  const register = useCallback((v: string) => {
    setRegistered((r) => (r.includes(v) ? r : [...r, v]));
    return () => {
      setRegistered((r) => r.filter((x) => x !== v));
    };
  }, []);

  const rovingValue =
    currentValue !== undefined && registered.includes(currentValue)
      ? currentValue
      : registered[0];

  const groupInvalid = invalid || !!errorMessage;

  const contextValue: RadioGroupContextValue = useMemo(
    () => ({
      name,
      value: currentValue,
      onValueChange: handleValueChange,
      size,
      disabled,
      invalid: groupInvalid,
      required,
      register,
      rovingValue,
    }),
    [name, currentValue, handleValueChange, size, disabled, groupInvalid, required, register, rovingValue],
  );

  const composedLabelledBy = [ariaLabelledByProp, labelId].filter(Boolean).join(" ") || undefined;
  const composedDescribedBy = [ariaDescribedByProp, descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      {...rest}
      role="radiogroup"
      data-slot="radio-group"
      data-orientation={orientation}
      aria-orientation={orientation}
      aria-labelledby={composedLabelledBy}
      aria-describedby={composedDescribedBy}
      aria-required={required || undefined}
      aria-invalid={groupInvalid || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex flex-col gap-8 font-sans text-neutral-900 min-w-0",
        className,
      )}
    >
      {(label || description) && (
        <div data-slot="radio-group-header" className="flex flex-col gap-4">
          {label && (
            <div
              id={labelId}
              data-slot="radio-group-label"
              className={cn(
                "text-14 font-semibold leading-[1.4]",
                groupInvalid ? "text-red-500" : "text-neutral-900",
              )}
            >
              {label}
              {required && (
                <span
                  aria-hidden="true"
                  className="text-red-500 ml-[4px] font-semibold"
                >
                  *
                </span>
              )}
            </div>
          )}
          {description && (
            <div
              id={descId}
              data-slot="radio-group-description"
              className="text-12 text-neutral-500 leading-normal"
            >
              {description}
            </div>
          )}
        </div>
      )}
      <RadioGroupContext.Provider value={contextValue}>
        <div
          data-slot="radio-group-items"
          className={radioGroupItemsVariants({
            orientation: orientation as RadioGroupOrientation,
          })}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
      {errorMessage && (
        <div
          id={errorId}
          data-slot="radio-group-error"
          role="alert"
          className="text-12 text-red-500 leading-normal"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
RadioGroup.displayName = "RadioGroup";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Radio.Indicator   = RadioIndicator;
Radio.Label       = RadioLabel;
Radio.Description = RadioDescription;

export {
  radioRootVariants,
  radioIndicatorVariants,
  radioDotVariants,
  radioLabelVariants,
  radioDescriptionVariants,
  radioGroupItemsVariants,
};
