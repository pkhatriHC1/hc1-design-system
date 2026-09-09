import { forwardRef } from "react";
import * as RadixSeparator from "@radix-ui/react-separator";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { SeparatorProps } from "./Separator.types";

/**
 * HC1 Separator — thin divider between content sections.
 *
 * Wraps @radix-ui/react-separator, which sets role="separator" +
 * aria-orientation when `decorative={false}`.
 */

const separatorVariants = cva(
  cn(
    "shrink-0",
    "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
    "data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
  ),
  {
    variants: {
      tone: {
        subtle:  "bg-[color:var(--hc-color-border-subtle)]",
        default: "bg-[color:var(--hc-color-border-default)]",
        strong:  "bg-[color:var(--hc-color-border-strong)]",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = "horizontal", decorative = true, tone = "default", ...rest },
  forwardedRef,
) {
  return (
    <RadixSeparator.Root
      ref={forwardedRef}
      data-slot="separator"
      orientation={orientation}
      decorative={decorative}
      className={cn(separatorVariants({ tone }), className)}
      {...rest}
    />
  );
});
Separator.displayName = "Separator";
