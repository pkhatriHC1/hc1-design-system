import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * PageTemplate — the standard page layout for every hc1 product.
 *
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
 *   │ children (main)                  │ aside (rail)      │
 *   │ ── 2/3 width when aside present  │ 1/3 width         │
 *   └──────────────────────────────────┴───────────────────┘
 *
 * SPACING IS OWNED HERE (SourceIQ standard, 2026-11-11). The template
 * sets every vertical gap on the page: 24px between the header and the
 * first section (`--hc-page-header-gap`) and 24px between sections
 * (`--hc-page-section-gap`). Screens never add their own margins
 * between sections — pass several sections as children and they are
 * spaced automatically. There is no `gap` prop on purpose.
 *
 * Two variants:
 *   default — full-width page (dashboards, queues, analytics)
 *   focused — one centred 896px column (`--hc-page-focused-width`) with
 *             an optional sticky action footer (detail pages, action
 *             plans, multi-step flows)
 *
 * Dashboard:
 *   <PageTemplate
 *     header={<PageHeader title="Supply Chain Dashboard" subtitle="…" />}
 *     widgets={<Grid columns={4}>…KpiCards…</Grid>}
 *   >
 *     <ChartCard>…</ChartCard>
 *     <Card>…</Card>
 *   </PageTemplate>
 *
 * Focused detail page:
 *   <PageTemplate
 *     variant="focused"
 *     header={<PageHeader title="Cepheid renewal window closing" />}
 *     footer={{ meta: "Due December 11, 2026", actions: <>…</> }}
 *   >
 *     <Card>…</Card>
 *   </PageTemplate>
 */
export type PageTemplateProps = Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
  /** Layout variant. @default 'default' */
  variant?: "default" | "focused";
  /** Identity strip, mini nav or banner above the header. */
  eyebrow?: ReactNode;
  /** The page header — always a `<PageHeader>`. */
  header?: ReactNode;
  /** KPI row, filter chips or stats directly under the header. */
  widgets?: ReactNode;
  /** Right rail (default variant only). Main content takes 2/3. */
  aside?: ReactNode;
  /** Sections of the page. Each direct child is spaced 24px apart. */
  children?: ReactNode;
  /**
   * Sticky action footer (focused variant only): meta on the left
   * (e.g. a due date), actions on the right (secondary, then primary).
   */
  footer?: { meta?: ReactNode; actions?: ReactNode };
};

export function PageTemplate({
  variant = "default",
  eyebrow,
  header,
  widgets,
  aside,
  children,
  footer,
  className,
  ...rest
}: PageTemplateProps) {
  const focused = variant === "focused";
  const showAside = !!aside && !focused;

  const column = (
    <div
      data-slot="page-template"
      data-variant={variant}
      className={cn(
        "flex flex-col gap-[var(--hc-page-section-gap)]",
        focused && "mx-auto w-full max-w-[var(--hc-page-focused-width)]",
        /* With a footer, the column fills the viewport so the footer
           rests on the bottom edge even when the page is short. */
        focused && footer &&
          "min-h-[calc(100dvh-var(--hc-shell-topbar-height)-var(--hc-page-pad)-var(--hc-page-section-gap)-var(--hc-page-footer-height))]",
        className,
      )}
      {...rest}
    >
      {eyebrow && (
        <div data-slot="page-template-eyebrow" className="min-w-0">
          {eyebrow}
        </div>
      )}
      {header && (
        <div
          data-slot="page-template-header"
          className="min-w-0 [&+*]:mt-[calc(var(--hc-page-header-gap)-var(--hc-page-section-gap))]"
        >
          {header}
        </div>
      )}
      {widgets && (
        <div data-slot="page-template-widgets" className="min-w-0">
          {widgets}
        </div>
      )}
      {(children || showAside) && (
        <div
          data-slot="page-template-body"
          className={cn(
            "grid min-w-0 grid-cols-1 gap-[var(--hc-page-section-gap)]",
            showAside && "lg:grid-cols-3",
          )}
        >
          {children && (
            <div
              data-slot="page-template-main"
              className={cn(
                "flex min-w-0 flex-col gap-[var(--hc-page-section-gap)]",
                showAside && "lg:col-span-2",
              )}
            >
              {children}
            </div>
          )}
          {showAside && (
            <div
              data-slot="page-template-aside"
              className="flex min-w-0 flex-col gap-[var(--hc-page-section-gap)]"
            >
              {aside}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!(focused && footer)) return column;

  return (
    <>
      {column}
      <div
        data-slot="page-template-footer"
        className={cn(
          /* Bleeds to the edges of AppShell.Main and pins to its bottom. */
          "sticky bottom-[calc(-1*var(--hc-page-pad))] z-[1]",
          "-mx-[var(--hc-page-pad)] -mb-[var(--hc-page-pad)] mt-[var(--hc-page-section-gap)]",
          "border-t border-[color:var(--hc-color-border-default)]",
          "bg-[color:var(--hc-color-bg-surface)]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[calc(var(--hc-page-focused-width)+2*var(--hc-page-pad))]",
            "h-[var(--hc-page-footer-height)] items-center justify-between gap-[var(--hc-space-12)]",
            "px-[var(--hc-page-pad)]",
          )}
        >
          <div className="min-w-0 text-[14px] text-[color:var(--hc-color-text-supporting)]">
            {footer.meta}
          </div>
          <div className="flex shrink-0 items-center gap-[var(--hc-space-8)]">
            {footer.actions}
          </div>
        </div>
      </div>
    </>
  );
}
