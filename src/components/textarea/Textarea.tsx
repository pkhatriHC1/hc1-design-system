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
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  TextareaCounterProps,
  TextareaDescriptionProps,
  TextareaHelperProps,
  TextareaLabelProps,
  TextareaProps,
  TextareaSize,
  TextareaValidation,
} from "./Textarea.types";

/**
 * HC1 Textarea — the canonical multi-line text input.
 *
 * Migrated from Textarea.css to shadcn-style (cva + Tailwind utilities).
 * Compound API (Textarea.Label / .Description / .Helper / .Counter),
 * context registration for aria-describedby, auto-resize measurement,
 * and every prop are preserved verbatim. Frame shape mirrors Input's
 * philosophy but the geometry differs (padded frame, no fixed height,
 * padY per size, rendered line-height per size) so a dedicated
 * textareaFrameVariants exists rather than reusing inputFrameVariants.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type TextareaContextValue = {
  inputId: string;
  descriptionId: string;
  helperId: string;
  messageId: string;
  counterId: string;
  size: TextareaSize;
  disabled: boolean;
  activeValidation: TextareaValidation | undefined;
  currentLength: number;
  maxLength: number | undefined;
  showCounter: boolean;
  registerDescription: (present: boolean) => void;
  registerHelper: (present: boolean) => void;
  registerCounter: (present: boolean) => void;
};

const TextareaContext = createContext<TextareaContextValue | null>(null);

function useTextareaContext(source: string): TextareaContextValue {
  const ctx = useContext(TextareaContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Textarea] ${source} must be rendered inside a <Textarea> parent.`,
    );
  }
  return ctx;
}

/* ══════ CHILD SPLIT ═══════════════════════════════════════════════ */

type ChildBuckets = {
  label?: ReactElement;
  description?: ReactElement;
  helper?: ReactElement;
  counter?: ReactElement;
};

function splitChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = {};
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Textarea.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Textarea.Description":
        buckets.description ??= child as ReactElement;
        return;
      case "Textarea.Helper":
        buckets.helper ??= child as ReactElement;
        return;
      case "Textarea.Counter":
        buckets.counter ??= child as ReactElement;
        return;
      default:
        return;
    }
  });
  return buckets;
}

/* ══════ RESOLVE VALIDATION ════════════════════════════════════════ */

function resolveValidation(
  errorMessage: unknown,
  warningMessage: unknown,
  successMessage: unknown,
  validation: TextareaValidation | undefined,
): TextareaValidation | undefined {
  if (errorMessage)   return "error";
  if (warningMessage) return "warning";
  if (successMessage) return "success";
  return validation;
}

/* ══════ FRAME CVA ═════════════════════════════════════════════════ */

type FrameState = "default" | "error" | "warning" | "success" | "disabled" | "readonly";

/**
 * Frame classes for the visual textarea box. Same border / focus /
 * validation language as Input, plus per-size padding + rendered
 * line-height + min/max heights driven by --hc-textarea-min-rows /
 * --hc-textarea-max-rows (set inline by the root from minRows / maxRows).
 */
