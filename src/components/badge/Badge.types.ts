import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

/**
 * Semantic tone. Pick by *meaning*, not by color — the token layer
 * decides the actual palette.
 *   default  → strong neutral, for meta labels ("Draft", "MRN 4482991")
 *   primary  → brand, for signature moments ("Beta", "New")
 *   success  → completed, healthy, active
 *   warning  → attention, pending, degraded
 *   danger   → failed, blocked, critical
 *   info     → informational, non-actionable notice
 *   neutral  → the quietest badge, for muted meta ("Guideline v3")
 */
export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

/**
 * Visual weight.
 *   soft    → subtle wash + colored ink (default; most common)
 *   solid   → filled background + inverse ink (loud; use sparingly)
 *   outline → transparent bg + colored border + colored ink
 */
export type BadgeAppearance = "soft" | "solid" | "outline";

/**
 * Size ladder. Driven by text size + vertical padding — the badge hugs
 * its content; no fixed height.
 *
 *   sm — text 12 · py 2 · px 6   (≈ 16px tall; dense tables, nav counts)
 *   md — text 14 · py 3 · px 8   (≈ 20px tall; default)
 *   lg — text 16 · py 4 · px 10  (≈ 24px tall; headers, hero chips)
 *
 * Reach for `lg` only when the badge is the primary content of a
 * header strap or a hero callout. Larger than that → use a Card
 * header or an Alert, not a Badge.
 */
export type BadgeSize = "sm" | "md" | "lg";

/**
 * A single, small, semantic status indicator. The API is intentionally
 * flat — pick a variant, an appearance, and a size, then compose text
 * and optional icons as children.
 *
 * Badges are not buttons. They are not filters. They are not
 * navigation. If you need any of those, compose Button, DropdownMenu,
 * or a Filter primitive (future) — do not overload Badge.
 */
export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "onClick"> & {
  /**
   * Semantic tone.
   * @default 'default'
   */
  variant?: BadgeVariant;
  /**
   * Visual weight.
   * @default 'soft'
   */
  appearance?: BadgeAppearance;
  /**
   * Size ladder.
   * @default 'md'
   */
  size?: BadgeSize;
  /**
   * When true, render a small variant-colored dot before the label.
   * The dot always uses the *solid* tone of the current variant so an
   * "active" dot on a soft badge still reads unambiguously.
   */
  dot?: boolean;
  /**
   * Optional icon rendered before the label. Ignored when `dot` is set.
   * Icons are decorative unless a label is absent; ARIA hides them
   * automatically.
   */
  leadingIcon?: ReactNode;
  /**
   * Optional icon rendered after the label. Not rendered when the
   * badge is `removable` — the remove control lives in the same slot.
   */
  trailingIcon?: ReactNode;
  /**
   * A numeric count — turns the badge into a pill-shaped counter.
   * Values above `maxCount` render as `${maxCount}+` (e.g. `99+`).
   * When provided, `count` becomes the content — any children are
   * ignored.
   */
  count?: number;
  /**
   * Cap for `count` — anything above renders as `${maxCount}+`.
   * @default 99
   */
  maxCount?: number;
  /**
   * When present, renders a trailing "✕" control that fires this
   * handler on activation. The X is a real `<button>` with an
   * accessible name ("Remove"). Passing this does not turn the whole
   * badge into a button — only the X is interactive.
   */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Accessible label for the remove control.
   * @default 'Remove'
   */
  removeLabel?: string;
  /**
   * When true, the badge and its remove control render dimmed and
   * non-interactive. Purely a visual state — the badge itself is not
   * a form control.
   */
  disabled?: boolean;
  /**
   * The badge label. Ignored when `count` is provided.
   */
  children?: ReactNode;
};
