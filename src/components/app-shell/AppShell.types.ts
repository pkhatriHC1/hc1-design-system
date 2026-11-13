import type { HTMLAttributes, ReactNode } from "react";

export type AppShellProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Compose with `<AppShell.Header>` (optional top bar), `<Sidebar>`,
   * `<AppShell.Main>`, and `<AppShell.Footer>` (optional bottom bar).
   * The DS walks children by displayName and lays them out:
   *
   *   ┌─────────────────────────────────┐
   *   │ AppShell.Header (full width)    │
   *   ├──────────┬──────────────────────┤
   *   │          │                      │
   *   │ Sidebar  │ AppShell.Main        │
   *   │          │                      │
   *   ├──────────┴──────────────────────┤
   *   │ AppShell.Footer (full width)    │
   *   └─────────────────────────────────┘
   *
   * Order inside the row (Sidebar first / Main first) follows JSX order.
   */
  children: ReactNode;
};

/**
 * Optional top bar rendered above the Sidebar + Main row. Full-width,
 * shrink-to-content height. Use for global chrome — brand mark on the
 * left, breadcrumbs / search / user menu on the right. When present,
 * the Sidebar and Main row take the remaining vertical space.
 */
export type AppShellHeaderProps = HTMLAttributes<HTMLElement> & {
  /**
   * Draw a bottom border separating the header from the content row.
   * @default true
   */
  divider?: boolean;
  /**
   * Padding around the header content. Numeric values are px.
   * @default '12px 24px'
   */
  padding?: number | string;
};

/**
 * Optional bottom bar rendered below the Sidebar + Main row. Full-width,
 * shrink-to-content height. Use for status text, keyboard shortcut
 * hints, environment badges.
 */
export type AppShellFooterProps = HTMLAttributes<HTMLElement> & {
  /**
   * Draw a top border separating the footer from the content row.
   * @default true
   */
  divider?: boolean;
  /**
   * Padding around the footer content.
   * @default '8px 24px'
   */
  padding?: number | string;
};

export type AppShellMainProps = HTMLAttributes<HTMLElement> & {
  /**
   * Constrain the main-content column to a max width. Content
   * remains flush-left by default; set `center` to center it.
   * Leave unset: the hc1 page standard caps content at 1440px
   * (`--hc-page-max-width`).
   * @default 'var(--hc-page-max-width)'
   */
  maxWidth?: number | string;
  /**
   * Center the constrained content column horizontally in the
   * remaining space. Ignored if `maxWidth` is 100%.
   * @default false
   */
  center?: boolean;
  /**
   * Padding around the main content. Numeric values are px.
   * Leave unset: the hc1 page standard is 32px (`--hc-page-pad`).
   * @default 'var(--hc-page-pad)'
   */
  padding?: number | string;
};

/**
 * AppShell.TopBar — the hc1 top bar. Modular: fixed slots in a fixed
 * order. `product` and `user` are required; every other slot is
 * switched on by passing its prop. There is no className / style /
 * children on purpose — every product's top bar is identical.
 */
export type AppShellTopBarProps = {
  /** Required. hc1 + product mark on the far left. */
  product: {
    /** Product name, e.g. "SourceIQ". */
    name: string;
    /** Optional logo (img or svg), rendered 24px tall before the name. */
    logo?: ReactNode;
    /** Where the mark links to (usually the product home). */
    href?: string;
  };
  /**
   * Optional. Organisation context after a divider — facility or tenant
   * name (e.g. "Memorial General Hospital"), or a facility switcher.
   */
  context?: ReactNode;
  /** Optional. Search / command-palette trigger. */
  search?: {
    placeholder?: string;
    /** Keyboard hint shown inside the trigger, e.g. "⌘K". */
    shortcut?: string;
    onOpen: () => void;
  };
  /** Optional. IQ Assistant launcher — always an amber CTA button. */
  assistant?: {
    /** @default "IQ Assistant" */
    label?: string;
    onClick: () => void;
  };
  /** Optional. Notification bell with an unread count. */
  notifications?: {
    count?: number;
    onClick: () => void;
  };
  /** Optional. Help button — opens a URL or runs a handler. */
  help?: {
    href?: string;
    onClick?: () => void;
  };
  /** Required. Signed-in user on the far right. */
  user: {
    name: string;
    /** Role or title under the name, e.g. "Category Manager". */
    role?: string;
    avatarSrc?: string;
    /** Optional email shown at the top of the user menu. */
    email?: string;
    /**
     * Items for the user menu. When set, clicking the user opens a menu
     * with the user's name, role and email at the top, then these items.
     * Mark sign-out with `destructive` and put it last.
     */
    menu?: AppShellUserMenuItem[];
    /** Custom handler instead of the built-in menu. Ignored when `menu` is set. */
    onClick?: () => void;
  };
};

/** One item in the AppShell.TopBar user menu. */
export type AppShellUserMenuItem = {
  label: string;
  /** Optional 16px lucide icon. */
  icon?: ReactNode;
  onSelect: () => void;
  /** Destructive styling, e.g. Sign out. */
  destructive?: boolean;
  /** Draw a separator above this item, e.g. to set Sign out apart. */
  separatorBefore?: boolean;
};
