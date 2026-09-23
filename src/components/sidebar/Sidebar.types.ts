import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
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
  /**
   * Current URL path. When set, every Sidebar.Item that has an `href`
   * auto-derives its `active` state by matching against this value —
   * consumers stop hand-wiring `active={pathname === '/foo'}` on every
   * row. An Item's explicit `active` prop still wins if provided.
   *
   * Pair with your router: React Router → `useLocation().pathname`,
   * Next.js → `usePathname()`, TanStack Router → `useRouterState()`.
   */
  activePath?: string;
  /**
   * How Item hrefs are matched against `activePath` by default.
   *   exact       — activePath === item.href (default)
   *   startsWith  — item.href is a prefix of activePath, respecting
   *                 path boundaries so `/reports` doesn't match `/reports-archive`
   *
   * Per-item override available via `SidebarItemProps.matchMode`.
   * @default 'exact'
   */
  matchMode?: "exact" | "startsWith";
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
   * Built-in toggle button rendered at the top-left of the header. Shows
   * an X icon when expanded, a Menu (hamburger) icon when collapsed;
   * clicking flips the sidebar's collapsed state via the shared context.
   * Set `false` when the trigger lives elsewhere (e.g. in an AppShell
   * top bar via SidebarTrigger) so there's no duplicate control.
   * @default true
   */
  showToggle?: boolean;
  /**
   * Optional brand mark. Not shown by default — most HC1 products only
   * render the built-in toggle in the header. Opt in by passing a node
   * (logo, initials, product name). Hidden entirely when the sidebar
   * is collapsed.
   */
  brand?: ReactNode;
  /**
   * Optional primary action pinned below the header row (e.g. "New batch",
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
 * Common props for anchor / button / asChild item forms.
 */
type SidebarItemCommonProps = {
  icon: ReactNode;
  label: string;
  /**
   * Explicit active state. Overrides any active derivation from the
   * root's `activePath`. Leave unset to let the DS derive it.
   */
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
  /**
   * Per-item override of the root Sidebar's `matchMode`. Useful when
   * one item wants prefix matching in a mostly-exact sidebar (e.g. the
   * "Patients" row that should stay highlighted for `/patients/*`
   * detail routes).
   */
  matchMode?: "exact" | "startsWith";
};

export type SidebarItemProps = SidebarItemCommonProps &
  (
    | ({ href: string; onClick?: never; asChild?: never } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        keyof SidebarItemCommonProps | "href"
      >)
    | ({ onClick?: (event: MouseEvent<HTMLButtonElement>) => void; href?: never; asChild?: never } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof SidebarItemCommonProps | "onClick"
      >)
    | {
        /**
         * Render as a Radix Slot-like clone of a single React element
         * child. Use to plug in a router `<Link>` (React Router,
         * Next.js, TanStack Router) — the DS clones the element,
         * applies the item styling + data-attrs, injects the icon +
         * label + badge chrome as its children, and forwards the ref.
         *
         * When `asChild` is true, the child element owns navigation
         * (the DS doesn't render an `<a href>` or a `<button>`), and
         * pattern matching for `activePath` uses the child's `href` /
         * `to` prop.
         */
        asChild: true;
        children: ReactElement;
        href?: never;
        onClick?: never;
      }
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
