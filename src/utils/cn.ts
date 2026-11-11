/**
 * cn — the standard shadcn/ui class-name merger, configured for HC1's
 * own Tailwind theme.
 *
 * Combines conditional class expressions (clsx) with Tailwind conflict
 * resolution (tailwind-merge) so `cn("p-4", condition && "p-8")` yields
 * a single, deduplicated string with the last-specified value winning.
 *
 * WHY THE EXTENDED CONFIG: HC1's theme names its font sizes by pixel
 * value (`text-12`, `text-14`, …) and its radii by role (`rounded-control`,
 * `rounded-surface`, …). Stock tailwind-merge doesn't know those names,
 * so it filed `text-14` in the same conflict group as `text-neutral-500`
 * and silently dropped one of them — the bug that made Badge render at
 * 16px in 0.14 and dropped description colours in Dialog/Drawer. Telling
 * tailwind-merge about the scales fixes every component at once.
 *
 * Keep these lists in sync with `tokens/css/theme.css`.
 *
 * Every shadcn-style component in the HC1 design system uses this
 * helper — never string concatenation, never raw clsx alone.
 */

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["10", "12", "14", "16", "18", "20", "24", "30", "36", "48", "64"],
      radius: ["0", "4", "8", "12", "16", "24", "chip", "control", "surface", "hero", "circular"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
