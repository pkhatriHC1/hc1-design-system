import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

/**
 * HC1 Button — the shared button primitive for every IQ product.
 *
 * Ported verbatim from SourceIQ's local shadcn Button so any product
 * on `@/components/ui/button` today can swap to `@hc1/design-system`
 * without changing a single prop or class at the call site. Every
 * dimension (height, padding, gap, radius, icon size), every canonical
 * variant (default / outline / secondary / ghost / destructive / link),
 * and every state (hover / active / focus-visible / disabled /
 * aria-invalid) matches shadcn's stock Button. `asChild` is supported
 * via Radix Slot for React Router / Next Link composition.
 *
 * Legacy HC1 v0.11 variants + sizes + props (primary / danger /
 * danger-outline / success / cta / icon variants; md / xl sizes;
 * leftIcon / rightIcon / fullWidth / loading / iconOnly) are accepted
 * as deprecated aliases so existing HC1 consumers keep building.
 *
 * Emits `data-slot="button"`, `data-variant`, `data-size` — consumers
 * can select on these in tests or ambient styles.
 */

/* ── Canonical variants — read from --hc-color-* primitives ─────────
 *
 * NEVER read from shadcn semantic vars (--primary, --secondary, --accent,
 * --destructive, --muted, --border) here. Those vars are consumer-facing
 * and get retinted by product-local :root overrides (see the sourceIQ
 * example where --secondary was hijacked to teal). Reading them would
 * make the SAME `variant="secondary"` render differently in different
 * products — the exact drift the DS exists to prevent.
 *
 * Consumers who want to retint a specific DS variant should override
 * the HC1 alias tokens (--hc-color-*) — or, when we ship button-scoped
 * tokens later, --hc-btn-secondary-bg specifically.
 * ────────────────────────────────────────────────────────────────── */

const CANONICAL_VARIANTS = {
  /* Brand fill — primary action.
     Hex fallbacks inside var() are a defensive floor: if a consumer forgets
     to import the DS token CSS (variables.css), the primary button still
     renders brand-500 teal + white text, i.e. WCAG-AA-compliant contrast
     (~5.25:1). Values mirror --hc-color-brand-500/600/700 + white. */
  default:
    "bg-[color:var(--hc-color-action-primary,#0D7782)] text-[color:var(--hc-color-text-on-solid,#fff)] border-[color:var(--hc-color-action-primary,#0D7782)] hover:bg-[color:var(--hc-color-action-primary-hover,#086068)] hover:border-[color:var(--hc-color-action-primary-hover,#086068)] active:bg-[color:var(--hc-color-action-primary-active,#044A50)]",
  /* White pill with subtle border — secondary action (Cancel / Reset / Back).
     Hover picks up --hc-color-brand-50 (#DAEEF0) — a subtle brand tint so
     every interaction reinforces HC1 identity without competing with the
     primary variant. Consumers can retune via the alias token. */
  outline:
    "border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-surface)] text-[color:var(--hc-color-text-primary)] shadow-xs hover:bg-[color:var(--hc-color-brand-50)] hover:border-[color:var(--hc-color-brand-100)] active:bg-[color:var(--hc-color-brand-100)]",
  /* Muted-neutral surface — supporting action alongside primary.
     Per shadcn convention: NEUTRAL at rest, subtle brand-teal tint on
     hover (--hc-color-brand-50). Never becomes a "second brand color". */
  secondary:
    "bg-[color:var(--hc-color-bg-subtle)] text-[color:var(--hc-color-text-primary)] border-[color:var(--hc-color-border-subtle)] hover:bg-[color:var(--hc-color-brand-50)] hover:border-[color:var(--hc-color-brand-100)] active:bg-[color:var(--hc-color-brand-100)]",
  /* Transparent at rest, brand-tinted hover fill — low-emphasis actions. */
  ghost:
    "bg-transparent text-[color:var(--hc-color-text-primary)] hover:bg-[color:var(--hc-color-brand-50)] active:bg-[color:var(--hc-color-brand-100)]",
  /* Subtle red wash + red text — delete/cancel-only actions. */
  destructive:
    "bg-[color:var(--hc-color-severity-critical-bg)] text-[color:var(--hc-color-severity-critical-text)] border-[color:var(--hc-color-severity-critical-border)] hover:bg-[color:var(--hc-color-severity-critical-bg-subtle)] focus-visible:border-[color:var(--hc-color-status-error-fg)] focus-visible:ring-[color:var(--hc-color-status-error-bg)]",
  /* Underline-on-hover link-styled button. */
  link: "bg-transparent text-[color:var(--hc-color-text-link)] hover:text-[color:var(--hc-color-text-link-hover)] hover:underline underline-offset-4",
} as const;

/* Legacy HC1 v0.11 variants → route to canonical + optional overrides */
const LEGACY_VARIANT_MAP: Record<string, keyof typeof CANONICAL_VARIANTS> = {
  primary: "default",
  danger: "destructive",
  "danger-outline": "outline",
  success: "outline",
  cta: "default",
  icon: "ghost",
};

const SIZE_STYLES = {
  default:
    "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  sm: "h-[var(--hc-space-32)] gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
  lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  icon: "size-9",
  "icon-xs":
    "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
  "icon-sm":
    "size-[var(--hc-space-32)] rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
  "icon-lg": "size-10",
} as const;

/* Legacy HC1 v0.11 sizes → route to canonical */
const LEGACY_SIZE_MAP: Record<string, keyof typeof SIZE_STYLES> = {
  md: "default",
  xl: "lg",
};

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: CANONICAL_VARIANTS,
      size: SIZE_STYLES,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** Resolve any variant name (including legacy) to a canonical one. */
function resolveVariant(v: ButtonVariant): keyof typeof CANONICAL_VARIANTS {
  return (LEGACY_VARIANT_MAP[v] ?? v) as keyof typeof CANONICAL_VARIANTS;
}

/** Resolve any size name (including legacy) to a canonical one. */
function resolveSize(s: ButtonSize): keyof typeof SIZE_STYLES {
  return (LEGACY_SIZE_MAP[s] ?? s) as keyof typeof SIZE_STYLES;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    iconOnly = false,
    type,
    children,
    ...props
  },
  ref,
) {
  const canonicalVariant = resolveVariant(variant);
  const canonicalSize = resolveSize(size);
  /* iconOnly on any size forces the square variant. If already `icon*`,
     leave as-is. */
  const finalSize: keyof typeof SIZE_STYLES = iconOnly
    ? (canonicalSize.startsWith("icon")
        ? canonicalSize
        : canonicalSize === "default"
          ? "icon"
          : (`icon-${canonicalSize}` as keyof typeof SIZE_STYLES))
    : canonicalSize;

  const Comp = asChild ? Slot : "button";
  const typeProp = asChild ? undefined : (type ?? "button");

  const content: ReactNode =
    leftIcon || rightIcon ? (
      <>
        {leftIcon}
        {children}
        {rightIcon}
      </>
    ) : (
      children
    );

  return (
    <Comp
      ref={ref}
      type={typeProp}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant: canonicalVariant, size: finalSize }),
        fullWidth && "w-full",
        loading && "cursor-progress opacity-70",
        className,
      )}
      {...props}
    >
      {content}
    </Comp>
  );
});
Button.displayName = "Button";

export { buttonVariants };
