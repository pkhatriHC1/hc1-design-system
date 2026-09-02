import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import type { CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  CardActionsProps,
  CardContentProps,
  CardDensity,
  CardDescriptionProps,
  CardDividerProps,
  CardEmptyProps,
  CardFooterProps,
  CardHeaderProps,
  CardIconProps,
  CardLoadingProps,
  CardProps,
  CardTitleProps,
  CardVariant,
} from "./Card.types";

/**
 * HC1 Card — the canonical surface primitive.
 *
 * Migrated from Button.css conventions to shadcn-style (cva + Tailwind
 * utilities). The compound-component API is preserved verbatim; every
 * visual output matches the prior Card.css version, keyed by the same
 * --hc-* aliases.
 *
 * Density propagates from root → subcomponents via CSS custom properties
 * set on the root by the `density` cva variant:
 *   --hc-card-pad          — padding on Header / Content / Footer / Empty / Loading
 *   --hc-card-title-size   — Card.Title font-size
 *   --hc-card-icon-size    — Card.Icon svg size
 *   --hc-card-actions-gap  — Card.Actions gap
 *
 * Each subcomponent reads these via arbitrary values (`p-[var(--hc-card-pad)]`
 * etc.), preserving the original "change density on the root, everything
 * scales" contract without prop-drilling.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type CardContextValue = {
  density: CardDensity;
  variant: CardVariant;
  disabled: boolean;
  loading: boolean;
};

const CardContext = createContext<CardContextValue>({
  density: "comfortable",
  variant: "default",
  disabled: false,
  loading: false,
});

const useCardContext = () => useContext(CardContext);

/* ══════ ROOT CVA ══════════════════════════════════════════════════ */

const cardVariants = cva(
  cn(
    "relative flex flex-col min-w-0 overflow-hidden",
    "rounded-surface border font-sans text-left text-neutral-900",
    "transition-[background-color,border-color,box-shadow] duration-150 ease-standard",
    "motion-reduce:duration-0",
  ),
  {
    variants: {
      variant: {
        default:     "bg-white border-neutral-200 shadow-none",
        outlined:    "bg-white border-neutral-300 shadow-none",
        elevated:    "bg-white border-neutral-100 shadow-xs",
        interactive: "bg-white border-neutral-200 shadow-none",
        selected:    "bg-white border-brand-500 shadow-none",
      },
      density: {
        compact: cn(
          "[--hc-card-pad:var(--hc-space-12)]",
          "[--hc-card-title-size:16px]",
          "[--hc-card-icon-size:20px]",
          "[--hc-card-actions-gap:var(--hc-space-4)]",
        ),
        comfortable: cn(
          "[--hc-card-pad:var(--hc-space-16)]",
          "[--hc-card-title-size:18px]",
          "[--hc-card-icon-size:24px]",
          "[--hc-card-actions-gap:var(--hc-space-8)]",
        ),
        relaxed: cn(
          "[--hc-card-pad:var(--hc-space-24)]",
          "[--hc-card-title-size:20px]",
          "[--hc-card-icon-size:28px]",
          "[--hc-card-actions-gap:var(--hc-space-12)]",
        ),
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      clickable: {
        true: cn(
          "cursor-pointer select-none appearance-none",
          "[-webkit-tap-highlight-color:transparent]",
          "outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        ),
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "",
      },
    },
    compoundVariants: [
      /* interactive + clickable + not-disabled → hover elevates, active dims */
      {
        variant: "interactive",
        clickable: true,
        disabled: false,
        className: cn(
          "hover:bg-neutral-100 hover:shadow-xs",
          "active:bg-neutral-200",
        ),
      },
      /* selected + clickable + not-disabled → hover tints but keeps brand border */
      {
        variant: "selected",
        clickable: true,
        disabled: false,
        className: "hover:bg-neutral-100",
      },
    ],
    defaultVariants: {
      variant: "default",
      density: "comfortable",
      fullWidth: true,
      clickable: false,
      disabled: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const CardRoot = forwardRef<HTMLElement, CardProps>(function CardRoot(
  {
    variant   = "default",
    density   = "comfortable",
    fullWidth = true,
    disabled  = false,
    loading   = false,
    onClick,
    pressed,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const isClickable = variant === "interactive" || typeof onClick === "function";

  const contextValue = useMemo<CardContextValue>(
    () => ({ density, variant, disabled, loading }),
    [density, variant, disabled, loading],
  );

  const rootClass = cn(
    cardVariants({
      variant,
      density,
      fullWidth,
      clickable: isClickable,
      disabled,
    } as VariantProps<typeof cardVariants>),
    /* Whole-card loading — hide every direct child except the overlay. */
    loading && "[&>*:not([data-slot=card-loading-overlay])]:invisible",
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const loadingOverlay = loading ? (
    <div
      data-slot="card-loading-overlay"
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center z-[1]",
        "bg-[color:var(--hc-color-bg-elevated)]/85",
      )}
    >
      <span className={cn(SPINNER_CLASSES, "border-neutral-200 border-t-brand-500")} />
    </div>
  ) : null;

  if (isClickable) {
    return (
      <CardContext.Provider value={contextValue}>
        <button
          {...rest}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          aria-busy={loading || undefined}
          aria-pressed={pressed}
          aria-disabled={disabled || undefined}
          onClick={handleClick}
          data-slot="card"
          className={rootClass}
          style={style as CSSProperties}
        >
          {children}
          {loadingOverlay}
        </button>
      </CardContext.Provider>
    );
  }

  return (
    <CardContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref as React.Ref<HTMLDivElement>}
        aria-busy={loading || undefined}
        data-slot="card"
        className={rootClass}
        style={style as CSSProperties}
      >
        {children}
        {loadingOverlay}
      </div>
    </CardContext.Provider>
  );
});

CardRoot.displayName = "Card";

/* ══════ SPINNER (shared by root loading overlay + Card.Loading) ═══ */

const SPINNER_CLASSES = cn(
  "size-[24px] rounded-full border-[2.5px] border-t-transparent",
  "animate-spin motion-reduce:[animation-duration:2500ms]",
);

/* ══════ HEADER ════════════════════════════════════════════════════ */

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "flex items-start gap-12 p-[var(--hc-card-pad)]",
        className,
      )}
      {...rest}
    >
      <HeaderBody>{children}</HeaderBody>
    </div>
  );
});
CardHeader.displayName = "Card.Header";

