import type { HTMLAttributes, ReactNode } from "react";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export type ScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, "dir"> & {
  /**
   * Which scroll axis is enabled.
   * @default 'vertical'
   */
  orientation?: ScrollAreaOrientation;
  /**
   * When the scrollbars appear.
   *   auto   → visible while scrolling, otherwise hidden (default, feels native)
   *   always → always visible
   *   hover  → visible while pointer is over the viewport
   *   scroll → visible while scrolling
   * @default 'auto'
   */
  scrollbars?: "auto" | "always" | "hover" | "scroll";
  /**
   * Content that scrolls.
   */
  children: ReactNode;
};
