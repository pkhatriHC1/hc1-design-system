import { forwardRef } from "react";
import type { CSSProperties } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  DrawerActionsProps,
  DrawerBodyProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerProps,
  DrawerTitleProps,
  DrawerTriggerProps,
} from "./Drawer.types";

/**
 * HC1 Drawer — the canonical side-panel primitive.
 *
 * Migrated from a hand-built implementation (~450 lines of focus trap +
 * body scroll lock + Escape handler + Portal + Overlay) to a wrapper
 * around @radix-ui/react-dialog with side-anchored positioning. This is
 * the "shadcn Sheet" pattern — same Radix Dialog primitives Dialog uses,
 * but the Content sits at the left or right edge of the viewport instead
 * of centered.
 *
 * Radix owns focus trap, body scroll lock (via ReactRemoveScroll),
 * Escape + outside-click close, Portal, Overlay, and aria wiring
 * (labelledby/describedby auto-hooked by Title + Description). We own
 * the visual layer + the compound sub-component surface.
 *
 * Public API preserved — Drawer, Drawer.Trigger, Drawer.Content,
 * Drawer.Header, Drawer.Title, Drawer.Description, Drawer.Body,
 * Drawer.Footer, Drawer.Actions, Drawer.Close compose identically.
 * Header + Footer keep their `sticky` prop.
 *
 * `overlay={false}` preserved semantics: scrim is transparent and lets
 * pointer events pass through, but the panel still traps focus + locks
 * body scroll. `closeOnOverlayClick` is effectively ignored in that mode
 * (nothing to click), which matches the original behavior.
 */

/* ══════ CVA — OVERLAY (scrim) ═════════════════════════════════════ */

const drawerOverlayVariants = cva(
  cn(
    "fixed inset-0 z-modal-scrim",
    "transition-opacity duration-250 ease-entrance motion-reduce:duration-0",
  ),
  {
    variants: {
      overlay: {
        true: cn(
          "bg-[color:var(--hc-dialog-scrim)]",
          "opacity-0 data-[state=open]:opacity-100",
        ),
        false: cn(
          /* Transparent scrim: lets pointer events pass through to the
             page below so the drawer feels non-blocking. Radix still
             traps focus + locks scroll — those come from the modal
             flag on Root. */
          "bg-transparent pointer-events-none",
        ),
      },
    },
    defaultVariants: {
      overlay: true,
    },
  },
);

/* ══════ CVA — CONTENT (panel) ═════════════════════════════════════ */

