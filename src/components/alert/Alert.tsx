import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  AlertActionsProps,
  AlertAppearance,
  AlertCloseProps,
  AlertDescriptionProps,
  AlertIconProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
} from "./Alert.types";

/**
 * HC1 Alert — the canonical inline-feedback primitive.
 *
 * Migrated from Alert.css to shadcn-style (cva + Tailwind utilities).
 * Compound API (Icon, Title, Description, Actions, Close), child-splitting
 * layout, ARIA wiring, and prop API preserved verbatim.
 *
 * The 5 variants × 3 appearances = 15 color combinations map to cva
 * compoundVariants. Each combination sets bg / text / border via direct
 * Tailwind classes plus --hc-alert-icon-color via an arbitrary property,
 * which the Icon subcomponent reads via `text-[color:var(...)]` — the
 * same variable pattern the original CSS used.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type AlertContextValue = {
  variant:    AlertVariant;
  appearance: AlertAppearance;
  disabled:   boolean;
};

const AlertContext = createContext<AlertContextValue>({
  variant:    "info",
  appearance: "soft",
  disabled:   false,
});

const useAlertContext = () => useContext(AlertContext);

/* ══════ CVA — ROOT ═════════════════════════════════════════════════ */

const alertRootVariants = cva(
  cn(
    "flex items-start gap-12 min-w-0 box-border text-left",
    "font-sans",
    "py-12 px-16",
    "border rounded-surface",
    "transition-[background-color,border-color,color,opacity] duration-150 ease-standard motion-reduce:duration-0",
  ),
  {
    variants: {
      variant:    { info: "", success: "", warning: "", danger: "", neutral: "" },
      appearance: { soft: "", outline: "", solid: "" },
      disabled: {
        true:  "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      /* ═══ SOFT ═════════════════════════════════════════════════════ */
      { appearance: "soft", variant: "info",    className: "bg-brand-50 text-brand-500 border-brand-100 [--hc-alert-icon-color:var(--hc-color-blue-600)]" },
      { appearance: "soft", variant: "success", className: "bg-green-50 text-green-500 border-green-100 [--hc-alert-icon-color:var(--hc-color-green-600)]" },
      { appearance: "soft", variant: "warning", className: "bg-yellow-50 text-accent-700 border-yellow-100 [--hc-alert-icon-color:var(--hc-color-yellow-600)]" },
      { appearance: "soft", variant: "danger",  className: "bg-red-50 text-red-500 border-red-100 [--hc-alert-icon-color:var(--hc-color-red-600)]" },
      { appearance: "soft", variant: "neutral", className: "bg-neutral-100 text-neutral-700 border-neutral-200 [--hc-alert-icon-color:var(--hc-color-text-tertiary)]" },

      /* ═══ OUTLINE ══════════════════════════════════════════════════ */
      { appearance: "outline", variant: "info",    className: "bg-white text-brand-500 border-brand-100 [--hc-alert-icon-color:var(--hc-color-blue-600)]" },
      { appearance: "outline", variant: "success", className: "bg-white text-green-500 border-green-100 [--hc-alert-icon-color:var(--hc-color-green-600)]" },
      { appearance: "outline", variant: "warning", className: "bg-white text-accent-700 border-yellow-100 [--hc-alert-icon-color:var(--hc-color-yellow-600)]" },
      { appearance: "outline", variant: "danger",  className: "bg-white text-red-500 border-red-100 [--hc-alert-icon-color:var(--hc-color-red-600)]" },
      { appearance: "outline", variant: "neutral", className: "bg-white text-neutral-700 border-neutral-200 [--hc-alert-icon-color:var(--hc-color-text-tertiary)]" },

      /* ═══ SOLID ════════════════════════════════════════════════════ */
      { appearance: "solid", variant: "info",    className: "bg-brand-500 text-white border-brand-500 [--hc-alert-icon-color:var(--hc-color-text-inverse)]" },
      { appearance: "solid", variant: "success", className: "bg-green-500 text-white border-green-500 [--hc-alert-icon-color:var(--hc-color-text-inverse)]" },
      { appearance: "solid", variant: "warning", className: "bg-accent-700 text-white border-accent-700 [--hc-alert-icon-color:var(--hc-color-text-inverse)]" },
      { appearance: "solid", variant: "danger",  className: "bg-red-500 text-white border-red-500 [--hc-alert-icon-color:var(--hc-color-text-inverse)]" },
      { appearance: "solid", variant: "neutral", className: "bg-neutral-900 text-white border-neutral-900 [--hc-alert-icon-color:var(--hc-color-text-inverse)]" },
    ],
    defaultVariants: {
      variant: "info",
      appearance: "soft",
      disabled: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function AlertRoot(
  {
    variant    = "info",
    appearance = "soft",
    role       = "status",
    disabled   = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const contextValue = useMemo<AlertContextValue>(
    () => ({ variant, appearance, disabled }),
    [variant, appearance, disabled],
  );

  const { icon, close, body } = splitChildren(children);

  return (
    <AlertContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        aria-disabled={disabled || undefined}
        data-slot="alert-root"
        style={style as CSSProperties}
        className={cn(
          alertRootVariants({
            variant,
            appearance,
            disabled,
          } as VariantProps<typeof alertRootVariants>),
          className,
        )}
      >
        {icon}
        <div
          data-slot="alert-body"
          className="flex-1 min-w-0 flex flex-col gap-4"
        >
          {body}
        </div>
        {close}
      </div>
    </AlertContext.Provider>
  );
});
AlertRoot.displayName = "Alert";

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
    /* Only the first Icon / Close wins if the consumer accidentally
       authors two. Everything else falls through to the body stack. */
    if (el.type === AlertIcon) {
      if (!icon) icon = el;
      return;
    }
    if (el.type === AlertClose) {
      if (!close) close = el;
      return;
    }
    body.push(el);
  });

  return { icon, close, body };
}

/* ══════ ICON ══════════════════════════════════════════════════════ */

const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(function AlertIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="alert-icon"
      aria-hidden="true"
      className={cn(
        "shrink-0 inline-flex items-center justify-center mt-[2px]",
        "text-[color:var(--hc-alert-icon-color,currentColor)]",
        "[&_svg]:block [&_svg]:size-[20px]",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
AlertIcon.displayName = "Alert.Icon";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle(
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
      data-slot="alert-title"
      className={cn(
        "m-0 font-sans text-16 font-semibold leading-[1.4] text-inherit",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});
AlertTitle.displayName = "Alert.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(function AlertDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "m-0 font-sans text-14 leading-normal text-inherit min-w-0",
        "opacity-[0.92]",
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
AlertDescription.displayName = "Alert.Description";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(function AlertActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-actions"
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
AlertActions.displayName = "Alert.Actions";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

const AlertClose = forwardRef<HTMLButtonElement, AlertCloseProps>(function AlertClose(
  { label = "Dismiss", className, disabled, onClick, ...rest },
  ref,
) {
  const ctx = useAlertContext();
  const isDisabled = disabled ?? ctx.disabled;
  return (
    <button
      ref={ref}
      type="button"
      data-slot="alert-close"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
      className={cn(
        "appearance-none border-0 m-0 p-0 bg-transparent text-current cursor-pointer",
        "shrink-0 size-[24px] rounded-full inline-flex items-center justify-center",
        "text-[length:14px]/none",
        /* Tug into the padding so the X sits closer to the corner — matches
           Card / Dialog X placement. */
        "-mr-[4px] -mt-[2px]",
        "transition-[background-color] duration-150 ease-standard motion-reduce:duration-0",
        "not-disabled:hover:bg-[color-mix(in_oklab,currentColor_12%,transparent)]",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        "disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      <CloseIcon />
    </button>
  );
});
AlertClose.displayName = "Alert.Close";

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

type AlertCompound = typeof AlertRoot & {
  Icon:        typeof AlertIcon;
  Title:       typeof AlertTitle;
  Description: typeof AlertDescription;
  Actions:     typeof AlertActions;
  Close:       typeof AlertClose;
};

const Alert = AlertRoot as AlertCompound;
Alert.Icon        = AlertIcon;
Alert.Title       = AlertTitle;
Alert.Description = AlertDescription;
Alert.Actions     = AlertActions;
Alert.Close       = AlertClose;

export { Alert, useAlertContext, alertRootVariants };
