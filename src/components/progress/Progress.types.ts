import type { HTMLAttributes } from "react";

/**
 * Semantic tone. Pick by meaning — the token layer decides the actual
 * fill color.
 *   default → brand (in-progress work, generic progress)
 *   success → completed / healthy fill
 *   warning → attention (partial failure, slow)
 *   danger  → failed / blocked
 */
export type ProgressTone = "default" | "success" | "warning" | "danger";

/**
 * Size ladder — height of the track.
 *   sm → 4px  (compact inline progress)
 *   md → 6px  (default)
 *   lg → 8px  (prominent progress)
 */
export type ProgressSize = "sm" | "md" | "lg";

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * Current progress value 0-100. When omitted, renders as an
   * indeterminate progress bar with an animated shimmer.
   */
  value?: number;
  /**
   * Semantic tone.
   * @default 'default'
   */
  tone?: ProgressTone;
  /**
   * Size (track height).
   * @default 'md'
   */
  size?: ProgressSize;
  /**
   * Accessible label describing what is progressing. Required unless
   * the caller provides `aria-labelledby`.
   */
  "aria-label"?: string;
};