function HeaderBody({ children }: { children: React.ReactNode }) {
  /* Walk the header's children, split into left (icon + text stack) and
     right (actions). Card.Icon renders first (left), Card.Actions last
     (right), everything else stacks in the middle body div. */
  const arr = flattenChildren(children);
  const iconChildren: React.ReactNode[] = [];
  const actionChildren: React.ReactNode[] = [];
  const bodyChildren: React.ReactNode[] = [];

  for (const child of arr) {
    if (isSubcomponent(child, CardIcon))         iconChildren.push(child);
    else if (isSubcomponent(child, CardActions)) actionChildren.push(child);
    else bodyChildren.push(child);
  }

  return (
    <>
      {iconChildren}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {bodyChildren}
      </div>
      {actionChildren}
    </>
  );
}

function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const push = (c: React.ReactNode) => {
    if (Array.isArray(c)) c.forEach(push);
    else if (c != null && c !== false) out.push(c);
  };
  push(children);
  return out;
}

function isSubcomponent(node: React.ReactNode, Comp: unknown): boolean {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in (node as object) &&
    (node as { type: unknown }).type === Comp
  );
}

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as = 3, className, children, ...rest },
  ref,
) {
  const Tag = `h${as}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      data-slot="card-title"
      className={cn(
        "m-0 text-neutral-900 font-semibold leading-[1.3]",
        "text-[length:var(--hc-card-title-size)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});
CardTitle.displayName = "Card.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(
        "m-0 text-neutral-500 text-14 leading-normal",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = "Card.Description";

/* ══════ ICON ══════════════════════════════════════════════════════ */

const CardIcon = forwardRef<HTMLSpanElement, CardIconProps>(function CardIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="card-icon"
      aria-hidden="true"
      className={cn(
        "shrink-0 inline-flex items-center justify-center text-brand-500 mt-[2px]",
        "[&_svg]:block [&_svg]:size-[var(--hc-card-icon-size)]",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
CardIcon.displayName = "Card.Icon";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn(
        "p-[var(--hc-card-pad)] text-neutral-700 text-16 leading-normal min-w-0",
        /* When Content follows Header directly, collapse its top padding
           so the two sections share one rhythmic gap. */
        "[[data-slot=card-header]+&]:pt-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
CardContent.displayName = "Card.Content";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-12 p-[var(--hc-card-pad)]",
        "text-neutral-500 text-14 leading-[1.4]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = "Card.Footer";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const actionsVariants = cva(
  cn(
    "flex flex-wrap items-center min-w-0",
    "gap-[var(--hc-card-actions-gap)]",
  ),
  {
    variants: {
      align: {
        start:  "justify-start",
        center: "justify-center",
        end:    "justify-end ml-auto",
      },
    },
    defaultVariants: {
      align: "end",
    },
  },
);

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(
  { align = "end", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-actions"
      className={cn(actionsVariants({ align }), className)}
      {...rest}
    >
      {children}
    </div>
  );
});
CardActions.displayName = "Card.Actions";

/* ══════ DIVIDER ═══════════════════════════════════════════════════ */

const CardDivider = forwardRef<HTMLHRElement, CardDividerProps>(function CardDivider(
  { className, ...rest },
  ref,
) {
  return (
    <hr
      ref={ref}
      data-slot="card-divider"
      className={cn(
        "border-0 h-[1px] w-full m-0 bg-neutral-100",
        className,
      )}
      {...rest}
    />
  );
});
CardDivider.displayName = "Card.Divider";

/* ══════ EMPTY ═════════════════════════════════════════════════════ */

const CardEmpty = forwardRef<HTMLDivElement, CardEmptyProps>(function CardEmpty(
  { icon, title, description, action, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      data-slot="card-empty"
      className={cn(
        "flex flex-col items-center justify-center text-center gap-8",
        "py-32 px-[var(--hc-card-pad)] min-h-[160px] text-neutral-500",
        className,
      )}
      {...rest}
    >
      {icon && (
        <span
          data-slot="card-empty-icon"
          className={cn(
            "inline-flex items-center justify-center",
            "size-[40px] rounded-full bg-neutral-100 text-neutral-500 mb-4",
            "[&_svg]:block [&_svg]:size-[20px]",
          )}
        >
          {icon}
        </span>
      )}
      {title && (
        <div
          data-slot="card-empty-title"
          className="m-0 text-neutral-900 text-16 font-semibold leading-[1.4]"
        >
          {title}
        </div>
      )}
      {description && (
        <div
          data-slot="card-empty-description"
          className="m-0 text-neutral-500 text-14 leading-normal max-w-[48ch]"
        >
          {description}
        </div>
      )}
      {children}
      {action && (
        <div
          data-slot="card-empty-action"
          className="mt-8 flex gap-8 justify-center flex-wrap"
        >
          {action}
        </div>
      )}
    </div>
  );
});
CardEmpty.displayName = "Card.Empty";

/* ══════ LOADING ═══════════════════════════════════════════════════ */

const CardLoading = forwardRef<HTMLDivElement, CardLoadingProps>(function CardLoading(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      data-slot="card-loading"
      className={cn(
        "flex flex-col items-center justify-center gap-8",
        "py-32 px-[var(--hc-card-pad)] min-h-[160px] text-neutral-500",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(SPINNER_CLASSES, "border-neutral-200 border-t-brand-500")}
      />
      {label && (
        <span className="text-14 text-neutral-500 leading-[1.4]">{label}</span>
      )}
      {children}
    </div>
  );
});
CardLoading.displayName = "Card.Loading";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type CardCompound = typeof CardRoot & {
  Header:      typeof CardHeader;
  Title:       typeof CardTitle;
  Description: typeof CardDescription;
  Icon:        typeof CardIcon;
  Content:     typeof CardContent;
  Footer:      typeof CardFooter;
  Actions:     typeof CardActions;
  Divider:     typeof CardDivider;
  Empty:       typeof CardEmpty;
  Loading:     typeof CardLoading;
};

const Card = CardRoot as CardCompound;
Card.Header      = CardHeader;
Card.Title       = CardTitle;
Card.Description = CardDescription;
Card.Icon        = CardIcon;
Card.Content     = CardContent;
Card.Footer      = CardFooter;
Card.Actions     = CardActions;
Card.Divider     = CardDivider;
Card.Empty       = CardEmpty;
Card.Loading     = CardLoading;

export { Card, useCardContext, cardVariants };
