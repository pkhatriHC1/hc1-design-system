import { forwardRef } from "react";
import type { CSSProperties } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  DialogActionsProps,
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./Dialog.types";

/**
 * HC1 Dialog — the canonical overlay primitive.
 *
 * Migrated from a hand-built implementation (~450 lines of focus trap +
 * body scroll lock + Escape handler + Portal + Overlay + Title/Description
 * context registration) to a wrapper around @radix-ui/react-dialog.
 *
 * Radix owns focus management (move into panel + restore to trigger),
 * body scroll lock (via ReactRemoveScroll), Escape + outside-click close,
 * Portal, Overlay, aria-modal / aria-labelledby / aria-describedby wiring
 * (via Title + Description components). My file owns the visual layer +
 * the compound sub-component surface (Header / Body / Footer / Actions +
 * loading overlay + X close button).
 *
 * Public API preserved — Dialog, Dialog.Trigger, Dialog.Content,
 * Dialog.Header, Dialog.Title, Dialog.Description, Dialog.Body,
 * Dialog.Footer, Dialog.Actions, Dialog.Close compose identically.
 */

/* ══════ CVA — OVERLAY (scrim) ═════════════════════════════════════ */

const dialogOverlayVariants = cva(
  cn(
    "fixed inset-0 z-modal-scrim",
    "bg-[color:var(--hc-dialog-scrim)]",
    /* Fade-in matches the original hc-dialog-scrim-in keyframe (250ms). */
    "opacity-0 data-[state=open]:opacity-100",
    "transition-opacity duration-250 ease-entrance motion-reduce:duration-0",
  ),
);

/* ══════ CVA — CONTENT (panel) ═════════════════════════════════════ */

