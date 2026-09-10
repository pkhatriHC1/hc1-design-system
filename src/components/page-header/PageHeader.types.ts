import type { HTMLAttributes, ReactNode } from "react";

export type PageHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /**
   * The page title. Rendered as an h1 by default; override the element
   * via `titleAs` if the surrounding document structure dictates a
   * different level.
   */
  title: ReactNode;
  /**
   * Element used to render the title. Default 'h1'. Use 'h2' when the
   * PageHeader is a section within a larger flow (rare).
   * @default 'h1'
   */
  titleAs?: "h1" | "h2";
  /**
   * Optional short description shown under the title in tertiary ink.
   */
  subtitle?: ReactNode;
  /**
   * Right-aligned informational content (e.g. a data-freshness badge,
   * an environment tag, a last-updated timestamp). Mutually exclusive
   * with `actions` — pass one or the other, not both.
   */
  meta?: ReactNode;
  /**
   * Right-aligned action buttons (usually 1-2 `<Button>` elements).
   * Mutually exclusive with `meta`.
   */
  actions?: ReactNode;
};
