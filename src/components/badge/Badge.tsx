import { forwardRef } from "react";
import type { CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { BadgeProps } from "./Badge.types";

/**
 * HC1 Badge — the canonical status-indicator primitive.
 *
 * Migrated from Badge.css to shadcn-style (cva + Tailwind utilities).
 * Prop API and rendered DOM preserved verbatim. The 7 variants × 3
 * appearances = 21 color combinations map to cva compoundVariants using
 * direct Tailwind color utilities that resolve to the same HC1 tokens
 * the previous CSS consumed.
 *
 * Sizing dimensions are set via a --hc-badge-h CSS var so the count
 * pill's `min-width` scales with size without a separate lookup.
 */

/* ══════ CVA — ROOT ═════════════════════════════════════════════════ */

const badgeVariants = cva(
  cn(
    "inline-flex items-center justify-center box-border",
    "border rounded-chip",
    "font-sans font-semibold leading-none tracking-[0.04em]",
    "whitespace-nowrap align-middle select-none",
    "transition-[background-color,border-color,color,opacity] duration-150 ease-standard motion-reduce:duration-0",
  ),
  {
    variants: {
      size: {
        sm: cn(
          "h-[20px] px-8 text-12 gap-4 [--hc-badge-h:20px]",
          "[&_[data-slot=badge-dot]]:size-[6px]",
          "[&_svg]:size-[12px]",
          "[&_[data-slot=badge-remove]]:size-[12px] [&_[data-slot=badge-remove]]:-mr-[4px]",
        ),
        md: cn(
          "h-[24px] px-8 text-12 gap-4 [--hc-badge-h:24px]",
          "[&_[data-slot=badge-dot]]:size-[8px]",
          "[&_svg]:size-[14px]",
          "[&_[data-slot=badge-remove]]:size-[16px] [&_[data-slot=badge-remove]]:-mr-[4px]",
        ),
        lg: cn(
          "h-[28px] px-12 text-14 gap-4 [--hc-badge-h:28px]",
          "[&_[data-slot=badge-dot]]:size-[10px]",
          "[&_svg]:size-[16px]",
          "[&_[data-slot=badge-remove]]:size-[20px] [&_[data-slot=badge-remove]]:-mr-[6px]",
        ),
      },
      /* Variant only picks the dot color (appearance-independent — a dot
         on a soft badge still uses the variant's solid tone). Actual bg /
         text / border colors are set by the appearance × variant compound
         variants below. */
      variant: {
        default: "[&_[data-slot=badge-dot]]:bg-neutral-900",
        primary: "[&_[data-slot=badge-dot]]:bg-brand-500",
        success: "[&_[data-slot=badge-dot]]:bg-green-500",
        warning: "[&_[data-slot=badge-dot]]:bg-accent-700",
        danger:  "[&_[data-slot=badge-dot]]:bg-red-500",
        info:    "[&_[data-slot=badge-dot]]:bg-brand-500",
        neutral: "[&_[data-slot=badge-dot]]:bg-neutral-500",
      },
      appearance: {
        soft:    "",
        solid:   "",
        outline: "",
      },
      count: {
        /* Numeric count → pill shape; min-width keeps single digits round
           by referencing the --hc-badge-h var set in the size variant. */
        true:  "rounded-full min-w-[var(--hc-badge-h)] px-4 [font-variant-numeric:tabular-nums]",
        false: "",
      },
      disabled: {
        true:  "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      /* ═══ SOFT ═════════════════════════════════════════════════════ */
      { appearance: "soft", variant: "default", className: "bg-neutral-100 text-neutral-700 border-neutral-100" },
      { appearance: "soft", variant: "primary", className: "bg-brand-50 text-brand-500 border-brand-50" },
      { appearance: "soft", variant: "success", className: "bg-green-50 text-green-500 border-green-50" },
      { appearance: "soft", variant: "warning", className: "bg-yellow-50 text-accent-700 border-yellow-50" },
      { appearance: "soft", variant: "danger",  className: "bg-red-50 text-red-500 border-red-50" },
      { appearance: "soft", variant: "info",    className: "bg-brand-50 text-brand-500 border-brand-50" },
      { appearance: "soft", variant: "neutral", className: "bg-neutral-100 text-neutral-500 border-neutral-100" },

      /* ═══ SOLID ════════════════════════════════════════════════════ */
      { appearance: "solid", variant: "default", className: "bg-neutral-900 text-white border-neutral-900" },
      { appearance: "solid", variant: "primary", className: "bg-brand-500 text-white border-brand-500" },
      { appearance: "solid", variant: "success", className: "bg-green-500 text-white border-green-500" },
      { appearance: "solid", variant: "warning", className: "bg-accent-700 text-white border-accent-700" },
      { appearance: "solid", variant: "danger",  className: "bg-red-500 text-white border-red-500" },
      { appearance: "solid", variant: "info",    className: "bg-brand-500 text-white border-brand-500" },
      { appearance: "solid", variant: "neutral", className: "bg-neutral-500 text-white border-neutral-500" },

      /* ═══ OUTLINE ══════════════════════════════════════════════════ */
      { appearance: "outline", variant: "default", className: "bg-white text-neutral-700 border-neutral-200" },
      { appearance: "outline", variant: "primary", className: "bg-white text-brand-500 border-brand-500" },
      { appearance: "outline", variant: "success", className: "bg-white text-green-500 border-green-100" },
      { appearance: "outline", variant: "warning", className: "bg-white text-accent-700 border-yellow-100" },
      { appearance: "outline", variant: "danger",  className: "bg-white text-red-500 border-red-100" },
      { appearance: "outline", variant: "info",    className: "bg-white text-brand-500 border-brand-100" },
      { appearance: "outline", variant: "neutral", className: "bg-white text-neutral-500 border-neutral-200" },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "soft",
      size: "md",
      count: false,
      disabled: false,
    },
  },
);

/* ══════ COMPONENT ═════════════════════════════════════════════════ */

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant     = "default",
    appearance  = "soft",
    size        = "md",
    dot         = false,
    leadingIcon,
    trailingIcon,
    count,
    maxCount    = 99,
    onRemove,
    removeLabel = "Remove",
    disabled    = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const hasCount    = typeof count === "number";
  const isRemovable = typeof onRemove === "function";

  /* When `count` is set it takes over the content and forces the pill
     shape. Children are ignored — passing both is not composed. */
  const content = hasCount
    ? count > maxCount
      ? `${maxCount}+`
      : String(count)
    : children;

  return (
    <span
      {...rest}
      ref={ref}
      data-slot="badge-root"
      aria-disabled={disabled || undefined}
      style={style as CSSProperties}
      className={cn(
        badgeVariants({
          variant,
          appearance,
          size,
          count: hasCount,
          disabled,
        } as VariantProps<typeof badgeVariants>),
        className,
      )}
    >
      {dot && !hasCount && (
        <span data-slot="badge-dot" aria-hidden="true" className="inline-block rounded-full shrink-0" />
      )}
      {!dot && leadingIcon && !hasCount && (
        <span
          data-slot="badge-leading"
          aria-hidden="true"
          className="inline-flex items-center justify-center text-current shrink-0 [&_svg]:block"
        >
          {leadingIcon}
        </span>
      )}
      <span
        data-slot="badge-label"
        className="inline-block min-w-0 overflow-hidden text-ellipsis"
      >
        {content}
      </span>
      {isRemovable ? (
        <button
          type="button"
          data-slot="badge-remove"
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel}
          className={cn(
            "appearance-none border-0 m-0 p-0 bg-transparent text-current cursor-pointer",
            "inline-flex items-center justify-center shrink-0 rounded-full",
            "transition-[background-color] duration-150 ease-standard motion-reduce:duration-0",
            /* Hover paint only when NOT disabled — matches Badge.css `:hover:not(:disabled)`. */
            "not-disabled:hover:bg-[color-mix(in_oklab,currentColor_15%,transparent)]",
            "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            "disabled:cursor-not-allowed",
          )}
        >
          <RemoveIcon />
        </button>
      ) : (
        trailingIcon && !hasCount && (
          <span
            data-slot="badge-trailing"
            aria-hidden="true"
            className="inline-flex items-center justify-center text-current shrink-0 [&_svg]:block"
          >
            {trailingIcon}
          </span>
        )
      )}
    </span>
  );
});
Badge.displayName = "Badge";

/**
 * Built-in remove glyph. Uses `currentColor` so it inherits the badge's
 * ink from the active variant × appearance pairing.
 */
function RemoveIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { badgeVariants };
