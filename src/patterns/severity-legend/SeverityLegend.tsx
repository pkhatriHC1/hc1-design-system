import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * SeverityLegend — the standard color-key row.
 *
 * Every clinical surface that colors data by severity needs a legend so
 * users can map colors back to meaning. The DS ships this one so every
 * product uses the same labels and the same token mapping.
 *
 *   <SeverityLegend />                        // all 5 severities
 *   <SeverityLegend levels={["critical","high","medium"]} />
 *   <SeverityLegend orientation="vertical" /> // for map sidebars
 *
 * Severity values map 1:1 to the --hc-color-severity-* tokens. Do NOT
 * pass a `style` prop overriding a swatch color — the whole point of
 * the legend is that colors match the tokens the rest of the surface
 * consumes.
 */

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "normal";

const DEFAULT_LEVELS: SeverityLevel[] = ["critical", "high", "medium", "low", "normal"];

const LEVEL_META: Record<SeverityLevel, { label: string; text: string; bg: string; border: string }> = {
  critical: {
    label: "Critical",
    text: "var(--hc-color-severity-critical-text)",
    bg: "var(--hc-color-severity-critical-bg)",
    border: "var(--hc-color-severity-critical-border)",
  },
  high: {
    label: "High",
    text: "var(--hc-color-severity-high-text)",
    bg: "var(--hc-color-severity-high-bg)",
    border: "var(--hc-color-severity-high-border)",
  },
  medium: {
    label: "Medium",
    text: "var(--hc-color-severity-medium-text)",
    bg: "var(--hc-color-severity-medium-bg)",
    border: "var(--hc-color-severity-medium-border)",
  },
  low: {
    label: "Low",
    text: "var(--hc-color-severity-low-text)",
    bg: "var(--hc-color-severity-low-bg)",
    border: "var(--hc-color-severity-low-border)",
  },
  normal: {
    label: "Normal",
    text: "var(--hc-color-severity-normal-text)",
    bg: "var(--hc-color-severity-normal-bg)",
    border: "var(--hc-color-severity-normal-border)",
  },
};

export type SeverityLegendProps = HTMLAttributes<HTMLDivElement> & {
  /** Which severity levels to show, in the order given. @default all 5 */
  levels?: SeverityLevel[];
  /**
   * Override the label for a given level (localization, product-specific
   * language). Missing entries fall back to the DS defaults.
   */
  labels?: Partial<Record<SeverityLevel, ReactNode>>;
  /**
   * Layout direction. `horizontal` wraps on narrow viewports.
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Optional heading rendered before the swatches ("Severity", "Risk").
   */
  title?: ReactNode;
  /** Compact — small swatch and label, denser overall padding. @default false */
  compact?: boolean;
};

export function SeverityLegend({
  levels = DEFAULT_LEVELS,
  labels,
  orientation = "horizontal",
  title,
  compact = false,
  className,
  ...rest
}: SeverityLegendProps) {
  const swatchSize = compact ? 10 : 12;
  return (
    <div
      data-slot="severity-legend"
      data-orientation={orientation}
      role="list"
      aria-label={typeof title === "string" ? title : "Severity"}
      className={cn(
        "flex items-center",
        orientation === "vertical" ? "flex-col items-start" : "flex-wrap",
        compact ? "gap-[var(--hc-space-8)]" : "gap-[var(--hc-space-12)]",
        className,
      )}
      {...rest}
    >
      {title && (
        <div
          className={cn(
            "font-semibold uppercase tracking-widest",
            "text-[color:var(--hc-color-text-tertiary)]",
            compact ? "text-[10px]" : "text-[11px]",
          )}
          data-slot="severity-legend-title"
        >
          {title}
        </div>
      )}
      {levels.map((level) => {
        const meta = LEVEL_META[level];
        const label = labels?.[level] ?? meta.label;
        return (
          <div
            key={level}
            role="listitem"
            data-slot="severity-legend-item"
            data-severity={level}
            className="flex items-center gap-1.5"
          >
            <span
              aria-hidden="true"
              className="inline-block shrink-0 rounded-full border"
              style={{
                width: swatchSize,
                height: swatchSize,
                background: meta.bg,
                borderColor: meta.border,
              }}
            />
            <span
              className={cn(
                "font-medium text-[color:var(--hc-color-text-secondary)]",
                compact ? "text-[11px]" : "text-[12px]",
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
