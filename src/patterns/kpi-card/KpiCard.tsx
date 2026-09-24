import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "../../utils/cn";
import { Skeleton } from "../../components/skeleton";

/**
 * KpiCard — the standard metric card. Label + value + optional delta +
 * optional sparkline + optional icon, in a bordered surface.
 *
 * Every dashboard opens with a row of these (see KpiRow). The delta
 * automatically colors as success / error based on `positive` — the
 * DS picks the color; consumers only tell it whether up-is-good or
 * down-is-good for this metric.
 *
 *   <KpiCard
 *     label="Total spend"
 *     value="$9.8M"
 *     delta={{ value: 12, direction: "up", label: "vs last month" }}
 *     sparkline={[10, 12, 15, 14, 18, 22, 24]}
 *     icon={<DollarSign />}
 *     onClick={() => navigate("/spend")}
 *   />
 */

/* ══════ Types ═════════════════════════════════════════════════════ */

export type KpiCardDelta = {
  /** Percentage change (e.g. 12 for "+12%"). Sign is derived from `direction`. */
  value: number;
  /**
   * Direction the metric moved. `up`/`down` render an arrow icon;
   * `flat` renders a horizontal arrow with neutral color.
   */
  direction: "up" | "down" | "flat";
  /** Comparison text — "vs last month", "this week", etc. */
  label?: ReactNode;
  /**
   * Which direction is semantically "good" for this metric. Determines
   * the color: matching direction → success green, opposite → error red,
   * flat → neutral.
   *
   * `up` fits growth metrics (revenue, patients seen, uptime).
   * `down` fits cost / wait time / error-rate metrics.
   * @default "up"
   */
  positive?: "up" | "down";
};

export type KpiCardProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
  label: ReactNode;
  value: ReactNode;
  delta?: KpiCardDelta;
  /**
   * Small inline chart of recent values, drawn as an SVG polyline.
   * Sized to fit the corner of the card — a rough visual, not a
   * precise chart. Use ChartCard for a real chart.
   */
  sparkline?: number[];
  /** Leading icon rendered in the top-right of the card. */
  icon?: ReactNode;
  /** Replaces the content with skeleton placeholders. */
  loading?: boolean;
  /** When set, the whole card becomes a button. */
  onClick?: () => void;
  /** Aria-label used when onClick is set and label is not a string. */
  ariaLabel?: string;
};

/* ══════ Component ═════════════════════════════════════════════════ */

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(function KpiCard(
  {
    label,
    value,
    delta,
    sparkline,
    icon,
    loading,
    onClick,
    ariaLabel,
    className,
    ...rest
  },
  forwardedRef,
) {
  const clickable = !!onClick;

  const content = loading ? (
    <div className="flex flex-col gap-2">
      <Skeleton height={12} width={100} radius="4px" />
      <Skeleton height={28} width={140} radius="4px" />
      <Skeleton height={12} width={80} radius="4px" />
    </div>
  ) : (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          data-slot="kpi-card-label"
          className={cn(
            "text-[12px] font-semibold uppercase tracking-widest",
            "text-[color:var(--hc-color-text-tertiary)]",
          )}
        >
          {label}
        </div>
        {icon && (
          <div
            data-slot="kpi-card-icon"
            aria-hidden="true"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              "bg-[color:var(--hc-color-brand-50)] text-[color:var(--hc-color-brand-700)]",
              "[&>svg]:size-4",
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-[var(--hc-space-8)] flex items-end justify-between gap-3">
        <div
          data-slot="kpi-card-value"
          className={cn(
            "text-[28px] font-bold leading-[1.1]",
            "text-[color:var(--hc-color-text-primary)]",
          )}
        >
          {value}
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline
            data={sparkline}
            positive={delta?.positive ?? "up"}
            direction={delta?.direction}
          />
        )}
      </div>

      {delta && (
        <div
          data-slot="kpi-card-delta"
          className="mt-[var(--hc-space-8)] flex items-center gap-1 text-[12px] font-medium"
          style={{ color: deltaColor(delta) }}
        >
          <DeltaIcon direction={delta.direction} />
          <span>
            {delta.value >= 0 && delta.direction !== "flat" && delta.direction === "up" ? "+" : ""}
            {delta.direction === "flat" ? "0" : Math.abs(delta.value)}%
          </span>
          {delta.label && (
            <span
              className="ml-1 font-normal"
              style={{ color: "var(--hc-color-text-tertiary)" }}
            >
              {delta.label}
            </span>
          )}
        </div>
      )}
    </>
  );

  const commonClasses = cn(
    "block w-full rounded-[var(--hc-radius-control)] border p-[var(--hc-space-16)] text-left",
    "border-[color:var(--hc-color-border-subtle)]",
    "bg-[color:var(--hc-color-bg-elevated)]",
    "transition-[background-color,border-color,transform,box-shadow] duration-150 ease-standard motion-reduce:duration-0",
    clickable && [
      "cursor-pointer",
      "hover:border-[color:var(--hc-color-border-default)] hover:shadow-[var(--hc-shadow-sm)]",
      "focus:outline-none focus-visible:outline focus-visible:outline-2",
      "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
      "active:translate-y-px",
    ],
    className,
  );

  if (clickable) {
    return (
      <button
        ref={forwardedRef as unknown as React.Ref<HTMLButtonElement>}
        type="button"
        data-slot="kpi-card"
        aria-busy={loading || undefined}
        aria-label={typeof label === "string" ? label : ariaLabel}
        onClick={onClick}
        className={commonClasses}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      ref={forwardedRef}
      data-slot="kpi-card"
      aria-busy={loading || undefined}
      className={commonClasses}
      {...rest}
    >
      {content}
    </div>
  );
});
KpiCard.displayName = "KpiCard";

/* ══════ Delta helpers ═════════════════════════════════════════════ */

function deltaColor(delta: KpiCardDelta): string {
  if (delta.direction === "flat") return "var(--hc-color-text-tertiary)";
  const positive = delta.positive ?? "up";
  const good = delta.direction === positive;
  return good
    ? "var(--hc-color-status-success-fg)"
    : "var(--hc-color-status-error-fg)";
}

function DeltaIcon({ direction }: { direction: KpiCardDelta["direction"] }) {
  if (direction === "up") return <ArrowUp className="size-3" />;
  if (direction === "down") return <ArrowDown className="size-3" />;
  return <ArrowRight className="size-3" />;
}

/* ══════ Sparkline (SVG polyline) ══════════════════════════════════ */

function Sparkline({
  data,
  positive,
  direction,
}: {
  data: number[];
  positive: "up" | "down";
  direction?: KpiCardDelta["direction"];
}) {
  const w = 72;
  const h = 24;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  /* Match sparkline color to the delta semantics — success when the
     metric is trending in the positive direction, neutral otherwise. */
  const stroke =
    direction === "flat"
      ? "var(--hc-color-text-tertiary)"
      : direction && direction === positive
        ? "var(--hc-color-status-success-fg)"
        : direction
          ? "var(--hc-color-status-error-fg)"
          : "var(--hc-color-brand-500)";

  return (
    <svg
      data-slot="kpi-card-sparkline"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
