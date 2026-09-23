import { forwardRef } from "react";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../utils/cn";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuContentSize,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "./DropdownMenu.types";

/**
 * HC1 DropdownMenu — the canonical row-actions / overflow menu.
 *
 * Thin wrap of @radix-ui/react-dropdown-menu with HC1 chrome: the same
 * elevated surface as Popover / Dialog, the same brand-tinted hover as
 * Ghost Button, keyboard shortcuts + submenus + checkbox/radio items.
 * Portalled to `document.body`; anchored to the trigger via Radix.
 *
 * Compose:
 *   DropdownMenu
 *     DropdownMenu.Trigger (asChild → HC1 Button)
 *     DropdownMenu.Content
 *       DropdownMenu.Label
 *       DropdownMenu.Item
 *       DropdownMenu.CheckboxItem
 *       DropdownMenu.RadioGroup
 *         DropdownMenu.RadioItem
 *       DropdownMenu.Separator
 *       DropdownMenu.Sub
 *         DropdownMenu.SubTrigger
 *         DropdownMenu.SubContent
 */

/* ══════ Content size map ══════════════════════════════════════════ */

const CONTENT_MIN_WIDTH: Record<DropdownMenuContentSize, string> = {
  sm: "min-w-[160px]",
  md: "min-w-[200px]",
  lg: "min-w-[240px]",
};

/* ══════ Root + Trigger ════════════════════════════════════════════ */

export function DropdownMenu({
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  children,
}: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {children}
    </RadixDropdownMenu.Root>
  );
}

const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger({ asChild, children, ...rest }, forwardedRef) {
  return (
    <RadixDropdownMenu.Trigger asChild={asChild} ref={forwardedRef} {...rest}>
      {children}
    </RadixDropdownMenu.Trigger>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenu.Trigger";

/* ══════ Content ═══════════════════════════════════════════════════ */

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { size = "md", sideOffset = 4, className, children, ...rest },
  forwardedRef,
) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        ref={forwardedRef}
        sideOffset={sideOffset}
        data-slot="dropdown-menu-content"
        className={cn(
          "z-[var(--hc-z-popover)] overflow-hidden",
          "rounded-[var(--hc-radius-control)]",
          "border border-[color:var(--hc-color-border-subtle)]",
          "bg-[color:var(--hc-color-bg-elevated)]",
          "shadow-[var(--hc-shadow-lg)]",
          "p-1",
          "text-[color:var(--hc-color-text-primary)]",
          "font-sans text-[14px] leading-tight",
          /* Origin-aware entry animation matching Popover. */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          CONTENT_MIN_WIDTH[size],
          className,
        )}
        {...rest}
      >
        {children}
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenu.Content";

/* ══════ Item ══════════════════════════════════════════════════════ */

const itemBaseClasses = cn(
  "relative flex cursor-default select-none items-center gap-2",
  "rounded-[var(--hc-radius-8)]",
  "px-2 py-1.5",
  "outline-none",
  "transition-colors duration-150 ease-standard motion-reduce:duration-0",
  "focus:bg-[color:var(--hc-color-brand-50)]",
  "data-[highlighted]:bg-[color:var(--hc-color-brand-50)]",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
);

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { destructive, shortcut, className, children, ...rest },
    forwardedRef,
  ) {
    return (
      <RadixDropdownMenu.Item
        ref={forwardedRef}
        data-slot="dropdown-menu-item"
        data-destructive={destructive || undefined}
        className={cn(
          itemBaseClasses,
          destructive
            ? "text-[color:var(--hc-color-severity-critical-text)] data-[highlighted]:bg-[color:var(--hc-color-severity-critical-bg)] focus:bg-[color:var(--hc-color-severity-critical-bg)]"
            : "text-[color:var(--hc-color-text-primary)]",
          className,
        )}
        {...rest}
      >
        {children}
        {shortcut && (
          <span
            data-slot="dropdown-menu-shortcut"
            className="ml-auto text-[12px] tracking-widest text-[color:var(--hc-color-text-tertiary)]"
          >
            {shortcut}
          </span>
        )}
      </RadixDropdownMenu.Item>
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenu.Item";

/* ══════ Checkbox item ═════════════════════════════════════════════ */

const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem({ className, children, ...rest }, forwardedRef) {
  return (
    <RadixDropdownMenu.CheckboxItem
      ref={forwardedRef}
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemBaseClasses, "pl-8", className)}
      {...rest}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <Check className="size-4" />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenu.CheckboxItem";

/* ══════ Radio group / item ════════════════════════════════════════ */

function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <RadixDropdownMenu.RadioGroup {...props} />;
}
DropdownMenuRadioGroup.displayName = "DropdownMenu.RadioGroup";

const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ className, children, ...rest }, forwardedRef) {
  return (
    <RadixDropdownMenu.RadioItem
      ref={forwardedRef}
      data-slot="dropdown-menu-radio-item"
      className={cn(itemBaseClasses, "pl-8", className)}
      {...rest}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenu.RadioItem";

/* ══════ Static rows ═══════════════════════════════════════════════ */

const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...rest }, forwardedRef) {
    return (
      <RadixDropdownMenu.Label
        ref={forwardedRef}
        data-slot="dropdown-menu-label"
        className={cn(
          "px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest",
          "text-[color:var(--hc-color-text-tertiary)]",
          className,
        )}
        {...rest}
      />
    );
  },
);
DropdownMenuLabel.displayName = "DropdownMenu.Label";

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...rest }, forwardedRef) {
  return (
    <RadixDropdownMenu.Separator
      ref={forwardedRef}
      data-slot="dropdown-menu-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-[color:var(--hc-color-border-subtle)]",
        className,
      )}
      {...rest}
    />
  );
});
DropdownMenuSeparator.displayName = "DropdownMenu.Separator";

function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <RadixDropdownMenu.Group {...props} />;
}
DropdownMenuGroup.displayName = "DropdownMenu.Group";

/* ══════ Submenu ═══════════════════════════════════════════════════ */

function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <RadixDropdownMenu.Sub {...props} />;
}
DropdownMenuSub.displayName = "DropdownMenu.Sub";

const DropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger({ className, children, ...rest }, forwardedRef) {
  return (
    <RadixDropdownMenu.SubTrigger
      ref={forwardedRef}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(itemBaseClasses, className)}
      {...rest}
    >
      {children}
      <ChevronRight className="ml-auto size-4 opacity-60" />
    </RadixDropdownMenu.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenu.SubTrigger";

const DropdownMenuSubContent = forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent({ className, ...rest }, forwardedRef) {
  return (
    <RadixDropdownMenu.SubContent
      ref={forwardedRef}
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-[var(--hc-z-popover)] overflow-hidden",
        "rounded-[var(--hc-radius-control)]",
        "border border-[color:var(--hc-color-border-subtle)]",
        "bg-[color:var(--hc-color-bg-elevated)]",
        "shadow-[var(--hc-shadow-lg)]",
        "p-1 min-w-[180px]",
        "text-[color:var(--hc-color-text-primary)]",
        "font-sans text-[14px] leading-tight",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      {...rest}
    />
  );
});
DropdownMenuSubContent.displayName = "DropdownMenu.SubContent";

/* ══════ Compound export ═══════════════════════════════════════════ */

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem;
DropdownMenu.RadioGroup = DropdownMenuRadioGroup;
DropdownMenu.RadioItem = DropdownMenuRadioItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Sub = DropdownMenuSub;
DropdownMenu.SubTrigger = DropdownMenuSubTrigger;
DropdownMenu.SubContent = DropdownMenuSubContent;
