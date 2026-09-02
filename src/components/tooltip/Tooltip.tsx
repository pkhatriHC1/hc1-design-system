import { forwardRef } from "react";
import type { CSSProperties } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn";
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProps,
  TooltipTriggerProps,
} from "./Tooltip.types";

/**
 * HC1 Tooltip — the canonical contextual hint primitive.
 *
 * Migrated from a hand-built implementation (~450 lines of positioning +
 * delay timers + portal + aria wiring) to a wrapper around
 * @radix-ui/react-tooltip. Radix handles focus/hover/touch/keyboard/
 * portal/positioning semantics correctly; we own only the visual layer.
 *
 * Public API preserved — `Tooltip` / `Tooltip.Trigger` / `Tooltip.Content`
 * / `Tooltip.Arrow` compose identically to before. Each Tooltip root
 * includes its own Provider so consumers don't need a top-level
 * `<TooltipProvider>` wrapping the app.
 *
 * Two intentional micro-differences flagged in the migration report:
 *   - `placement="auto"` maps to `side="top"` + Radix's collision avoidance
 *     (flips to opposite side if requested doesn't fit). Practical result
 *     is very close but not identical to the original "auto" (which also
 *     considered left/right based on available space).
 *   - `delayHide` prop is preserved in the API but ignored internally —
 *     Radix uses its own fixed short exit delay. Only `delayShow` maps
 *     onto Radix's `delayDuration`.
 */

/* ══════ TOKEN CONSTANTS ═══════════════════════════════════════════ */

/* Mirrors --hc-tooltip-offset (8px) and --hc-tooltip-arrow-size (8px)
   declared in variables.css. Radix Content + Arrow don't read CSS vars
   for their positioning inputs — they take numeric props. */
const OFFSET = 8;
const ARROW_WIDTH  = 11;
const ARROW_HEIGHT = 5;

/* ══════ ROOT (Provider + Root together) ═══════════════════════════ */

/**
 * Wraps @radix-ui/react-tooltip's Provider + Root as a single component
 * so consumers don't need a top-level provider in their app.
 *
 * `disabled` short-circuits: renders children as-is without any Radix
 * wrapping, so the trigger doesn't receive aria-describedby or hover
 * handlers when the tooltip is intentionally disabled.
 */
function TooltipRoot({
  open,
  defaultOpen,
  onOpenChange,
  placement = "top",
  delayShow = 200,
  delayHide = 100,
  disabled = false,
  children,
}: TooltipProps) {
  /* delayHide is preserved in the public API for source compatibility
     but Radix Tooltip only exposes a single delayDuration (show). Radix
     uses its own fixed short exit delay; this prop is accepted and
     ignored internally. */
  void delayHide;

  /* When disabled, render children verbatim — no aria wiring, no hover
     handlers, no portaled Content. Matches the original component's
     disabled short-circuit behavior. */
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <RadixTooltip.Provider delayDuration={delayShow} disableHoverableContent>
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayShow}
      >
        <PlacementContext.Provider value={placement}>
          {children}
        </PlacementContext.Provider>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
TooltipRoot.displayName = "Tooltip";

/* ══════ PLACEMENT CONTEXT ═════════════════════════════════════════
   Radix Content takes `side` per-instance, but our public API accepts
   `placement` on the root. Bridge via a small context so Content can
   read the placement chosen at Root. */

import { createContext, useContext } from "react";

const PlacementContext = createContext<TooltipPlacement>("top");

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

/**
 * Preserves the original API — takes a single React element as child and
 * transparently attaches Radix's hover / focus / keyboard / aria handlers
 * via `asChild`. Radix Trigger's `asChild` uses @radix-ui/react-slot to
 * clone the child and forward everything (props + ref + event composition)
 * cleanly, so consumers get the same "wrap your Button in Tooltip.Trigger"
 * ergonomics as before.
 */
function TooltipTrigger({ children }: TooltipTriggerProps) {
  return <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>;
}
TooltipTrigger.displayName = "Tooltip.Trigger";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

/**
 * Portaled dark-surface hint panel. `placement="auto"` maps to `side="top"`
 * plus Radix's collision-avoidance (flips to opposite when requested side
 * doesn't fit). The exact resolved side lands on `data-side` (Radix sets
 * this automatically) so consumers can style per-side if they want.
 */
const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    arrow = true,
    maxWidth,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  const placement = useContext(PlacementContext);

  /* Radix has no "auto" — map to "top" + rely on avoidCollisions to flip. */
  const side: "top" | "bottom" | "left" | "right" =
    placement === "auto" ? "top" : placement;

  const combinedStyle: CSSProperties = {
    ...style,
    /* max-width honors either an explicit prop or the token default. */
    maxWidth: maxWidth ?? "var(--hc-tooltip-max-width)",
  };

  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        ref={forwardedRef}
        side={side}
        sideOffset={OFFSET}
        collisionPadding={8}
        avoidCollisions
        style={combinedStyle}
        className={cn(
          /* Panel — dark inverted surface matching tooltip tokens. */
          "z-tooltip",
          "px-[var(--hc-tooltip-pad-x)] py-[var(--hc-tooltip-pad-y)]",
          "rounded-[var(--hc-tooltip-radius)] border",
          "bg-[color:var(--hc-tooltip-bg)] text-[color:var(--hc-tooltip-fg)] border-[color:var(--hc-tooltip-border)]",
          "shadow-md",
          "font-sans text-12 font-normal leading-[1.4] text-left",
          "[overflow-wrap:break-word]",
          /* Non-interactive — pointer events on the panel would interrupt
             the trigger's hover flow when the pointer glides across.
             Content that legitimately needs interaction should use Popover. */
          "pointer-events-none",
          "outline-none",
          /* Entrance transition: fade + scale from 0.96 → 1 in 150 ms.
             Base state is opacity-0 / scale-95; Radix flips data-state to
             open on mount, and the transition drives values to full.
             Exit is instant (Radix unmounts the element) — same as the
             original hc-tooltip-in behavior (no exit keyframe). */
          "opacity-0 scale-95",
          "data-[state=open]:opacity-100 data-[state=open]:scale-100",
          "transition-[opacity,transform] duration-150 ease-standard motion-reduce:duration-0",
          "origin-center",
          className,
        )}
        {...rest}
      >
        {children}
        {arrow && (
          <RadixTooltip.Arrow
            width={ARROW_WIDTH}
            height={ARROW_HEIGHT}
            className="fill-[var(--hc-tooltip-bg)]"
          />
        )}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );
});
TooltipContent.displayName = "Tooltip.Content";

/* ══════ ARROW (standalone subcomponent) ═══════════════════════════ */

/**
 * Standalone arrow — used when a consumer composes a fully custom
 * Content shell but still wants the design-system arrow. Rare escape
 * hatch; the common path renders the arrow inside Content automatically
 * via the `arrow` prop.
 */
const TooltipArrow = forwardRef<SVGSVGElement, TooltipArrowProps>(function TooltipArrow(
  { className, ...rest },
  ref,
) {
  return (
    <RadixTooltip.Arrow
      ref={ref}
      width={ARROW_WIDTH}
      height={ARROW_HEIGHT}
      className={cn("fill-[var(--hc-tooltip-bg)]", className)}
      {...(rest as React.SVGProps<SVGSVGElement>)}
    />
  );
});
TooltipArrow.displayName = "Tooltip.Arrow";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type TooltipCompound = typeof TooltipRoot & {
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Arrow:   typeof TooltipArrow;
};

const Tooltip = TooltipRoot as TooltipCompound;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow   = TooltipArrow;

export { Tooltip };
