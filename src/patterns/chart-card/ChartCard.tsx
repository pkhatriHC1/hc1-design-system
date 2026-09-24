import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "../../utils/cn";
import { Skeleton } from "../../components/skeleton";
import { EmptyState } from "../../components/empty-state";

/**
 * ChartCard — the standard chart-in-a-card wrapper.
 *
 * Card frame with a title + optional description + optional actions
 * strap, and a fixed-height body that hosts a Recharts chart. Handles
 * the loading skeleton, empty state, and ResponsiveContainer wrapping
 * so consumers write the chart itself and get everything else for free.
 *
 *   <ChartCard title="Monthly spend" description="Last 12 months">
 *     <LineChart data={data}>
 *       <CartesianGrid stroke="var(--hc-color-border-subtle)" />
 *       <XAxis dataKey="month" />
 *       <YAxis />
 *       <Tooltip />
 *       <Line dataKey="clinical" stroke="var(--hc-color-chart-1)" />
 *     </LineChart>
 *   </ChartCard>
 *
 * Recharts is an OPTIONAL peer dep — install it in your consumer app.
 * Products that don't ship charts don't pay for it in their bundle.
 */

export type ChartCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Card heading — one line, sentence case ("Monthly spend"). */
  title: ReactNode;
  /** Subheading under the title — timeframe, source, legend. */
  description?: ReactNode;
  /**
   * Right-aligned action slot (timeframe picker, export button,
   * filter menu). Consumer composes any interactive controls here.
   */
  actions?: ReactNode;
  /** Replace the body with a skeleton placeholder. */
  loading?: boolean;
  /**
   * Replace the body with an EmptyState. Use for "no data for the
   * selected timeframe" — the chart wrapper knows the consumer better
   * than an empty Recharts chart does.
   */
  empty?: boolean;
  /** Empty-state message. @default 'No data for this range' */
  emptyMessage?: ReactNode;
  /** Optional empty-state icon. */
  emptyIcon?: ReactNode;
  /**
   * Height of the chart body in px. Consumers rarely change this —
   * dashboards look best when every ChartCard shares a height.
   * @default 240
   */
  height?: number;
  /**
   * The Recharts chart to render (LineChart / BarChart / AreaChart /
   * PieChart / etc.). Must be a single React element — ChartCard
   * wraps it in a ResponsiveContainer so it fills the body width.
   */
  children?: ReactElement;
};

export function ChartCard({
  title,
  description,
  actions,
  loading,
  empty,
  emptyMessage = "No data for this range",
  emptyIcon,
  height = 240,
  children,
  className,
  ...rest
}: ChartCardProps) {
  return (
    <div
      data-slot="chart-card"
      className={cn(
        "flex flex-col rounded-[var(--hc-radius-control)] border",
        "border-[color:var(--hc-color-border-subtle)]",
        "bg-[color:var(--hc-color-bg-elevated)]",
        className,
      )}
      {...rest}
    >
      {(title || description || actions) && (
        <div
          data-slot="chart-card-header"
          className={cn(
            "flex items-start gap-3 p-[var(--hc-space-16)]",
            "border-b border-[color:var(--hc-color-border-subtle)]",
          )}
        >
          <div className="min-w-0 flex-1">
            {title && (
              <div
                data-slot="chart-card-title"
                className={cn(
                  "text-[16px] font-semibold leading-tight",
                  "text-[color:var(--hc-color-text-primary)]",
                )}
              >
                {title}
              </div>
            )}
            {description && (
              <div
                data-slot="chart-card-description"
                className={cn(
                  "mt-0.5 text-[13px] leading-normal",
                  "text-[color:var(--hc-color-text-tertiary)]",
                )}
              >
                {description}
              </div>
            )}
          </div>
          {actions && (
            <div
              data-slot="chart-card-actions"
              className="flex shrink-0 items-center gap-2"
            >
              {actions}
            </div>
          )}
        </div>
      )}

      <ChartCardBody
        loading={loading}
        empty={empty}
        emptyMessage={emptyMessage}
        emptyIcon={emptyIcon}
        height={height}
      >
        {children}
      </ChartCardBody>
    </div>
  );
}

function ChartCardBody({
  loading,
  empty,
  emptyMessage,
  emptyIcon,
  height,
  children,
}: {
  loading?: boolean;
  empty?: boolean;
  emptyMessage: ReactNode;
  emptyIcon?: ReactNode;
  height: number;
  children?: ReactElement;
}) {
  if (loading) {
    return (
      <div
        data-slot="chart-card-body"
        className="flex items-end justify-around gap-2 p-[var(--hc-space-16)]"
        style={{ height }}
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={`${30 + ((i * 7) % 60)}%`}
            radius="4px"
          />
        ))}
      </div>
    );
  }

  if (empty || !children) {
    return (
      <div
        data-slot="chart-card-body"
        className="flex items-center justify-center p-[var(--hc-space-16)]"
        style={{ height }}
      >
        <EmptyState variant="default" layout="contained">
          {emptyIcon && <EmptyState.Icon>{emptyIcon}</EmptyState.Icon>}
          <EmptyState.Title>
            {typeof emptyMessage === "string" ? emptyMessage : "No data"}
          </EmptyState.Title>
          {typeof emptyMessage !== "string" && (
            <EmptyState.Description>{emptyMessage}</EmptyState.Description>
          )}
        </EmptyState>
      </div>
    );
  }

  return (
    <div
      data-slot="chart-card-body"
      className="p-[var(--hc-space-16)]"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
