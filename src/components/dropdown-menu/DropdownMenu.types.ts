import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";

/* ══════ ROOT ══════════════════════════════════════════════════════ */

export type DropdownMenuProps = {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Fires when the menu opens or closes (trigger, Escape, outside click). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the menu can appear when the user hovers the trigger. Off by
   * default — menus should open on click / keyboard, never hover.
   * @default false
   */
  modal?: boolean;
  /** Compose Trigger + Content. */
  children: ReactNode;
};

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

/**
 * Injects an onClick / aria-* onto its single child. Use `asChild` so
 * the child can be any interactive element — typically an HC1 Button.
 */
export type DropdownMenuTriggerProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Trigger>,
  "asChild"
> & {
  /**
   * Render as a Radix Slot instead of the default button. Almost always
   * set to true when using HC1 Button as the trigger.
   * @default false
   */
  asChild?: boolean;
};

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

export type DropdownMenuContentSize = "sm" | "md" | "lg";

/**
 * The floating menu panel. Portalled to `document.body`. Anchors to the
 * trigger via Radix positioning; controls alignment via `align` and side
 * via `side`.
 */
export type DropdownMenuContentProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>,
  "className"
> & {
  /**
   * Menu min-width. Doesn't clip content — items can still stretch it.
   *   sm — 160px · terse row actions
   *   md — 200px · default; standard overflow menus
   *   lg — 240px · rich items (secondary text, keyboard shortcuts)
   * @default 'md'
   */
  size?: DropdownMenuContentSize;
  className?: string;
};

/* ══════ ITEM ══════════════════════════════════════════════════════ */

/**
 * A single selectable row. `onSelect` fires when the user clicks or hits
 * Enter on this item; the menu auto-closes after. Prevent default on the
 * event to keep the menu open.
 */
export type DropdownMenuItemProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>,
  "className"
> & {
  /**
   * Applies the destructive tone (red text / red hover). Use for delete,
   * remove, discard actions.
   */
  destructive?: boolean;
  /**
   * Optional right-aligned shortcut hint (e.g. "⌘K"). Purely visual — the
   * consumer wires the actual keyboard listener.
   */
  shortcut?: ReactNode;
  className?: string;
};

/* ══════ CHECKBOX / RADIO ══════════════════════════════════════════ */

export type DropdownMenuCheckboxItemProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem>,
  "className"
> & {
  className?: string;
};

export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof RadixDropdownMenu.RadioGroup
>;

export type DropdownMenuRadioItemProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioItem>,
  "className"
> & {
  className?: string;
};

/* ══════ STATIC ROWS ═══════════════════════════════════════════════ */

export type DropdownMenuLabelProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label>,
  "className"
> & {
  className?: string;
};

export type DropdownMenuSeparatorProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>,
  "className"
> & {
  className?: string;
};

export type DropdownMenuGroupProps = ComponentPropsWithoutRef<
  typeof RadixDropdownMenu.Group
>;

/* ══════ SUBMENU ═══════════════════════════════════════════════════ */

export type DropdownMenuSubProps = ComponentPropsWithoutRef<
  typeof RadixDropdownMenu.Sub
>;

export type DropdownMenuSubTriggerProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubTrigger>,
  "className"
> & {
  className?: string;
};

export type DropdownMenuSubContentProps = Omit<
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubContent>,
  "className"
> & {
  className?: string;
};
