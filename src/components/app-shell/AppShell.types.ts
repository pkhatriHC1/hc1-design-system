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
   * @default '100%'
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
   * @default 24
   */
  padding?: number | string;
};
