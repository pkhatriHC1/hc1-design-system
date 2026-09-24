import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/**
 * KpiRow — responsive grid wrapper for KpiCards.
 *
 * Renders a CSS grid with `columns` columns on wide screens, falling
 * back to fewer columns as the viewport narrows. Consumers compose
 * `<KpiCard>` children — KpiRow just handles the layout.
 */

export type KpiRowProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Number of columns on wide screens. The row auto-wraps on narrower
   * viewports (2 columns on tablet, 1 column on phone).
   * @default 4
   */
  columns?: 2 | 3 | 4 | 5 | 6;
  /**
   * Gap between cards (px). Also applies between wrapped rows.
   * @default 16
   */
  gap?: number;
};

const COLUMN_CLASSES: Record<NonNullable<KpiRowProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

export const KpiRow = forwardRef<HTMLDivElement, KpiRowProps>(function KpiRow(
  { columns = 4, gap = 16, className, style, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      data-slot="kpi-row"
      className={cn(
        "grid grid-cols-1",
        COLUMN_CLASSES[columns],
        className,
      )}
      style={{ gap, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
});
KpiRow.displayName = "KpiRow";