const dialogContentVariants = cva(
  cn(
    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-modal",
    "flex flex-col",
    /* Viewport safety: never overflow the viewport with 16px margin each
       side, and cap height with 24px each side (matches original
       max-height calc). */
    "w-[calc(100vw-32px)]",
    "max-h-[calc(100vh-48px)]",
    "bg-white text-neutral-900 border border-neutral-100 rounded-surface shadow-xl",
    "font-sans text-left overflow-hidden outline-none",
    /* Entrance transition: fade + translateY(4px) + scale(0.98) → rest.
       Matches original hc-dialog-panel-in keyframe. Exit is instant
       (Radix unmounts) — same as original. */
    "opacity-0 translate-y-[calc(-50%+4px)] scale-[0.98]",
    "data-[state=open]:opacity-100 data-[state=open]:translate-y-[-50%] data-[state=open]:scale-100",
    "transition-[opacity,transform] duration-250 ease-entrance motion-reduce:duration-0",
  ),
  {
    variants: {
      size: {
        sm:         "max-w-[var(--hc-dialog-size-sm)]",
        md:         "max-w-[var(--hc-dialog-size-md)]",
        lg:         "max-w-[var(--hc-dialog-size-lg)]",
        xl:         "max-w-[var(--hc-dialog-size-xl)]",
        /* Fullscreen: edge-to-edge, no radius, no shadow. Override the
           viewport safety margins entirely. */
        fullscreen: cn(
          "w-screen h-screen max-w-none max-h-none",
          "rounded-none shadow-none border-transparent",
          "translate-x-0 translate-y-0 left-0 top-0",
          "data-[state=open]:translate-x-0 data-[state=open]:translate-y-0",
        ),
      },
      loading: {
        true:  "[&_[data-slot=dialog-body]]:invisible",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      loading: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

function DialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: DialogProps) {
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
DialogRoot.displayName = "Dialog";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

function DialogTrigger({ children }: DialogTriggerProps) {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
}
DialogTrigger.displayName = "Dialog.Trigger";

/* ══════ CLOSE (asChild wrapper) ═══════════════════════════════════ */

function DialogClose({ children }: DialogCloseProps) {
  return <RadixDialog.Close asChild>{children}</RadixDialog.Close>;
}
DialogClose.displayName = "Dialog.Close";

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

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
    size = "md",
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
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={dialogOverlayVariants()} />
      <RadixDialog.Content
        ref={forwardedRef}
        aria-busy={loading || undefined}
        onPointerDownOutside={
          closeOnOverlayClick ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={
          closeOnEscape ? undefined : (e) => e.preventDefault()
        }
        style={style as CSSProperties}
        className={cn(
          dialogContentVariants({
            size,
            loading,
          } as VariantProps<typeof dialogContentVariants>),
          className,
        )}
        data-slot="dialog-content"
        {...rest}
      >
        {children}

        {showCloseButton && (
          <RadixDialog.Close
            aria-label={closeLabel}
            className={cn(
              "absolute top-12 right-12",
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
DialogContent.displayName = "Dialog.Content";

/* ══════ HEADER ════════════════════════════════════════════════════ */

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="dialog-header"
      className={cn(
        "relative flex items-start gap-12",
        /* padding: stack-lg × [inline-xl + 32px reserved for X] × stack-lg × inline-xl */
        "pt-16 pr-[calc(24px+32px)] pb-16 pl-24",
        className,
      )}
      {...rest}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-4">{children}</div>
    </div>
  );
});
DialogHeader.displayName = "Dialog.Header";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { as = 2, className, children, id, ...rest },
  ref,
) {
  const Tag = `h${as}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /* Radix Title auto-wires aria-labelledby on the parent Dialog by
     rendering an id on this element and hooking it up automatically. We
     wrap Radix Title with asChild + our custom tag so the semantic
     heading level is preserved. */
  return (
    <RadixDialog.Title asChild>
      <Tag
        ref={ref as React.Ref<HTMLHeadingElement>}
        id={id}
        data-slot="dialog-title"
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
DialogTitle.displayName = "Dialog.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(function DialogDescription(
  { className, children, id, ...rest },
  ref,
) {
  return (
    <RadixDialog.Description asChild>
      <p
        ref={ref}
        id={id}
        data-slot="dialog-description"
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
DialogDescription.displayName = "Dialog.Description";

/* ══════ BODY ══════════════════════════════════════════════════════ */

const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="dialog-body"
      className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        "py-12 px-24",
        "text-neutral-700 text-16 leading-normal",
        /* When Body follows Header directly, collapse its top padding so
           the two sections share one rhythmic gap. */
        "[[data-slot=dialog-header]+&]:pt-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
DialogBody.displayName = "Dialog.Body";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={cn(
        "flex items-center gap-12",
        "py-16 px-24",
        "bg-white border-t border-neutral-100",
        "text-neutral-500 text-14 leading-[1.4]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
DialogFooter.displayName = "Dialog.Footer";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const dialogActionsVariants = cva(
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

const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(function DialogActions(
  { align = "end", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="dialog-actions"
      className={cn(dialogActionsVariants({ align }), className)}
      {...rest}
    >
      {children}
    </div>
  );
});
DialogActions.displayName = "Dialog.Actions";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type DialogCompound = typeof DialogRoot & {
  Trigger:     typeof DialogTrigger;
  Content:     typeof DialogContent;
  Header:      typeof DialogHeader;
  Title:       typeof DialogTitle;
  Description: typeof DialogDescription;
  Body:        typeof DialogBody;
  Footer:      typeof DialogFooter;
  Actions:     typeof DialogActions;
  Close:       typeof DialogClose;
};

const Dialog = DialogRoot as DialogCompound;
Dialog.Trigger     = DialogTrigger;
Dialog.Content     = DialogContent;
Dialog.Header      = DialogHeader;
Dialog.Title       = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body        = DialogBody;
Dialog.Footer      = DialogFooter;
Dialog.Actions     = DialogActions;
Dialog.Close       = DialogClose;

export {
  Dialog,
  dialogOverlayVariants,
  dialogContentVariants,
  dialogActionsVariants,
};
