import type { HTMLAttributes } from "react";

/**
 * Ink tone.
 *   muted   → --hc-color-text-tertiary (default; the "subtle heading over a group" case)
 *   brand   → --hc-color-action-primary (highlights a brand-scoped group)
 *   inverse → --hc-color-text-inverse (for use on dark surfaces like the Sidebar chrome)
 */
export type SectionLabelTone = "muted" | "brand" | "inverse";

/**
 * Type ramp.
 *   sm → 10px, tracking-widest — very small caption strap
 *   md → 11px, tracking-widest — default section separator
 *   lg → 12px, tracking-wide     — page-level "section header" role
 */
export type SectionLabelSize = "sm" | "md" | "lg";

export type SectionLabelProps = HTMLAttributes<HTMLElement> & {
  /**
   * Semantic wrapper. Default 'div'. Use `h2` / `h3` etc. when the
   * label heads a real document section that should participate in the
   * heading outline.
   * @default 'div'
   */
  as?: "div" | "span" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * Ink tone.
   * @default 'muted'
   */
  tone?: SectionLabelTone;
  /**
   * Type ramp.
   * @default 'md'
   */
  size?: SectionLabelSize;
};