const textareaFrameVariants = cva(
  cn(
    "relative flex w-full min-w-0",
    "border rounded-control bg-white text-neutral-900",
    "font-sans",
    "cursor-text [-webkit-tap-highlight-color:transparent]",
    "transition-[background-color,border-color,color,outline-color] duration-150 ease-standard motion-reduce:duration-0",
    "border-neutral-200",
    "outline-none",
    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring focus-within:border-brand-500",
    "hover:border-neutral-300",
  ),
  {
    variants: {
      size: {
        sm: cn(
          "py-[var(--hc-textarea-pad-y-sm)] px-8 text-12",
          "[&>textarea]:leading-[var(--hc-textarea-line-sm)]",
          "[&>textarea]:min-h-[calc(var(--hc-textarea-min-rows,3)*var(--hc-textarea-line-sm))]",
          "[&>textarea]:max-h-[calc(var(--hc-textarea-max-rows,12)*var(--hc-textarea-line-sm))]",
          "[&_[data-slot=textarea-spinner]]:size-[12px]",
        ),
        md: cn(
          "py-[var(--hc-textarea-pad-y-md)] px-12 text-14",
          "[&>textarea]:leading-[var(--hc-textarea-line-md)]",
          "[&>textarea]:min-h-[calc(var(--hc-textarea-min-rows,3)*var(--hc-textarea-line-md))]",
          "[&>textarea]:max-h-[calc(var(--hc-textarea-max-rows,12)*var(--hc-textarea-line-md))]",
          "[&_[data-slot=textarea-spinner]]:size-[14px]",
        ),
        lg: cn(
          "py-[var(--hc-textarea-pad-y-lg)] px-12 text-16",
          "[&>textarea]:leading-[var(--hc-textarea-line-lg)]",
          "[&>textarea]:min-h-[calc(var(--hc-textarea-min-rows,3)*var(--hc-textarea-line-lg))]",
          "[&>textarea]:max-h-[calc(var(--hc-textarea-max-rows,12)*var(--hc-textarea-line-lg))]",
          "[&_[data-slot=textarea-spinner]]:size-[18px]",
        ),
      },
      state: {
        default: "",
        error: cn(
          "border-red-500 hover:border-red-500",
          "focus-within:border-red-500 focus-within:outline-red-500",
        ),
        warning: cn(
          "border-accent-700 hover:border-accent-700",
          "focus-within:border-accent-700 focus-within:outline-accent-700",
        ),
        success: cn(
          "border-green-500 hover:border-green-500",
          "focus-within:border-green-500 focus-within:outline-green-500",
        ),
        disabled: cn(
          "bg-neutral-100 border-neutral-100 text-neutral-400 cursor-not-allowed",
          "hover:border-neutral-100",
          "[&>textarea]:placeholder:text-neutral-400",
        ),
        readonly: cn(
          "bg-neutral-100 border-neutral-100",
          "hover:border-neutral-100",
        ),
      },
      /* When autoResize is on, JS sets height inline; hide the scrollbar
         so it doesn't flash between the JS measurement and the reflow.
         (Original CSS behavior preserved verbatim — including the same
         known limitation that overflow-y stays hidden past maxRows.) */
      autoResize: {
        true: "[&>textarea]:overflow-y-hidden",
        false: "",
      },
      /* User-drag resize handle. Default 'none' matches textarea base. */
      resize: {
        none: "",
        vertical: "[&>textarea]:resize-y",
      },
      loading: {
        true: "cursor-progress [&>textarea]:cursor-progress",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
      autoResize: false,
      resize: "none",
      loading: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = "md",
    label,
    description,
    optional = false,
    requiredMarker = "*",
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    loading = false,
    showCounter = false,
    fullWidth = true,
    minRows = 3,
    maxRows = 12,
    autoResize = false,
    resize = "none",
    className,
    id: idProp,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    maxLength,
    onChange,
    style,
    children,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    placeholder,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = `${id}-description`;
  const helperId      = `${id}-helper`;
  const messageId     = `${id}-message`;
  const counterId     = `${id}-counter`;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement, []);

  const isControlled = value !== undefined;
  const initial =
    isControlled
      ? String(value ?? "")
      : String(defaultValue ?? "");
  const [innerValue, setInnerValue] = useState<string>(initial);
  const currentValue = isControlled ? String(value ?? "") : innerValue;
  const currentLength = currentValue.length;

  const activeValidation = resolveValidation(
    errorMessage, warningMessage, successMessage, validation,
  );
  const isError = activeValidation === "error";

  const frameState: FrameState = disabled
    ? "disabled"
    : readOnly
    ? "readonly"
    : activeValidation ?? "default";

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInnerValue(event.target.value);
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  const buckets = splitChildren(children);
  const composedLabel       = buckets.label;
  const composedDescription = buckets.description;
  const composedHelper      = buckets.helper;
  const composedCounter     = buckets.counter;

  const [descRegistered, setDescRegistered]     = useState(!!composedDescription || !!description);
  const [helperRegistered, setHelperRegistered] = useState(!!composedHelper || !!helperText);
  const [counterRegistered, setCounterRegistered] = useState(!!composedCounter || (showCounter && maxLength != null));

  const registerDescription = useCallback((v: boolean) => setDescRegistered(v), []);
  const registerHelper      = useCallback((v: boolean) => setHelperRegistered(v), []);
  const registerCounter     = useCallback((v: boolean) => setCounterRegistered(v), []);

  useEffect(() => {
    const wantsDesc    = !!composedDescription || !!description;
    if (wantsDesc !== descRegistered)    setDescRegistered(wantsDesc);
    const wantsHelper  = !!composedHelper || (!!helperText && !activeValidation);
    if (wantsHelper !== helperRegistered) setHelperRegistered(wantsHelper);
    const wantsCounter = !!composedCounter || (showCounter && maxLength != null);
    if (wantsCounter !== counterRegistered) setCounterRegistered(wantsCounter);
  }, [composedDescription, description, composedHelper, helperText, activeValidation, composedCounter, showCounter, maxLength, descRegistered, helperRegistered, counterRegistered]);

  /* Auto-resize: measure scrollHeight, clamp between min/maxRows × line
     height, apply inline. Values here mirror --hc-textarea-line-* /
     --hc-textarea-pad-y-* in variables.css — if the tokens change, both
     the CSS var references above AND these constants below need updating. */
  const lineHeightPx = size === "sm" ? 20 : size === "lg" ? 24 : 22;
  const paddingYPx   = size === "lg" ? 12 : 8;
  useLayoutEffect(() => {
    if (!autoResize) return;
    const el = innerRef.current;
    if (!el) return;

    el.style.height = "auto";
    const scroll = el.scrollHeight;
    const minH = minRows * lineHeightPx + paddingYPx * 2;
    const maxH = maxRows * lineHeightPx + paddingYPx * 2;
    const next = Math.min(Math.max(scroll, minH), maxH);
    el.style.height = `${next}px`;
  }, [currentValue, autoResize, minRows, maxRows, lineHeightPx, paddingYPx]);

  const describedIds: string[] = [];
  if (descRegistered)   describedIds.push(descriptionId);
  if (activeValidation) describedIds.push(messageId);
  else if (helperRegistered) describedIds.push(helperId);
  if (counterRegistered) describedIds.push(counterId);
  const ariaDescribedBy =
    [ariaDescribedByProp, ...describedIds].filter(Boolean).join(" ") || undefined;

  const contextValue: TextareaContextValue = {
    inputId: id,
    descriptionId,
    helperId,
    messageId,
    counterId,
    size,
    disabled: !!disabled,
    activeValidation,
    currentLength,
    maxLength: maxLength ?? undefined,
    showCounter: !!showCounter && maxLength != null,
    registerDescription,
    registerHelper,
    registerCounter,
  };

  /* Inline CSS custom properties so the frame's min/max height calcs
     read minRows / maxRows without re-rendering the class string. */
  const frameStyle: React.CSSProperties = {
    ...style,
    "--hc-textarea-min-rows": String(minRows),
    "--hc-textarea-max-rows": String(maxRows),
  } as React.CSSProperties;

  const messageNode =
    (errorMessage as ReactNode) ??
    (warningMessage as ReactNode) ??
    (successMessage as ReactNode) ??
    null;

  const showFooterCounter = showCounter && maxLength != null && !composedCounter;
  const showFooterHelper  = !!helperText && !activeValidation && !composedHelper;
  const showFooterMessage = !!activeValidation && !!messageNode;
  const showFooter =
    showFooterHelper || showFooterMessage || showFooterCounter || !!composedHelper || !!composedCounter;

  return (
    <TextareaContext.Provider value={contextValue}>
      <div
        data-slot="textarea-field"
        className={cn(
          "inline-flex flex-col gap-4 font-sans text-neutral-900 min-w-0",
          fullWidth && "flex w-full",
          disabled && cn(
            "[&_[data-slot=textarea-label]]:text-neutral-400 [&_[data-slot=textarea-label]]:cursor-not-allowed",
            "[&_[data-slot=textarea-marker]]:text-neutral-400",
            "[&_[data-slot=textarea-description]]:text-neutral-400 [&_[data-slot=textarea-description]]:cursor-not-allowed",
          ),
          className,
        )}
      >
        {/* Label row — subcomponent wins, else render from `label` prop. */}
        {(composedLabel || label) && (
          <div className="flex items-baseline justify-between gap-8 min-w-0">
            {composedLabel ?? (
              <label
                htmlFor={id}
                data-slot="textarea-label"
                className="text-14 leading-[1.4] font-semibold text-neutral-900 cursor-pointer"
              >
                {label}
                {required && (
                  <span
                    data-slot="textarea-marker"
                    aria-hidden="true"
                    className="text-12 leading-none font-semibold text-red-500 ml-4"
                  >
                    {requiredMarker}
                  </span>
                )}
              </label>
            )}
            {!required && optional && (
              <span
                data-slot="textarea-marker"
                className="text-12 leading-none font-normal text-neutral-500"
              >
                Optional
              </span>
            )}
          </div>
        )}

        {/* Description — subcomponent wins, else render from `description`. */}
        {composedDescription ?? (description && (
          <span
            id={descriptionId}
            data-slot="textarea-description"
            className="text-12 leading-normal text-neutral-500"
          >
            {description}
          </span>
        ))}

        {/* Frame — the visual textarea box. */}
        <div
          data-slot="textarea-frame"
          className={textareaFrameVariants({
            size,
            state: frameState,
            autoResize,
            resize,
            loading,
          } as VariantProps<typeof textareaFrameVariants>)}
          style={frameStyle}
          onClick={() => {
            if (!disabled && !readOnly) innerRef.current?.focus();
          }}
        >
          <textarea
            {...rest}
            ref={innerRef}
            id={id}
            data-slot="textarea-control"
            value={isControlled ? String(value ?? "") : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            rows={minRows}
            onChange={handleChange}
            aria-invalid={ariaInvalidProp ?? (isError || undefined)}
            aria-describedby={ariaDescribedBy}
            aria-busy={loading || undefined}
            className={cn(
              "flex-1 w-full min-w-0 p-0 m-0 border-0 outline-none bg-transparent",
              "text-inherit font-[inherit] leading-[inherit]",
              "appearance-none [-webkit-appearance:none]",
              "resize-none overflow-x-hidden overflow-y-auto",
              "placeholder:text-neutral-500 placeholder:opacity-100",
              "disabled:cursor-not-allowed disabled:text-neutral-400",
              "[&:disabled]:[-webkit-text-fill-color:var(--hc-color-text-disabled)]",
              "read-only:cursor-default",
            )}
          />

          {loading && (
            <span
              data-slot="textarea-spinner"
              aria-hidden="true"
              className={cn(
                "absolute right-8 top-8",
                "inline-block shrink-0 rounded-full pointer-events-none",
                "border-2 border-neutral-200 border-t-brand-500",
                "animate-spin motion-reduce:[animation-duration:2500ms]",
              )}
            />
          )}
        </div>

        {/* Footer — helper OR message on the left, counter on the right. */}
        {showFooter && (
          <div
            data-slot="textarea-footer"
            className="flex items-start justify-between gap-12 min-w-0"
          >
            {showFooterMessage ? (
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
                {messageNode}
              </span>
            ) : showFooterHelper ? (
              <span
                id={helperId}
                className="text-12 leading-[1.4] text-neutral-500 min-w-0 flex-1"
              >
                {helperText}
              </span>
            ) : composedHelper ? (
              composedHelper
            ) : (
              <span />
            )}

            {composedCounter ?? (showFooterCounter && (
              <span
                id={counterId}
                className={cn(
                  "text-12 leading-[1.4] tabular-nums shrink-0 ml-auto",
                  maxLength != null && currentLength > maxLength
                    ? "text-red-500 font-semibold"
                    : "text-neutral-500",
                )}
              >
                {currentLength} / {maxLength}
              </span>
            ))}
          </div>
        )}
      </div>
    </TextareaContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLTextAreaElement, TextareaProps>> & {
  Label:       typeof TextareaLabel;
  Description: typeof TextareaDescription;
  Helper:      typeof TextareaHelper;
  Counter:     typeof TextareaCounter;
};

(Textarea as unknown as { displayName: string }).displayName = "Textarea";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const TextareaLabel = forwardRef<HTMLLabelElement, TextareaLabelProps>(function TextareaLabel(
  { className, children, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Label");
  return (
    <label
      ref={ref}
      htmlFor={ctx.inputId}
      data-slot="textarea-label"
      className={cn(
        "text-14 leading-[1.4] font-semibold text-neutral-900 cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
});
TextareaLabel.displayName = "Textarea.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const TextareaDescription = forwardRef<HTMLSpanElement, TextareaDescriptionProps>(function TextareaDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Description");
  const descId = idProp ?? ctx.descriptionId;

  useEffect(() => {
    ctx.registerDescription(true);
    return () => ctx.registerDescription(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={descId}
      data-slot="textarea-description"
      className={cn(
        "text-12 leading-normal text-neutral-500",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
TextareaDescription.displayName = "Textarea.Description";

/* ══════ HELPER ════════════════════════════════════════════════════ */

const TextareaHelper = forwardRef<HTMLSpanElement, TextareaHelperProps>(function TextareaHelper(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Helper");
  const helperId = idProp ?? ctx.helperId;

  useEffect(() => {
    ctx.registerHelper(true);
    return () => ctx.registerHelper(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={helperId}
      data-slot="textarea-helper"
      className={cn(
        "text-12 leading-[1.4] text-neutral-500 min-w-0 flex-1",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
TextareaHelper.displayName = "Textarea.Helper";

/* ══════ COUNTER ═══════════════════════════════════════════════════ */

const TextareaCounter = forwardRef<HTMLSpanElement, TextareaCounterProps>(function TextareaCounter(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Counter");
  const counterId = idProp ?? ctx.counterId;

  useEffect(() => {
    ctx.registerCounter(true);
    return () => ctx.registerCounter(false);
  }, [ctx]);

  const over = ctx.maxLength != null && ctx.currentLength > ctx.maxLength;
  const text =
    ctx.maxLength != null
      ? `${ctx.currentLength} / ${ctx.maxLength}`
      : `${ctx.currentLength}`;

  return (
    <span
      ref={ref}
      id={counterId}
      data-slot="textarea-counter"
      className={cn(
        "text-12 leading-[1.4] tabular-nums shrink-0 ml-auto",
        over ? "text-red-500 font-semibold" : "text-neutral-500",
        className,
      )}
      {...rest}
    >
      {children ?? text}
    </span>
  );
});
TextareaCounter.displayName = "Textarea.Counter";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Textarea.Label       = TextareaLabel;
Textarea.Description = TextareaDescription;
Textarea.Helper      = TextareaHelper;
Textarea.Counter     = TextareaCounter;

export { textareaFrameVariants };
