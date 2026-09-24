import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * DashboardHero — the standard dashboard landing template.
 *
 * Four vertically-stacked regions with an opinionated two-column split
 * on the primary/secondary chart row:
 *
 *   ┌───────────────────────────────────────────────────────────┐
 *   │ header (PageHeader)                                       │
 *   ├───────────────────────────────────────────────────────────┤
 *   │ kpis   (KpiRow)                                           │
 *   ├──────────────────────────────┬────────────────────────────┤
 *   │ primary (ChartCard)          │ secondary (ChartCard)      │
 *   │ ── 2/3 width on wide screens │ 1/3 width                  │
 *   └──────────────────────────────┴────────────────────────────┘
 *
 * If `secondary` is omitted, `primary` stretches full-width. On narrow
 * viewports both columns stack vertically.
 *
 *   <DashboardHero
 *     header={<PageHeader title="Overview" actions={<Button>Refresh</Button>} />}
 *     kpis={<KpiRow>…</KpiRow>}
 *     primary={<ChartCard title="Revenue">…</ChartCard>}
 *     secondary={<ChartCard title="Breakdown">…</ChartCard>}
 *   />
 */

export type DashboardHeroProps = HTMLAttributes<HTMLDivElement> & {
  /** The top strap — typically an HC1 PageHeader. */
  header?: ReactNode;
  /** The KPI row — typically an HC1 KpiRow. */
  kpis?: ReactNode;
  /**
   * The primary chart card. On wide screens takes 2/3 of the row when
   * `secondary` is present, full-width when it isn't.
   */
  primary?: ReactNode;
  /**
   * The secondary chart / drill-down. On wide screens takes 1/3 width;
   * stacks below primary on narrow viewports.
   */
  secondary?: ReactNode;
  /** Anything additional below the primary/secondary row (tables, lists). */
  children?: ReactNode;
  /** Vertical gap between regions in px. @default 24 */
  gap?: number;
};

export function DashboardHero({
  header,
  kpis,
  primary,
  secondary,
  children,
  gap = 24,
  className,
  style,
  ...rest
}: DashboardHeroProps) {
  return (
    <div
      data-slot="dashboard-hero"
      className={cn("flex flex-col", className)}
      style={{ gap, ...style }}
      {...rest}
    >
      {header && (
        <div data-slot="dashboard-hero-header" className="min-w-0">
          {header}
        </div>
      )}
      {kpis && (
        <div data-slot="dashboard-hero-kpis" className="min-w-0">
          {kpis}
        </div>
      )}
      {(primary || secondary) && (
        <div
          data-slot="dashboard-hero-charts"
          className={cn(
            "grid grid-cols-1 min-w-0",
            secondary ? "lg:grid-cols-3" : "",
          )}
          style={{ gap }}
        >
          {primary && (
            <div
              data-slot="dashboard-hero-primary"
              className={cn("min-w-0", secondary && "lg:col-span-2")}
            >
              {primary}
            </div>
          )}
          {secondary && (
            <div data-slot="dashboard-hero-secondary" className="min-w-0">
              {secondary}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
