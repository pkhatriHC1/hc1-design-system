import type { HTMLAttributes, ReactNode } from "react";

export type AppShellProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Compose with `<Sidebar>` (from @hc1/design-system) and
   * `<AppShell.Main>`. Order in the JSX determines DOM order.
   */
  children: ReactNode;
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
