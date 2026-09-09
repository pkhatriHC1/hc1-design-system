import { forwardRef } from "react";
import * as RadixProgress from "@radix-ui/react-progress";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { ProgressProps } from "./Progress.types";

/**
 * HC1 Progress — determinate or indeterminate progress bar.
 *
 * Wraps @radix-ui/react-progress. Radix owns the accessibility wiring
 * (role="progressbar", aria-valuenow / aria-valuemin / aria-valuemax).
 * We own the visual layer — track color, fill color per tone, size
 * ladder, and the indeterminate shimmer.
 */

const trackVariants = cva(
  cn(
    "relative w-full overflow-hidden rounded-full",
    "bg-[color:var(--hc-color-bg-muted)]",
  ),
  {
    variants: {
      size: {
        sm: "h-[4px]",
        md: "h-[6px]",
        lg: "h-[8px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const fillVariants = cva(
  cn(
    "h-full w-full flex-1",
    "transition-transform duration-250 ease-standard motion-reduce:duration-0",
  ),
  {
    variants: {
      tone: {
        default: "bg-[color:var(--hc-color-action-primary)]",
        success: "bg-[color:var(--hc-color-status-success-fg)]",
        warning: "bg-[color:var(--hc-color-status-warning-fg)]",
        danger:  "bg-[color:var(--hc-color-status-error-fg)]",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { className, value, tone = "default", size = "md", ...rest },
  forwardedRef,
) {
  const isIndeterminate = value == null;
  const clamped = isIndeterminate ? 0 : Math.max(0, Math.min(100, value));

  return (
    <RadixProgress.Root
      ref={forwardedRef}
      data-slot="progress"
      value={isIndeterminate ? null : clamped}
      className={cn(trackVariants({ size }), className)}
      {...rest}
    >
      <RadixProgress.Indicator
        data-slot="progress-indicator"
        className={fillVariants({ tone })}
        style={{
          transform: isIndeterminate
            ? undefined
            : `translateX(-${100 - clamped}%)`,
        }}
      />
    </RadixProgress.Root>
  );
});
Progress.displayName = "Progress";
