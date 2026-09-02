import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  ToastActionsProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastIconProps,
  ToastProps,
  ToastState,
  ToastTitleProps,
  ToastVariant,
} from "./Toast.types";

/**
 * HC1 Toast — the canonical transient-feedback primitive.
 *
 * Migrated from Toast.css to shadcn-style (cva + Tailwind utilities).
 *
 * Deliberately does NOT wrap @radix-ui/react-toast — Radix Toast requires
 * a ToastProvider + ToastViewport queue/positioning system that would
 * balloon the public API surface. The current design keeps Toast as a
 * lean presentational primitive (no portal, no queue, no viewport) so
 * downstream apps can wrap it with their own queuing / positioning
 * strategy. The auto-close timer + pause/resume on hover/focus lifecycle
 * lives here because it belongs to a single Toast, not the queue.
 *
 * Compound API preserved verbatim — Toast, Toast.Icon, Toast.Title,
 * Toast.Description, Toast.Actions, Toast.Close. Child bucketing (icon
 * left, body middle, close right) is order-independent.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type ToastContextValue = {
  variant:     ToastVariant;
  dismissible: boolean;
  requestDismiss: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext(source: string): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Toast] ${source} must be rendered inside a <Toast> parent.`,
    );
  }
  return ctx;
}

/* ══════ EXIT DURATION ═════════════════════════════════════════════
 * Matches motion.overlayExit (150ms) — kept as a constant so the JS
 * timer and the CSS transition stay in sync. */
const EXIT_DURATION_MS = 150;

/* ══════ CVA — ROOT ═════════════════════════════════════════════════ */

const toastRootVariants = cva(
  cn(
    "relative flex items-start gap-12 box-border text-left min-w-[320px] max-w-[420px]",
    "py-12 pr-16 pl-[calc(16px+4px)]",
    "bg-white text-neutral-900 border border-neutral-200 rounded-surface shadow-lg",
    "font-sans",
    /* Left accent stripe painted via a pseudo-element (arbitrary variant). */
    "before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[4px]",
    "before:rounded-tl-surface before:rounded-bl-surface",
    "before:bg-[color:var(--hc-toast-accent)]",
    /* Entrance transition: opacity 0 + translateY(8px) + scale(0.98) → rest.
       Matches original hc-toast-enter keyframe (via data-state). */
    "opacity-0 translate-y-[8px] scale-[0.98]",
    "data-[state=visible]:opacity-100 data-[state=visible]:translate-y-0 data-[state=visible]:scale-100",
    /* Exit transition: opacity 1 → 0 + translateY(4px). Matches
       hc-toast-exit keyframe. */
    "data-[state=closing]:opacity-0 data-[state=closing]:translate-y-[4px] data-[state=closing]:scale-[0.98]",
    "data-[state=closing]:pointer-events-none",
    "transition-[opacity,transform] duration-250 ease-entrance",
    "data-[state=closing]:duration-150 data-[state=closing]:ease-exit",
    "motion-reduce:duration-0 motion-reduce:data-[state=closing]:duration-0",
  ),
  {
    variants: {
      variant: {
        info: cn(
          "[--hc-toast-accent:var(--hc-color-status-info-fg)]",
          "[--hc-toast-icon-color:var(--hc-color-blue-600)]",
        ),
        success: cn(
          "[--hc-toast-accent:var(--hc-color-status-success-fg)]",
          "[--hc-toast-icon-color:var(--hc-color-green-600)]",
        ),
        warning: cn(
          "[--hc-toast-accent:var(--hc-color-status-warning-fg)]",
          "[--hc-toast-icon-color:var(--hc-color-yellow-600)]",
        ),
        danger: cn(
          "[--hc-toast-accent:var(--hc-color-action-danger)]",
          "[--hc-toast-icon-color:var(--hc-color-red-600)]",
        ),
        neutral: cn(
          "[--hc-toast-accent:var(--hc-color-border-strong)]",
          "[--hc-toast-icon-color:var(--hc-color-text-tertiary)]",
        ),
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const ToastRoot = forwardRef<HTMLDivElement, ToastProps>(function ToastRoot(
  {
    variant     = "info",
    role        = "status",
    autoClose   = 4000,
    persistent  = false,
    dismissible = true,
    onDismiss,
    className,
    children,
    style,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  ref,
) {
  /* ─── State ────────────────────────────────────────────────────── */

  const [state, setState] = useState<ToastState>("visible");

  /* ─── Auto-close timer with pause / resume ─────────────────────── */

  const effectiveDuration = persistent || autoClose === false ? null : autoClose;

  const timerRef     = useRef<number | null>(null);
  const remainingRef = useRef<number>(effectiveDuration ?? Infinity);
  const startedAtRef = useRef<number>(0);
  const pausedRef    = useRef<boolean>(false);
  const dismissedRef = useRef<boolean>(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const requestDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    clearTimer();
    setState("closing");
    window.setTimeout(() => {
      setState("dismissed");
      onDismissRef.current?.();
    }, EXIT_DURATION_MS);
  }, [clearTimer]);

  const scheduleDismiss = useCallback(
    (ms: number) => {
      clearTimer();
      if (!Number.isFinite(ms)) return;
      startedAtRef.current = Date.now();
      timerRef.current = window.setTimeout(() => {
        requestDismiss();
      }, ms);
    },
    [clearTimer, requestDismiss],
  );

  const pauseTimer = useCallback(() => {
    if (pausedRef.current) return;
    if (effectiveDuration == null) return;
    pausedRef.current = true;
    if (timerRef.current != null) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      clearTimer();
    }
  }, [clearTimer, effectiveDuration]);

  const resumeTimer = useCallback(() => {
    if (!pausedRef.current) return;
    if (effectiveDuration == null) return;
    pausedRef.current = false;
    scheduleDismiss(remainingRef.current);
  }, [effectiveDuration, scheduleDismiss]);

  /* Start the timer on mount + restart if autoClose / persistent change
     while the Toast is visible (rare but well-defined). */
  useEffect(() => {
    remainingRef.current = effectiveDuration ?? Infinity;
    if (effectiveDuration != null && state === "visible") {
      scheduleDismiss(effectiveDuration);
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveDuration]);

  /* ─── Event forwarding + timer pause ───────────────────────────── */

  const handleMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
    pauseTimer();
    onMouseEnter?.(event);
  };
  const handleMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
    resumeTimer();
    onMouseLeave?.(event);
  };
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    pauseTimer();
    onFocus?.(event);
  };
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    /* Only resume when focus leaves the Toast subtree entirely. */
    if (
      event.currentTarget &&
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      onBlur?.(event);
      return;
    }
    resumeTimer();
    onBlur?.(event);
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && dismissible) {
      event.stopPropagation();
      requestDismiss();
    }
    onKeyDown?.(event);
  };

  /* ─── Context + child splitting ────────────────────────────────── */

  const contextValue = useMemo<ToastContextValue>(
    () => ({ variant, dismissible, requestDismiss }),
    [variant, dismissible, requestDismiss],
  );

  const { icon, close, body } = splitChildren(children);

  /* Once the exit animation has completed the parent is expected to
     unmount. If it does not, we render nothing so the DOM stays clean. */
  if (state === "dismissed") return null;

  return (
    <ToastContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        aria-atomic="true"
        data-state={state}
        data-slot="toast-root"
        className={cn(
          toastRootVariants({
            variant,
          } as VariantProps<typeof toastRootVariants>),
          className,
        )}
        style={style as CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {icon}
        <div data-slot="toast-body" className="flex-1 min-w-0 flex flex-col gap-4">
          {body}
        </div>
        {dismissible && close}
      </div>
    </ToastContext.Provider>
  );
});
ToastRoot.displayName = "Toast";

