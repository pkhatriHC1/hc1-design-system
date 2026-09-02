import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { InputProps, InputValidation } from "./Input.types";

/**
 * HC1 Input — the canonical text input.
 *
 * Migrated from Input.css to shadcn-style (cva + Tailwind utilities).
 * The prop API, DOM structure, and a11y wiring are preserved verbatim;
 * every color, height, padding, and state maps 1:1 to the same --hc-*
 * alias the previous Input.css consumed. The delivery mechanism changed;
 * the render did not.
 *
 * Icon / clear-button / spinner sizes cascade from the frame via
 * data-slot descendant selectors, so the parent size variant drives all
 * chrome dimensions without prop-drilling.
 */

/* ══════ VALIDATION RESOLUTION ═════════════════════════════════════ */

function resolveValidation(
  errorMessage: unknown,
  warningMessage: unknown,
  successMessage: unknown,
  validation: InputValidation | undefined,
): InputValidation | undefined {
  if (errorMessage)   return "error";
  if (warningMessage) return "warning";
  if (successMessage) return "success";
  return validation;
}

/* ══════ FRAME CVA ═════════════════════════════════════════════════ */

/**
 * Active visual state — resolved to a single string so cva can pick the
 * right override set. Priority: disabled > readonly > error/warning/success
 * > default. loading is orthogonal (own cva variant).
 */
type FrameState = "default" | "error" | "warning" | "success" | "disabled" | "readonly";

