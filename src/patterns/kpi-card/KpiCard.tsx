import { createContext, forwardRef, useContext } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "../../utils/cn";
import { Skeleton } from "../../components/skeleton";
import { Progress } from "../../components/progress";

/**
 * KpiCard — the one metric card for every hc1 product.
 *
 * FIXED ANATOMY (SourceIQ standard, 2026-11-11). Slots render in this
 * order; products supply data, never layout or colour:
 *
 *   ┌──────────────────────────────────────────┐
 *   │ [icon] LABEL                             │  ← 12px uppercase, grey
 *   │ 9,769,947                    (↗ +12%)    │  ← 24px bold, dark · delta badge
 *   │ across 12 initiatives        Goal: 90%   │  ← 14px supporting · goal label
 *   │ ████████████████████░░░░░                │  ← goal progress
 *   └──────────────────────────────────────────┘
 *
 * THE VARIANT FOLLOWS THE DATA — there is no `variant` prop to get wrong:
 *   basic → label + value
 *   trend → + `delta`   (comparison with an earlier period)
 *   goal  → + `goal`    (progress towards a target)
 * An `icon` is allowed on any variant: a tinted square tile, top-left.
 *
 * COLOUR RULES:
 *   - The value is always dark text. Meaning (good / bad / on track) is
 *     carried only by the delta badge and the goal bar.
 *   - The delta colour is decided here from `positive` — say whether up
 *     is good for this metric; never pick a colour.
 *
 * LAYOUTS: a row of cards in a <Grid>, or one grouped panel with
 * dividers via <KpiGroup> (the SourceIQ dashboard style). Both use the
 * same card. Padding is 24px; `density="compact"` (16px) is only for
 * cards inside drawers and side panels.
 *
 *   <KpiCard
 *     label="Total units transfused"
 *     value="1,049"
 *     delta={{ value: -2.1, direction: "down", positive: "down" }}
 *     supportingText="% vs prior month"
 *     goal={{ label: "Goal: decreasing", progress: 100, status: "on-track" }}
 *   />
 */

/* ══════ Types ═════════════════════════════════════════════════════ */

export type KpiCardDelta = {
  /** Size of the change, e.g. 12 for "+12%". The sign comes from `direction`. */
  value: number;
  /** Which way the metric moved. */
  direction: "up" | "down" | "flat";
  /**
   * Which direction is good for this metric. Decides the badge colour:
   * matching → success, opposite → error, flat → neutral.
   * `up` for revenue, savings, uptime; `down` for cost, wait time, errors.
   * @default "up"
   */
  positive?: "up" | "down";
  /** Unit after the number. @default "%" */
  unit?: string;
  /**
   * @deprecated Put comparison text in `supportingText`
   * ("vs last month"). Still rendered there if supportingText is unset.
   */
  label?: ReactNode;
};

export type KpiCardGoal = {
  /** Goal text shown on the right of the last line, e.g. "Goal: 90%". */
  label: ReactNode;
  /** Progress towards the goal, 0–100. */
  progress: number;
  /**
   * How the metric is tracking. Colours the bar.
   * @default "on-track"
   */
  status?: "on-track" | "at-risk" | "off-track";
};

export type KpiCardProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "style" | "className" | "children"> & {
  /** Short noun phrase, sentence case in source (rendered uppercase). */
  label: ReactNode;
  /** The figure — pre-formatted ("$9.8M", "1,049", "88.3%"). */
  value: ReactNode;
  /** Optional lucide icon, rendered in a tinted square tile beside the label. */
  icon?: ReactNode;
  /** Change vs an earlier period → `trend` variant. */
  delta?: KpiCardDelta;
  /** One supporting line under the value ("across 12 initiatives"). */
  supportingText?: ReactNode;
  /** Progress towards a target → `goal` variant. */
  goal?: KpiCardGoal;
  /** Small trend line beside the value (trend variant only). */
  sparkline?: number[];
  /** Replaces the content with skeleton placeholders. */
  loading?: boolean;
  /** Makes the whole card a button (e.g. drill into the metric). */
  onClick?: () => void;
  /** Accessible name when `onClick` is set and `label` isn't a string. */
  ariaLabel?: string;
  /** `compact` (16px padding) only inside drawers and side panels. @default "default" */
  density?: "default" | "compact";
};