const drawerContentVariants = cva(
  cn(
    "fixed top-0 z-modal",
    "flex flex-col",
    "w-full h-[100vh] h-[100dvh]",
    "bg-white text-neutral-900 border border-neutral-100 shadow-xl",
    "font-sans text-left overflow-hidden outline-none",
    /* Slide-in transition. Base state (mount) sits off-screen; open
       state slides to 0. Exit is instant when Radix unmounts. */
    "transition-transform duration-250 ease-entrance motion-reduce:duration-0",
  ),
  {
    variants: {
      placement: {
        left: cn(
          "left-0 border-l-0",
          "rounded-l-none rounded-r-surface",
          "-translate-x-full data-[state=open]:translate-x-0",
        ),
        right: cn(
          "right-0 border-r-0",
          "rounded-r-none rounded-l-surface",
          "translate-x-full data-[state=open]:translate-x-0",
        ),
      },
      size: {
        sm:         "max-w-[var(--hc-drawer-size-sm)]",
        md:         "max-w-[var(--hc-drawer-size-md)]",
        lg:         "max-w-[var(--hc-drawer-size-lg)]",
        /* Fullscreen: edge-to-edge, no radius, no shadow. Overrides the
           placement-specific rounding. */
        fullscreen: "max-w-none rounded-none shadow-none border-x-transparent",
      },
      loading: {
        true:  "[&_[data-slot=drawer-body]]:invisible",
        false: "",
      },
    },
    defaultVariants: {
      placement: "right",
      size: "md",
      loading: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

function DrawerRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: DrawerProps) {
  return (
    <RadixDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </RadixDialog.Root>
  );
}
DrawerRoot.displayName = "Drawer";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

function DrawerTrigger({ children }: DrawerTriggerProps) {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
}
DrawerTrigger.displayName = "Drawer.Trigger";

/* ══════ CLOSE (asChild wrapper) ═══════════════════════════════════ */

function DrawerClose({ children }: DrawerCloseProps) {
  return <RadixDialog.Close asChild>{children}</RadixDialog.Close>;
}
DrawerClose.displayName = "Drawer.Close";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  {
    placement = "right",
    size = "md",
    overlay = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    closeLabel = "Close",
    loading = false,
    loadingLabel,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  /* When overlay=false, clicks pass through to the page — outside-click
     dismissal is a no-op semantically. When overlay=true but
     closeOnOverlayClick=false, we suppress it explicitly. */
  const suppressOutsideClose = !overlay || !closeOnOverlayClick;

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        className={drawerOverlayVariants({
          overlay,
        } as VariantProps<typeof drawerOverlayVariants>)}
      />
      <RadixDialog.Content
        ref={forwardedRef}
        aria-busy={loading || undefined}
        data-slot="drawer-content"
        data-placement={placement}
        data-size={size}
        onPointerDownOutside={
          suppressOutsideClose ? (e) => e.preventDefault() : undefined
        }
        onEscapeKeyDown={
          closeOnEscape ? undefined : (e) => e.preventDefault()
        }
        style={style as CSSProperties}
        className={cn(
          drawerContentVariants({
            placement,
            size,
            loading,
          } as VariantProps<typeof drawerContentVariants>),
          className,
        )}
        {...rest}
      >
        {children}

        {showCloseButton && (
          <RadixDialog.Close
            aria-label={closeLabel}
            className={cn(
              "absolute top-12 right-12 z-[2]",
              "inline-flex items-center justify-center size-[28px] p-0",
              "border border-transparent rounded-control bg-transparent text-neutral-500",
              "cursor-pointer appearance-none",
              "[-webkit-tap-highlight-color:transparent]",
              "transition-[background-color,color] duration-150 ease-standard motion-reduce:duration-0",
              "hover:bg-neutral-100 hover:text-neutral-900",
              "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <XIcon />
          </RadixDialog.Close>
        )}

        {loading && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-8 z-[1]",
              "bg-[color:var(--hc-color-bg-elevated)]/85",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "block rounded-full size-[24px] border-[2.5px] border-neutral-200 border-t-brand-500",
                "animate-spin motion-reduce:[animation-duration:2500ms]",
              )}
            />
            {loadingLabel && (
              <span className="text-14 text-neutral-500 leading-[1.4]">
                {loadingLabel}
              </span>
            )}
          </div>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});
DrawerContent.displayName = "Drawer.Content";

/* ══════ HEADER ════════════════════════════════════════════════════ */

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader(
  { sticky = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-header"
      className={cn(
        "relative flex-none flex items-start gap-12 z-[1]",
        /* padding: stack-lg × [inline-xl + 32px reserved for X] × stack-lg × inline-xl */
        "pt-16 pr-[calc(24px+32px)] pb-16 pl-24",
        "bg-white",
        sticky && cn(
          "sticky top-0",
          "border-b border-neutral-100",
          "shadow-[var(--hc-drawer-sticky-shadow)]",
        ),
        className,
      )}
      {...rest}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-4">{children}</div>
    </div>
  );
});
DrawerHeader.displayName = "Drawer.Header";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(function DrawerTitle(
  { as = 2, className, children, id, ...rest },
  ref,
) {
  const Tag = `h${as}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <RadixDialog.Title asChild>
      <Tag
        ref={ref as React.Ref<HTMLHeadingElement>}
        id={id}
        data-slot="drawer-title"
        className={cn(
          "m-0 text-neutral-900 text-20 font-semibold leading-[1.3]",
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    </RadixDialog.Title>
  );
});
DrawerTitle.displayName = "Drawer.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(function DrawerDescription(
  { className, children, id, ...rest },
  ref,
) {
  return (
    <RadixDialog.Description asChild>
      <p
        ref={ref}
        id={id}
        data-slot="drawer-description"
        className={cn(
          "m-0 text-neutral-500 text-14 leading-normal",
          className,
        )}
        {...rest}
      >
        {children}
      </p>
    </RadixDialog.Description>
  );
});
DrawerDescription.displayName = "Drawer.Description";

/* ══════ BODY ══════════════════════════════════════════════════════ */

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function DrawerBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-body"
      className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        "py-12 px-24",
        "text-neutral-700 text-16 leading-normal",
        /* Collapse top padding when Body follows Header directly, whether
           the header is sticky or not. */
        "[[data-slot=drawer-header]+&]:pt-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
DrawerBody.displayName = "Drawer.Body";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  { sticky = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-footer"
      className={cn(
        "flex-none flex items-center gap-12",
        "py-16 px-24",
        "bg-white border-t border-neutral-100",
        "text-neutral-500 text-14 leading-[1.4]",
        sticky && cn(
          "sticky bottom-0 z-[1]",
          /* Upward detachment shadow so scrolled content reads as passing
             under the sticky footer. */
          "shadow-[0_-1px_2px_rgba(15,20,25,0.08)]",
        ),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
DrawerFooter.displayName = "Drawer.Footer";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const drawerActionsVariants = cva(
  cn(
    "flex flex-wrap items-center gap-8 min-w-0",
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

const DrawerActions = forwardRef<HTMLDivElement, DrawerActionsProps>(function DrawerActions(
  { align = "end", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-actions"
      className={cn(drawerActionsVariants({ align }), className)}
      {...rest}
    >
      {children}
    </div>
  );
});
DrawerActions.displayName = "Drawer.Actions";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type DrawerCompound = typeof DrawerRoot & {
  Trigger:     typeof DrawerTrigger;
  Content:     typeof DrawerContent;
  Header:      typeof DrawerHeader;
  Title:       typeof DrawerTitle;
  Description: typeof DrawerDescription;
  Body:        typeof DrawerBody;
  Footer:      typeof DrawerFooter;
  Actions:     typeof DrawerActions;
  Close:       typeof DrawerClose;
};

const Drawer = DrawerRoot as DrawerCompound;
Drawer.Trigger     = DrawerTrigger;
Drawer.Content     = DrawerContent;
Drawer.Header      = DrawerHeader;
Drawer.Title       = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Body        = DrawerBody;
Drawer.Footer      = DrawerFooter;
Drawer.Actions     = DrawerActions;
Drawer.Close       = DrawerClose;

export {
  Drawer,
  drawerOverlayVariants,
  drawerContentVariants,
  drawerActionsVariants,
};
