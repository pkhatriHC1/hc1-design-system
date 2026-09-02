/**
 * cn — the standard shadcn/ui class-name merger.
 *
 * Combines conditional class expressions (clsx) with Tailwind conflict
 * resolution (tailwind-merge) so `cn("p-4", condition && "p-8")` yields
 * a single, deduplicated string with the last-specified value winning.
 *
 * Every shadcn-style component in the HC1 design system uses this
 * helper — never string concatenation, never raw clsx alone.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