/** Inside a KpiGroup, cards drop their own frame and share the group's. */
const GroupContext = createContext(false);

/* ══════ KpiCard ═══════════════════════════════════════════════════ */

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(function KpiCard(
  {
    label,
    value,
    icon,
    delta,
    supportingText,
    goal,
    sparkline,
    loading,
    onClick,
    ariaLabel,
    density = "default",
    ...rest
  },
  forwardedRef,
) {
  const inGroup = useContext(GroupContext);
  const clickable = !!onClick;
  const variant = goal ? "goal" : delta ? "trend" : "basic";
  const supporting = supportingText ?? delta?.label;

  const content = loading ? (
    <div className="flex flex-col gap-[var(--hc-space-8)]">
      <Skeleton height={12} width={100} radius="4px" />
      <Skeleton height={28} width={140} radius="4px" />
      <Skeleton height={14} width={120} radius="4px" />
    </div>
  ) : (
    <div className="flex flex-col gap-[var(--hc-space-8)]">
      {/* Row 1 — icon + label */}
      <div className="flex min-w-0 items-center gap-[var(--hc-space-8)]">
        {icon && (
          <span
            data-slot="kpi-card-icon"
            aria-hidden="true"
            className={cn(
              "inline-flex size-[var(--hc-space-32)] shrink-0 items-center justify-center",
              "rounded-[var(--hc-radius-control)]",
              "bg-[color:var(--hc-color-brand-50)] text-[color:var(--hc-color-brand-700)]",
              "[&>svg]:size-[var(--hc-space-16)]",
            )}
          >
            {icon}
          </span>
        )}
        <span
          data-slot="kpi-card-label"
          className={cn(
            "min-w-0 text-[12px] font-semibold uppercase leading-[1.4] tracking-[0.06em]",
            "text-[color:var(--hc-color-text-tertiary)]",
          )}
        >
          {label}
        </span>
      </div>

      {/* Row 2 — value + delta badge (+ sparkline) */}
      <div className="flex items-center justify-between gap-[var(--hc-space-12)]">
        <span
          data-slot="kpi-card-value"
          className={cn(
            "min-w-0 truncate text-[24px] font-bold leading-[1.2]",
            "text-[color:var(--hc-color-text-primary)] [font-variant-numeric:tabular-nums]",
          )}
        >
          {value}
        </span>
        {(delta || (sparkline && sparkline.length > 1)) && (
          <span className="flex shrink-0 items-center gap-[var(--hc-space-8)]">
            {sparkline && sparkline.length > 1 && delta && (
              <Sparkline data={sparkline} positive={delta.positive ?? "up"} direction={delta.direction} />
            )}
            {delta && <DeltaBadge delta={delta} />}
          </span>
        )}
      </div>

      {/* Row 3 — supporting text + goal label */}
      {(supporting || goal) && (
        <div className="flex items-baseline justify-between gap-[var(--hc-space-12)]">
          <span
            data-slot="kpi-card-supporting"
            className="min-w-0 text-[14px] leading-[1.4] text-[color:var(--hc-color-text-supporting)]"
          >
            {supporting}
          </span>
          {goal && (
            <span
              data-slot="kpi-card-goal-label"
              className="shrink-0 text-[14px] font-semibold text-[color:var(--hc-color-text-primary)]"
            >
              {goal.label}
            </span>
          )}
        </div>
      )}

      {/* Row 4 — goal progress */}
      {goal && (
        <Progress
          value={Math.max(0, Math.min(100, goal.progress))}
          tone={goalTone(goal.status)}
          size="md"
          aria-label={typeof label === "string" ? `${label} progress to goal` : "Progress to goal"}
        />
      )}
    </div>
  );

  const frameClasses = cn(
    "block w-full text-left",
    inGroup
      ? "p-[var(--hc-space-24)]"
      : cn(
          "rounded-[var(--hc-radius-surface)] border",
          "border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-elevated)]",
          density === "compact" ? "p-[var(--hc-space-16)]" : "p-[var(--hc-space-24)]",
        ),
    "transition-[background-color,border-color] duration-150 ease-standard motion-reduce:duration-0",
    clickable && [
      "cursor-pointer",
      inGroup
        ? "hover:bg-[color:var(--hc-color-bg-subtle)]"
        : "hover:border-[color:var(--hc-color-border-strong)]",
      "focus:outline-none focus-visible:outline focus-visible:outline-2",
      "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
    ],
  );

  if (clickable) {
    return (
      <button
        ref={forwardedRef as unknown as React.Ref<HTMLButtonElement>}
        type="button"
        data-slot="kpi-card"
        data-variant={variant}
        aria-busy={loading || undefined}
        aria-label={typeof label === "string" ? label : ariaLabel}
        onClick={onClick}
        className={frameClasses}
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
      data-variant={variant}
      aria-busy={loading || undefined}
      className={frameClasses}
      {...rest}
    >
      {content}
    </div>
  );
});
KpiCard.displayName = "KpiCard";

/* ══════ KpiGroup ══════════════════════════════════════════════════ */

export type KpiGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "style" | "className"> & {
  /** 2–4 KpiCards. They share one frame, split by dividers. */
  children: ReactNode;
};

/**
 * KpiGroup — several KpiCards in one panel with dividers (the SourceIQ
 * dashboard "Identified / Realized / Still to capture" style). Columns
 * stack on small screens.
 */
export function KpiGroup({ children, ...rest }: KpiGroupProps) {
  return (
    <GroupContext.Provider value={true}>
      <div
        data-slot="kpi-group"
        className={cn(
          "grid grid-cols-1 overflow-hidden md:auto-cols-fr md:grid-flow-col",
          "rounded-[var(--hc-radius-surface)] border",
          "border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-elevated)]",
          "divide-y divide-[color:var(--hc-color-border-default)] md:divide-x md:divide-y-0",
        )}
        {...rest}
      >
        {children}
      </div>
    </GroupContext.Provider>
  );
}

/* ══════ Pieces ════════════════════════════════════════════════════ */

function DeltaBadge({ delta }: { delta: KpiCardDelta }) {
  const tone = deltaTone(delta);
  const sign = delta.direction === "up" ? "+" : delta.direction === "down" ? "−" : "";
  const amount = delta.direction === "flat" ? 0 : Math.abs(delta.value);
  return (
    <span
      data-slot="kpi-card-delta"
      data-tone={tone}
      className={cn(
        "inline-flex items-center gap-[var(--hc-space-4)] rounded-[var(--hc-radius-circular)]",
        "px-[var(--hc-space-8)] py-[2px] text-[12px] font-semibold [font-variant-numeric:tabular-nums]",
        tone === "success" && "bg-[color:var(--hc-color-status-success-bg)] text-[color:var(--hc-color-status-success-fg)]",
        tone === "error" && "bg-[color:var(--hc-color-status-error-bg)] text-[color:var(--hc-color-status-error-fg)]",
        tone === "neutral" && "bg-[color:var(--hc-color-bg-subtle)] text-[color:var(--hc-color-text-tertiary)]",
      )}
    >
      <DeltaIcon direction={delta.direction} />
      {sign}
      {amount}
      {delta.unit ?? "%"}
    </span>
  );
}

function deltaTone(delta: KpiCardDelta): "success" | "error" | "neutral" {
  if (delta.direction === "flat") return "neutral";
  return delta.direction === (delta.positive ?? "up") ? "success" : "error";
}

function goalTone(status: KpiCardGoal["status"] = "on-track") {
  return status === "off-track" ? "danger" : status === "at-risk" ? "warning" : "success";
}

function DeltaIcon({ direction }: { direction: KpiCardDelta["direction"] }) {
  if (direction === "up") return <ArrowUp aria-hidden="true" className="size-3" />;
  if (direction === "down") return <ArrowDown aria-hidden="true" className="size-3" />;
  return <ArrowRight aria-hidden="true" className="size-3" />;
}

/* ══════ Sparkline (SVG polyline) ══════════════════════════════════ */

function Sparkline({
  data,
  positive,
  direction,
}: {
  data: number[];
  positive: "up" | "down";
  direction: KpiCardDelta["direction"];
}) {
  const w = 64;
  const h = 24;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const points = data
    .map((v, i) => `${(pad + i * step).toFixed(1)},${(h - pad - ((v - min) / range) * (h - pad * 2)).toFixed(1)}`)
    .join(" ");
  const stroke =
    direction === "flat"
      ? "var(--hc-color-text-tertiary)"
      : direction === positive
        ? "var(--hc-color-status-success-fg)"
        : "var(--hc-color-status-error-fg)";
  return (
    <svg data-slot="kpi-card-sparkline" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
