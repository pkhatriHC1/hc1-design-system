import { forwardRef } from "react";
import type { CSSProperties } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "../../utils/cn";
import type {
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPlacement,
  PopoverProps,
  PopoverTriggerProps,
} from "./Popover.types";

/**
 * HC1 Popover — the canonical floating surface primitive.
 *
 * Migrated from a hand-built implementation (~650 lines of positioning +
 * focus management + scroll lock + portal + Escape / outside-click / focus-
 * trap handlers) to a wrapper around @radix-ui/react-popover. Radix owns:
 *   - Positioning (via floating-ui) + collision avoidance
 *   - Focus into panel on open + restore to trigger on close
 *   - Escape / outside-click / (modal) focus-trap + body scroll lock
 *   - Portal to body
 *   - aria-haspopup / aria-expanded / aria-controls wiring
 * We own the visual layer only (panel chrome, arrow fill, animations).
 *
 * Public API preserved — `Popover` / `Popover.Trigger` / `Popover.Content`
 * / `Popover.Arrow` / `Popover.Close` compose identically to before.
 *
 * Two intentional micro-differences:
 *   - `placement="auto"` maps to `side="bottom"` + Radix collision avoidance
 *     (flips to opposite when requested doesn't fit). Practical result is
 *     very close but not identical to the original "auto" (which also
 *     considered left/right based on available space).
 *   - `modal={true}` uses Radix's modal (focus trap + body scroll lock via
 *     ReactRemoveScroll) plus a scrim we paint ourselves inside the Portal.
 *     Behavior identical to the original.
 */

/* ══════ TOKEN CONSTANTS ═══════════════════════════════════════════ */

/* Mirrors --hc-popover-offset (8px) and --hc-popover-arrow-size (8px)
   declared in variables.css. Radix Content + Arrow take numeric props. */
const OFFSET = 8;
const ARROW_WIDTH  = 11;
const ARROW_HEIGHT = 5;

/* ══════ PLACEMENT CONTEXT ═════════════════════════════════════════
   Radix Content takes `side` per-instance; our API accepts `placement`
   on the root. Bridge via a small context so Content can read the
   placement + modal flag from the Root without prop-drilling. */

import { createContext, useContext } from "react";

type PopoverConfigValue = {
  placement: PopoverPlacement;
  modal: boolean;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
};

const PopoverConfigContext = createContext<PopoverConfigValue>({
  placement: "bottom",
  modal: false,
  closeOnOutsideClick: true,
  closeOnEscape: true,
});

/* ══════ ROOT ══════════════════════════════════════════════════════ */

function PopoverRoot({
  open,
  defaultOpen,
  onOpenChange,
  placement = "bottom",
  modal = false,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  children,
}: PopoverProps) {
  const config: PopoverConfigValue = {
    placement,
    modal,
    closeOnOutsideClick,
    closeOnEscape,
  };
  return (
    <RadixPopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <PopoverConfigContext.Provider value={config}>
        {children}
      </PopoverConfigContext.Provider>
    </RadixPopover.Root>
  );
}
PopoverRoot.displayName = "Popover";

/* ══════ TRIGGER ═══════════════════════════════════════════════════
   Radix Trigger with asChild + Slot handles cloning + composed refs +
   aria-haspopup/expanded/controls automatically. Preserves the original
   "wrap your Button in Popover.Trigger" ergonomics. */

function PopoverTrigger({ children }: PopoverTriggerProps) {
  return <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>;
}
PopoverTrigger.displayName = "Popover.Trigger";

/* ══════ CLOSE ═════════════════════════════════════════════════════
   Radix Close with asChild handles the "clone child, close on click"
   pattern. Consumer's existing onClick still fires first. */

