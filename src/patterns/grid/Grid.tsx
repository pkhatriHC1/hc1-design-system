import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/**
 * Grid — responsive tile grid.
 *
 * Merges the previous `KpiRow` (KPI grid for dashboards) and `CardGrid`
 * (Card gallery for catalogs) into one primitive. Consumers pick their
 * responsive model:
 *
 *   - `columns` alone → Tailwind breakpoint mode. Fixed column count on
 *     wide (up to `columns`), auto-drops to 2 on tablet, 1 on phone.
 *     Best when the design guarantees exactly N tiles.
 *
 *   - `minTileWidth` set → CSS auto-fit mode. Columns flow to fit the
 *     viewport, respecting the minimum width. Best when the tile count
 *     varies (search results, dynamic catalog).
 *
 *   - Both set → auto-fit wins. `columns` becomes a semantic hint only.
 *
 *   <Grid columns={4} gap={16}>       // dashboard KPI row
 *     <KpiCard … /> × 4
 *   </Grid>
 *
 *   <Grid minTileWidth={280}>         // catalog / template gallery
 *     <Card … /> × N
 *   </Grid>
 */

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Maximum column count on wide screens. Ignored when `minTileWidth`
   * is set (auto-fit takes over).
   * @default 3
   */
  columns?: 2 | 3 | 4 | 5 | 6;
  /**
   * Minimum tile width in px. When set, switches to CSS auto-fit —
   * columns flow to fit the viewport, respecting this minimum. Below
   * this width, tiles collapse to fewer columns.
   */
  minTileWidth?: number;
  /**
   * Gap between tiles in px. Applies both between columns and between
   * wrapped rows.
   * @default 16
   */
  gap?: number;
};

const COLUMN_CLASSES: Record<NonNullable<GridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 3, minTileWidth, gap = 16, className, style, children, ...rest },
  forwardedRef,
) {
  const useAutoFit = typeof minTileWidth === "number";
  return (
    <div
      ref={forwardedRef}
      data-slot="grid"
      className={cn(
        "grid grid-cols-1",
        !useAutoFit && COLUMN_CLASSES[columns],
        className,
      )}
      style={{
        gap,
        gridTemplateColumns: useAutoFit
          ? `repeat(auto-fit, minmax(min(${minTileWidth}px, 100%), 1fr))`
          : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
Grid.displayName = "Grid";