const inputFrameVariants = cva(
  cn(
    "relative flex items-center w-full min-w-0",
    "border rounded-control bg-white text-neutral-900",
    "font-sans leading-none",
    "cursor-text [-webkit-tap-highlight-color:transparent]",
    "transition-[background-color,border-color,color,outline-color] duration-150 ease-standard",
    "motion-reduce:duration-0",
    "border-neutral-200",
    "outline-none",
    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring focus-within:border-brand-500",
    "hover:border-neutral-300",
  ),
  {
    variants: {
      size: {
        xs: cn(
          "h-[20px] px-4 gap-4 text-12 rounded-[4px]",
          "[&_[data-slot=input-icon]_svg]:size-[12px]",
          "[&_[data-slot=input-clear]]:size-[16px]",
          "[&_[data-slot=input-clear]_svg]:size-[10px]",
          "[&_[data-slot=input-spinner]]:size-[10px] [&_[data-slot=input-spinner]]:border-[1.5px]",
        ),
        sm: cn(
          "h-[28px] px-8 gap-4 text-12",
          "[&_[data-slot=input-icon]_svg]:size-[14px]",
          "[&_[data-slot=input-clear]]:size-[20px]",
          "[&_[data-slot=input-clear]_svg]:size-[12px]",
          "[&_[data-slot=input-spinner]]:size-[12px] [&_[data-slot=input-spinner]]:border-2",
        ),
        md: cn(
          "h-[36px] px-12 gap-8 text-14",
          "[&_[data-slot=input-icon]_svg]:size-[16px]",
          "[&_[data-slot=input-clear]]:size-[22px]",
          "[&_[data-slot=input-clear]_svg]:size-[14px]",
          "[&_[data-slot=input-spinner]]:size-[14px] [&_[data-slot=input-spinner]]:border-2",
        ),
        lg: cn(
          "h-[44px] px-12 gap-8 text-16",
          "[&_[data-slot=input-icon]_svg]:size-[20px]",
          "[&_[data-slot=input-clear]]:size-[24px]",
          "[&_[data-slot=input-clear]_svg]:size-[16px]",
          "[&_[data-slot=input-spinner]]:size-[18px] [&_[data-slot=input-spinner]]:border-2",
        ),
        xl: cn(
          "h-[56px] px-16 gap-12 text-18",
          "[&_[data-slot=input-icon]_svg]:size-[24px]",
          "[&_[data-slot=input-clear]]:size-[28px]",
          "[&_[data-slot=input-clear]_svg]:size-[18px]",
          "[&_[data-slot=input-spinner]]:size-[22px] [&_[data-slot=input-spinner]]:border-[2.5px]",
        ),
      },
      state: {
        default: "",
        error: cn(
          "border-red-500",
          "hover:border-red-500",
          "focus-within:border-red-500 focus-within:outline-red-500",
          "[&_[data-slot=input-icon]]:text-red-500",
        ),
        warning: cn(
          "border-accent-700",
          "hover:border-accent-700",
          "focus-within:border-accent-700 focus-within:outline-accent-700",
          "[&_[data-slot=input-icon]]:text-accent-700",
        ),
        success: cn(
          "border-green-500",
          "hover:border-green-500",
          "focus-within:border-green-500 focus-within:outline-green-500",
          "[&_[data-slot=input-icon]]:text-green-500",
        ),
        disabled: cn(
          "bg-neutral-100 border-neutral-100 text-neutral-400 cursor-not-allowed",
          "hover:border-neutral-100",
          "[&_[data-slot=input-icon]]:text-neutral-400",
          "[&_input]:placeholder:text-neutral-400",
        ),
        readonly: cn(
          "bg-neutral-100 border-neutral-100",
          "hover:border-neutral-100",
        ),
      },
      loading: {
        true: "cursor-progress [&_input]:cursor-progress",
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

/* ══════ COMPONENT ═════════════════════════════════════════════════ */

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    size = "md",
    label,
    optional = false,
    requiredMarker = "*",
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    leadingIcon,
    trailingIcon,
    clearable = false,
    onClear,
    loading = false,
    showCounter = false,
    fullWidth = true,
    className,
    id: idProp,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    maxLength,
    onChange,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId  = `${id}-helper`;
  const messageId = `${id}-message`;
  const counterId = `${id}-counter`;

  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  /* Track "has value" locally so the clear button shows for both controlled
     and uncontrolled usage without asking the consumer to lift state. */
  const isControlled = value !== undefined;
  const initial =
    isControlled
      ? String(value ?? "")
      : String(defaultValue ?? "");
  const [innerValue, setInnerValue] = useState<string>(initial);
  const currentValue = isControlled ? String(value ?? "") : innerValue;
  const hasValue = currentValue.length > 0;

  const activeValidation = resolveValidation(
    errorMessage, warningMessage, successMessage, validation,
  );
  const isError = activeValidation === "error";

  /* Resolve to a single frame state string. disabled > readonly > validation > default. */
  const frameState: FrameState = disabled
    ? "disabled"
    : readOnly
    ? "readonly"
    : activeValidation ?? "default";

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerValue(event.target.value);
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const el = innerRef.current;
      if (!el) return;

      /* Reset the DOM value + fire a native input event so uncontrolled
         forms and any bound listeners observe the change. */
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value",
      )?.set;
      nativeSetter?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));

      if (!isControlled) setInnerValue("");
      onClear?.(el);

      el.focus();
    },
    [isControlled, onClear],
  );

  /* Compose aria-describedby from helper / message / counter as visible. */
  const describedIds: string[] = [];
  if (helperText && !activeValidation) describedIds.push(helperId);
  if (activeValidation)                describedIds.push(messageId);
  if (showCounter && maxLength != null) describedIds.push(counterId);
  const ariaDescribedBy = [ariaDescribedByProp, ...describedIds]
    .filter(Boolean)
    .join(" ") || undefined;

  const showClear =
    clearable && hasValue && !disabled && !readOnly && !loading;

  const showFooter =
    Boolean(helperText || activeValidation || (showCounter && maxLength != null));

  const message =
    (errorMessage as unknown) ||
    (warningMessage as unknown) ||
    (successMessage as unknown) ||
    null;

  const counter =
    showCounter && maxLength != null ? `${currentValue.length} / ${maxLength}` : null;
  const counterOver =
    showCounter && maxLength != null ? currentValue.length > maxLength : false;

  return (
    <div
      data-slot="input-field"
      className={cn(
        "inline-flex flex-col gap-4 font-sans text-neutral-900 min-w-0",
        fullWidth && "flex w-full",
        disabled && cn(
          "[&_[data-slot=input-label]]:text-neutral-400 [&_[data-slot=input-label]]:cursor-not-allowed",
          "[&_[data-slot=input-marker]]:text-neutral-400",
        ),
        className,
      )}
    >
      {label && (
        <div className="flex items-baseline justify-between gap-8 min-w-0">
          <label
            htmlFor={id}
            data-slot="input-label"
            className="text-14 leading-[1.4] font-semibold text-neutral-900 cursor-pointer"
          >
            {label}
            {required && (
              <span
                data-slot="input-marker"
                aria-hidden="true"
                className="text-12 leading-none font-semibold text-red-500 ml-4"
              >
                {requiredMarker}
              </span>
            )}
          </label>
          {!required && optional && (
            <span
              data-slot="input-marker"
              className="text-12 leading-none font-normal text-neutral-500"
            >
              Optional
            </span>
          )}
        </div>
      )}

      <div
        data-slot="input-frame"
        className={inputFrameVariants({
          size,
          state: frameState,
          loading,
        } as VariantProps<typeof inputFrameVariants>)}
        onClick={() => {
          /* Clicking the frame around the control should focus the control,
             mirroring how native <label> around <input> behaves. */
          if (!disabled && !readOnly) innerRef.current?.focus();
        }}
      >
        {leadingIcon && (
          <span
            data-slot="input-icon"
            aria-hidden="true"
            className="inline-flex items-center justify-center shrink-0 text-neutral-500 pointer-events-none [&_svg]:block"
          >
            {leadingIcon}
          </span>
        )}

        <input
          {...rest}
          ref={innerRef}
          id={id}
          type={type}
          data-slot="input-control"
          value={isControlled ? String(value ?? "") : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={ariaInvalidProp ?? (isError || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-busy={loading || undefined}
          className={cn(
            "flex-1 min-w-0 h-full p-0 m-0 border-0 outline-none bg-transparent",
            "text-inherit font-[inherit] leading-none appearance-none",
            "[-webkit-appearance:none]",
            "placeholder:text-neutral-500 placeholder:opacity-100",
            "disabled:cursor-not-allowed disabled:text-neutral-400",
            "[&:disabled]:[-webkit-text-fill-color:var(--hc-color-text-disabled)]",
            "read-only:cursor-default",
            /* Kill browser cruft on search + number inputs so the visual is ours. */
            "[&::-webkit-search-decoration]:appearance-none",
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-results-button]:appearance-none",
            "[&::-webkit-search-results-decoration]:appearance-none",
            "[&[type=number]::-webkit-outer-spin-button]:appearance-none [&[type=number]::-webkit-outer-spin-button]:m-0",
            "[&[type=number]::-webkit-inner-spin-button]:appearance-none [&[type=number]::-webkit-inner-spin-button]:m-0",
            "[&[type=number]]:[-moz-appearance:textfield] [&[type=number]]:[appearance:textfield]",
          )}
        />

        {showClear && (
          <button
            type="button"
            data-slot="input-clear"
            aria-label="Clear input"
            onClick={handleClear}
            tabIndex={-1}
            className={cn(
              "inline-flex items-center justify-center shrink-0 p-0 m-0 border-0 bg-transparent",
              "text-neutral-500 cursor-pointer rounded-full",
              "transition-[background-color,color] duration-150 ease-standard motion-reduce:duration-0",
              "hover:bg-neutral-100 hover:text-neutral-900",
              "active:bg-neutral-200",
              "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
              "[&_svg]:block",
            )}
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {loading ? (
          <span
            data-slot="input-spinner"
            aria-hidden="true"
            className={cn(
              "inline-block shrink-0 rounded-full",
              "border-neutral-200 border-t-brand-500",
              "animate-spin motion-reduce:[animation-duration:2500ms]",
            )}
          />
        ) : (
          trailingIcon && !showClear && (
            <span
              data-slot="input-icon"
              aria-hidden="true"
              className="inline-flex items-center justify-center shrink-0 text-neutral-500 pointer-events-none [&_svg]:block"
            >
              {trailingIcon}
            </span>
          )
        )}
      </div>

      {showFooter && (
        <div
          data-slot="input-footer"
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
          ) : (
            <span />
          )}

          {counter != null && (
            <span
              id={counterId}
              className={cn(
                "text-12 leading-[1.4] tabular-nums shrink-0 ml-auto",
                counterOver ? "text-red-500 font-semibold" : "text-neutral-500",
              )}
            >
              {counter}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { inputFrameVariants };
