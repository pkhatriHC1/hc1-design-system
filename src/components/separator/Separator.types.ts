import type { HTMLAttributes } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";

/**
 * Visual weight.
 *   subtle   → --hc-color-border-subtle (default; barely-there hairline)
 *   default  → --hc-color-border-default (a1 divide-y equivalent)
 *   strong   → --hc-color-border-strong (loud section break)
 */
export type SeparatorTone = "subtle" | "default" | "strong";

export type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  /**
   * Layout axis. Vertical separators need a fixed-height container.
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;
  /**
   * Visual weight.
   * @default 'default'
   */
  tone?: SeparatorTone;
  /**
   * When true, the separator is announced as decorative (no ARIA role).
   * Set false for separators that carry meaning (e.g. between distinct
   * sections in a screen-reader flow).
   * @default true
   */
  decorative?: boolean;
};
