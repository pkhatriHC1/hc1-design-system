import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/**
 * CardGrid — responsive grid wrapper for Cards.
 *
 * Composes Cards / KpiCards / any tile children into a responsive grid.
 * Auto-drops columns as the viewport narrows: 4 → 3 → 2 → 1. Similar in
 * spirit to KpiRow but for larger tiles (catalog listings, template
 * gallery, feature callouts).
 */

export type CardGridProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Wide-screen column count. Row auto-drops on tablet / phone.
   * @default 3
   */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Minimum tile width in px. Below this, columns collapse. @default 240 */
  minTileWidth?: number;
  /** Gap between tiles in px. @default 16 */
  gap?: number;
};

const COLUMN_CLASSES: Record<NonNullable<CardGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
};

export const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(function CardGrid(
  { columns = 3, minTileWidth = 240, gap = 16, className, style, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      data-slot="card-grid"
      className={cn(
        "grid grid-cols-1",
        COLUMN_CLASSES[columns],
        className,
      )}
      style={{
        gap,
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minTileWidth}px, 100%), 1fr))`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
CardGrid.displayName = "CardGrid";
