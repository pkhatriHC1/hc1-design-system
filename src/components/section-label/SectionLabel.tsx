import { forwardRef, createElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { SectionLabelProps } from "./SectionLabel.types";

/**
 * HC1 SectionLabel — the small uppercase tracked strap that heads a
 * group of content (nav section, KPI row, form fieldset, table header).
 *
 * Every product ends up reinventing this with different Tailwind
 * classes. Centralizing kills that drift and gives designers one
 * token to retint every section separator across every IQ product.
 */

const sectionLabelVariants = cva(
  cn(
    "font-semibold uppercase",
    "[font-family:var(--hc-font-sans)]",
  ),
  {
    variants: {
      tone: {
        muted:   "text-[color:var(--hc-color-text-tertiary)]",
        brand:   "text-[color:var(--hc-color-action-primary)]",
        inverse: "text-[color:var(--hc-color-text-inverse)] opacity-70",
      },
      size: {
        sm: "text-[10px] leading-[1.4] tracking-[0.14em]",
        md: "text-[11px] leading-[1.4] tracking-[0.14em]",
        lg: "text-[12px] leading-[1.4] tracking-[0.08em]",
      },
    },
    defaultVariants: {
      tone: "muted",
      size: "md",
    },
  },
);

export const SectionLabel = forwardRef<HTMLElement, SectionLabelProps>(function SectionLabel(
  { as = "div", tone = "muted", size = "md", className, children, ...rest },
  forwardedRef,
) {
  return createElement(
    as,
    {
      ref: forwardedRef,
      "data-slot": "section-label",
      className: cn(sectionLabelVariants({ tone, size }), className),
      ...rest,
    },
    children,
  );
});
SectionLabel.displayName = "SectionLabel";
