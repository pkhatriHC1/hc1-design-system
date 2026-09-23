import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

/* ══════ ROOT ══════════════════════════════════════════════════════ */

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  /**
   * Controlled collapsed state. Pair with `onCollapsedChange`.
   * When collapsed, the sidebar shrinks to an icon-only rail.
   */
  collapsed?: boolean;
  /**
   * Uncontrolled initial state. Ignored when `collapsed` is provided.
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Fires when the user toggles via keyboard shortcut, the trigger
   * button, or a Sidebar.Item click that changes route.
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Persist collapsed state to `localStorage` under this key. Set
   * `false` to disable persistence.
   * @default 'hc-sidebar-collapsed'
   */
  persistKey?: string | false;
  /**
   * Keyboard shortcut key that toggles collapse when pressed with
   * Cmd/Ctrl. Set `false` to disable.
   * @default 'b'
   */
  keyboardShortcut?: string | false;
  /**
   * Accessible name for the `<nav>` landmark. Defaults to "Primary".
   */
  ariaLabel?: string;
};

/* ══════ HEADER ════════════════════════════════════════════════════ */

/**
 * The primary-action slot in the Sidebar.Header. When collapsed, it
 * shrinks to a square icon-only button; when expanded, it stretches
 * to a full-width pill with label + icon.
 */
export type SidebarHeaderAction = {
  label: string;
  icon: ReactNode;
  /** Renders as `<a href>` when provided. */
  href?: string;
  /** Renders as `<button>` when provided (mutually exclusive with `href`). */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Brand mark. When the sidebar is collapsed, only the first character
   * of the string form is shown; ReactNode form is hidden entirely.
   * Pass whatever composition of logo/text your product needs.
   */
  brand?: ReactNode;
  /**
   * Optional primary action pinned below the brand (e.g. "New batch",
   * "Add Files to Analyze"). Full-width when expanded; icon-only when
   * collapsed.
   */
  action?: SidebarHeaderAction;
};

/* ══════ SECTION ═══════════════════════════════════════════════════ */

export type SidebarSectionProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Section title. Renders a top divider + uppercase strap. Omit for
   * the first (usually anonymous) section.
   */
  title?: string;
  children: ReactNode;
};

/* ══════ ITEM ══════════════════════════════════════════════════════ */

/**
 * Common props for both anchor and button item forms.
 */
type SidebarItemCommonProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  /**
   * Trailing badge — a small count or a "new" tag. Automatically
   * hidden when the sidebar is collapsed (space for it disappears).
   */
  badge?: ReactNode;
  /**
   * Tooltip content shown when the sidebar is collapsed and the user
   * hovers/focuses the item. Defaults to `label`.
   */
  tooltip?: ReactNode;
};

export type SidebarItemProps = SidebarItemCommonProps &
  (
    | ({ href: string; onClick?: never } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        keyof SidebarItemCommonProps | "href"
      >)
    | ({ onClick?: (event: MouseEvent<HTMLButtonElement>) => void; href?: never } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof SidebarItemCommonProps | "onClick"
      >)
  );

/* ══════ GROUP ═════════════════════════════════════════════════════ */

/**
 * A collapsible parent row that holds nested Sidebar.Items (or nested
 * Sidebar.Groups). Renders like a Sidebar.Item at rest — icon + label +
 * optional badge — plus a trailing chevron that indicates open state.
 *
 * State is controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 *
 * Collapsed-sidebar behaviour: the group renders as an icon-only row
 * (like a collapsed Item) and its children are hidden entirely — there
 * is no space to fan them out in the rail, and re-implementing that as
 * a popover is out of scope for the group primitive.
 */
export type SidebarGroupProps = {
  /** Leading icon — matches Sidebar.Item's icon slot. */
  icon: ReactNode;
  /** Trigger label. Used as the collapsed-tooltip content by default. */
  label: string;
  /**
   * Optional trailing badge — count / new tag. Hidden when the sidebar
   * is collapsed (like Sidebar.Item's badge).
   */
  badge?: ReactNode;
  /**
   * Marks the group as active — reserved for the case where a descendant
   * item is active. Purely visual; consumers derive it from the router.
   */
  active?: boolean;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Fires whenever the group opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Tooltip content shown when the sidebar is collapsed and the trigger
   * is hovered/focused. Defaults to `label`.
   */
  tooltip?: ReactNode;
  /** Nested Sidebar.Item / Sidebar.Group children. */
  children: ReactNode;
  className?: string;
};

/* ══════ FOOTER ════════════════════════════════════════════════════ */

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

/**
 * A collapse/expand toggle button. Usually placed in the AppShell top
 * bar for mobile, or inline anywhere the product wants an in-page
 * toggle.
 */
export type SidebarTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Accessible label. Default: "Toggle sidebar". */
  ariaLabel?: string;
};
