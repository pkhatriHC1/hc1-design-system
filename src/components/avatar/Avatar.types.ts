import type { HTMLAttributes, ReactNode } from "react";

/**
 * Size ladder — aligned to the Button + Input height ladder so an Avatar
 * chip on the same row as a Button/Input sits pixel-flush.
 *   xs — 20px · dense inline chips
 *   sm — 24px · list rows / breadcrumb crumbs
 *   md — 32px · default · app-bar identity
 *   lg — 40px · profile cards / worklist rows
 *   xl — 56px · settings identity / hero moments
 */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Presence indicator painted as a small dot at the bottom-right of the
 * avatar. Semantics only — the DS picks the color; consumers don't map.
 *   online  — brand teal · reachable now
 *   away    — amber      · idle / stepped-away
 *   busy    — red        · do-not-disturb
 *   offline — neutral    · signed out / unavailable
 */
export type AvatarStatus = "online" | "away" | "busy" | "offline";

/**
 * Shape — most product surfaces stay on circles; square is reserved for
 * "the avatar represents a resource, not a person" (a squad, a workspace,
 * a document owner-team).
 */
export type AvatarShape = "circle" | "square";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Image source. Falls back to initials / icon when it fails to load. */
  src?: string;
  /**
   * Accessible name for the avatar. Also used as the `<img>` alt text
   * when `src` is present. Required when the avatar carries meaning
   * (representing a person / team); optional when it's decorative.
   */
  alt?: string;
  /**
   * Full name — used to derive the fallback initials when no `src` is
   * given and no `children` override. "Jane Cooper" → "JC", "Prince" →
   * "P". Non-alpha characters are dropped.
   */
  name?: string;
  /**
   * Fallback content. Wins over `name`-derived initials. Use to render
   * a lucide icon (e.g. `<UserRound />`) or custom initials.
   */
  children?: ReactNode;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default 'circle' */
  shape?: AvatarShape;
  /** Optional presence dot painted at the bottom-right. */
  status?: AvatarStatus;
  /**
   * Delay before the fallback renders while the image is loading, in ms.
   * Prevents a flash of initials before the image lands.
   * @default 500
   */
  delayMs?: number;
};

/**
 * Wrapper for stacked avatars (a shared row of collaborators, a task's
 * assignees, etc.). Reverses child order visually so the leftmost avatar
 * is the topmost in the stack; children keep their natural DOM order for
 * screen readers.
 */
export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** All Avatars in the group render at this size, overriding per-Avatar. */
  size?: AvatarSize;
  /**
   * Maximum number of avatars to render individually. Overflow collapses
   * into a "+N" chip at the end. Omit to render every child as-is.
   */
  max?: number;
  /** Compose `<Avatar>` children. */
  children: ReactNode;
};
