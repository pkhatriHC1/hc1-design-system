import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * PageTemplate — the standard page layout.
 *
 * Merges the previous `DashboardHero` (dashboard landing) and `DetailPage`
 * (record-detail template) into one primitive with generic slot names.
 * Five optional slots stacked vertically with a two-column split on the
 * `children` + `aside` row:
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ eyebrow — identity strip, mini nav, banner           │
 *   ├──────────────────────────────────────────────────────┤
 *   │ header — PageHeader (title + breadcrumb + tabs)      │
 *   ├──────────────────────────────────────────────────────┤
 *   │ widgets — KPI row, filter chips, stats               │
 *   ├──────────────────────────────────┬───────────────────┤
 *   │                                  │                   │
 *   │ children (main)                  │ aside (rail)      │
 *   │ ── 2/3 width when aside present  │ 1/3 width         │
 *   │                                  │                   │
 *   └──────────────────────────────────┴───────────────────┘
 *
 * Every slot is optional — pass what you need, omit the rest.
 *
 * Fits a dashboard:
 *   <PageTemplate
 *     header={<PageHeader title="Overview" />}
 *     widgets={<Grid columns={4}>…KpiCards…</Grid>}
 *     aside={<ChartCard>secondary chart</ChartCard>}
 *   >
 *     <ChartCard>primary chart</ChartCard>
 *   </PageTemplate>
 *
 * Fits a detail page:
 *   <PageTemplate
 *     eyebrow={<PatientIdentityStrip … />}
 *     header={<PageHeader title="Alicia Reyes" tabs={<Tabs>…</Tabs>} />}
 *     aside={<Card>Care team</Card>}
 *   >
 *     <Card>Main tab content</Card>
 *   </PageTemplate>
 */

export type PageTemplateProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Top strap — identity strip, breadcrumb crumbs, mini nav.
   * Renders above the header.
   */
  eyebrow?: ReactNode;
  /**
   * Primary header — typically an HC1 PageHeader with title +
   * breadcrumb + tabs + actions.
   */
  header?: ReactNode;
  /**
   * Widget row between header and the main body — KPI Grid, filter
   * chips, stats callouts.
   */
  widgets?: ReactNode;
  /**
   * Right rail. On wide screens takes 1/3 width; stacks below children
   * on narrow viewports. Use for secondary charts (dashboard),
   * metadata cards (detail page), or drill-down slots.
   */
  aside?: ReactNode;
  /**
   * Main content region. When `aside` is present, takes 2/3 width on
   * wide screens; otherwise stretches full-width.
   */
  children?: ReactNode;
  /** Vertical gap between regions in px. @default 24 */
  gap?: number;
};

export function PageTemplate({
  eyebrow,
  header,
  widgets,
  aside,
  children,
  gap = 24,
  className,
  style,
  ...rest
}: PageTemplateProps) {
  return (
    <div
      data-slot="page-template"
      className={cn("flex flex-col", className)}
      style={{ gap, ...style }}
      {...rest}
    >
      {eyebrow && (
        <div data-slot="page-template-eyebrow" className="min-w-0">
          {eyebrow}
        </div>
      )}
      {header && (
        <div data-slot="page-template-header" className="min-w-0">
          {header}
        </div>
      )}
      {widgets && (
        <div data-slot="page-template-widgets" className="min-w-0">
          {widgets}
        </div>
      )}
      {(children || aside) && (
        <div
          data-slot="page-template-body"
          className={cn(
            "grid grid-cols-1 min-w-0",
            aside && "lg:grid-cols-3",
          )}
          style={{ gap }}
        >
          {children && (
            <div
              data-slot="page-template-main"
              className={cn("min-w-0", aside && "lg:col-span-2")}
            >
              {children}
            </div>
          )}
          {aside && (
            <div data-slot="page-template-aside" className="min-w-0">
              {aside}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