function PopoverClose({ children }: PopoverCloseProps) {
  return <RadixPopover.Close asChild>{children}</RadixPopover.Close>;
}
PopoverClose.displayName = "Popover.Close";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    arrow = true,
    minWidth,
    maxWidth,
    ariaLabel,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  const config = useContext(PopoverConfigContext);
  const { placement, modal, closeOnOutsideClick, closeOnEscape } = config;

  /* Radix has no "auto" — map to "bottom" (matches original "auto"
     preference: bottom → top → right → left) + collision avoidance. */
  const side: "top" | "bottom" | "left" | "right" =
    placement === "auto" ? "bottom" : placement;

  const combinedStyle: CSSProperties = {
    ...style,
    minWidth: minWidth ?? "var(--hc-popover-min-width)",
    maxWidth: maxWidth ?? "var(--hc-popover-max-width)",
  };

  return (
    <RadixPopover.Portal>
      {/* Modal scrim — painted inside the Portal, behind Content in the
          stacking order. Radix's own modal={true} already prevents
          outside interaction + traps focus; the scrim is purely visual. */}
      {modal && (
        <div
          aria-hidden="true"
          data-slot="popover-scrim"
          className={cn(
            "fixed inset-0 z-modal-scrim",
            "bg-[color:var(--hc-popover-scrim)]",
            /* Fade in — matches original hc-popover-scrim-in keyframe. */
            "opacity-0 data-[state=open]:opacity-100",
            "transition-opacity duration-150 ease-standard motion-reduce:duration-0",
          )}
        />
      )}
      <RadixPopover.Content
        ref={forwardedRef}
        side={side}
        sideOffset={OFFSET}
        collisionPadding={8}
        avoidCollisions
        aria-label={ariaLabel}
        style={combinedStyle}
        onInteractOutside={
          closeOnOutsideClick ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={
          closeOnEscape ? undefined : (e) => e.preventDefault()
        }
        className={cn(
          /* Panel — floating card, elevated white surface. */
          modal ? "z-modal" : "z-popover",
          "px-[var(--hc-popover-pad-x)] py-[var(--hc-popover-pad-y)]",
          "rounded-[var(--hc-popover-radius)] border",
          "bg-[color:var(--hc-popover-bg)] text-[color:var(--hc-popover-fg)] border-[color:var(--hc-popover-border)]",
          "shadow-lg",
          "font-sans text-14 font-normal leading-normal text-left",
          "[overflow-wrap:break-word]",
          "outline-none",
          /* Entrance transition: opacity 0→1 + scale 0.98→1 in 150ms.
             Matches the original hc-popover-in keyframe. */
          "opacity-0 scale-[0.98]",
          "data-[state=open]:opacity-100 data-[state=open]:scale-100",
          "transition-[opacity,transform] duration-150 ease-standard motion-reduce:duration-0",
          "origin-center",
          className,
        )}
        {...rest}
      >
        {children}
        {arrow && (
          <RadixPopover.Arrow
            width={ARROW_WIDTH}
            height={ARROW_HEIGHT}
            className="fill-[var(--hc-popover-bg)]"
          />
        )}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
});
PopoverContent.displayName = "Popover.Content";

/* ══════ ARROW (standalone subcomponent) ═══════════════════════════
   Rare escape hatch — used when a consumer composes a fully custom
   Content shell but still wants the design-system arrow. */

const PopoverArrow = forwardRef<SVGSVGElement, PopoverArrowProps>(function PopoverArrow(
  { className, ...rest },
  ref,
) {
  return (
    <RadixPopover.Arrow
      ref={ref}
      width={ARROW_WIDTH}
      height={ARROW_HEIGHT}
      className={cn("fill-[var(--hc-popover-bg)]", className)}
      {...(rest as React.SVGProps<SVGSVGElement>)}
    />
  );
});
PopoverArrow.displayName = "Popover.Arrow";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type PopoverCompound = typeof PopoverRoot & {
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Arrow:   typeof PopoverArrow;
  Close:   typeof PopoverClose;
};

const Popover = PopoverRoot as PopoverCompound;
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Arrow   = PopoverArrow;
Popover.Close   = PopoverClose;

export { Popover };