/* ══════ CHILD SPLITTING ═══════════════════════════════════════════ */

function splitChildren(children: ReactNode): {
  icon:  ReactNode | null;
  close: ReactNode | null;
  body:  ReactNode[];
} {
  let icon:  ReactNode | null = null;
  let close: ReactNode | null = null;
  const body: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) body.push(child);
      return;
    }
    const el = child as ReactElement;
    /* First Icon / Close wins if the consumer accidentally authors two.
       Everything else falls through to the body stack. */
    if (el.type === ToastIcon) {
      if (!icon) icon = el;
      return;
    }
    if (el.type === ToastClose) {
      if (!close) close = el;
      return;
    }
    body.push(el);
  });

  return { icon, close, body };
}

/* ══════ ICON ══════════════════════════════════════════════════════ */

const ToastIcon = forwardRef<HTMLSpanElement, ToastIconProps>(function ToastIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="toast-icon"
      aria-hidden="true"
      className={cn(
        "shrink-0 inline-flex items-center justify-center mt-[2px]",
        "text-[color:var(--hc-toast-icon-color,currentColor)]",
        "[&_svg]:block [&_svg]:size-[20px]",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
ToastIcon.displayName = "Toast.Icon";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(function ToastTitle(
  { as = "div", className, children, ...rest },
  ref,
) {
  const Tag = (typeof as === "number" ? `h${as}` : as) as
    | "div"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLHeadingElement>}
      data-slot="toast-title"
      className={cn(
        "m-0 font-sans text-14 font-semibold leading-[1.4] text-neutral-900",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});
ToastTitle.displayName = "Toast.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(function ToastDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="toast-description"
      className={cn(
        "m-0 font-sans text-14 leading-normal text-neutral-700 min-w-0",
        /* Reset UA default paragraph margins + inter-paragraph rhythm. */
        "[&_p]:m-0",
        "[&_p+p]:mt-4",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
ToastDescription.displayName = "Toast.Description";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const ToastActions = forwardRef<HTMLDivElement, ToastActionsProps>(function ToastActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="toast-actions"
      className={cn(
        "flex flex-wrap gap-8 mt-8 min-w-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
ToastActions.displayName = "Toast.Actions";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
  { label = "Dismiss", className, onClick, ...rest },
  ref,
) {
  const ctx = useToastContext("Toast.Close");
  return (
    <button
      ref={ref}
      type="button"
      data-slot="toast-close"
      onClick={(event) => {
        onClick?.(event);
        ctx.requestDismiss();
      }}
      aria-label={label}
      className={cn(
        "appearance-none border-0 m-0 p-0 bg-transparent text-neutral-500 cursor-pointer shrink-0",
        "size-[24px] rounded-full inline-flex items-center justify-center",
        "text-[length:14px]/none",
        /* Tug into the padding so the X sits closer to the corner. */
        "-mr-[4px] -mt-[2px]",
        "transition-[background-color,color] duration-150 ease-standard motion-reduce:duration-0",
        "hover:bg-neutral-100 hover:text-neutral-900",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        className,
      )}
      {...rest}
    >
      <CloseIcon />
    </button>
  );
});
ToastClose.displayName = "Toast.Close";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 3 L11 11 M11 3 L3 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type ToastCompound = typeof ToastRoot & {
  Icon:        typeof ToastIcon;
  Title:       typeof ToastTitle;
  Description: typeof ToastDescription;
  Actions:     typeof ToastActions;
  Close:       typeof ToastClose;
};

const Toast = ToastRoot as ToastCompound;
Toast.Icon        = ToastIcon;
Toast.Title       = ToastTitle;
Toast.Description = ToastDescription;
Toast.Actions     = ToastActions;
Toast.Close       = ToastClose;

export { Toast, useToastContext, toastRootVariants };
