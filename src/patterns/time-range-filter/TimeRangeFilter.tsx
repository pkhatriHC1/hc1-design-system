import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../../utils/cn";
import { Popover } from "../../components/popover";
import { Button } from "../../components/button";
import { Calendar } from "../../components/calendar";
import type { DateRange } from "../../components/calendar";

/**
 * TimeRangeFilter — the standard time-range switcher for dashboards.
 *
 * Segmented pills for preset ranges, plus an optional "Custom" pill that
 * opens a two-month range calendar straight away. After Apply, the
 * Custom pill shows the chosen dates. Put it in PageHeader's `actions`
 * slot so it sits on the title row.
 *
 *   <PageHeader
 *     title="Supply Chain Dashboard"
 *     actions={
 *       <TimeRangeFilter
 *         options={[{ value: "30d", label: "30 Days" }, { value: "12m", label: "12 Months" }]}
 *         value={range}
 *         onValueChange={setRange}
 *         customRange={custom}
 *         onCustomRangeChange={setCustom}
 *       />
 *     }
 *   />
 *
 * The Custom pill appears only when `onCustomRangeChange` is passed.
 * Selecting a custom range sets `value` to "custom".
 */
export type TimeRangeOption = { value: string; label: string };

export type TimeRangeFilterProps = {
  /** Preset ranges, in display order. */
  options: TimeRangeOption[];
  /** The selected preset value, or "custom". */
  value: string;
  onValueChange: (value: string) => void;
  /** The applied custom range (shown on the Custom pill). */
  customRange?: DateRange;
  /** Enables the Custom pill. Called with the range when the user clicks Apply. */
  onCustomRangeChange?: (range: DateRange) => void;
  /** @default "Custom" */
  customLabel?: string;
  /** Latest selectable date. @default today */
  maxDate?: Date;
  /** Accessible name for the group. @default "Time range" */
  ariaLabel?: string;
};

export const CUSTOM_RANGE_VALUE = "custom";

const pill = cn(
  "inline-flex h-[var(--hc-field-height)] items-center gap-[var(--hc-space-8)] px-[var(--hc-space-12)]",
  "rounded-[var(--hc-radius-control)] border-0 cursor-pointer whitespace-nowrap",
  "text-[12px] font-semibold [font-family:var(--hc-font-sans)]",
  "focus:outline-none focus-visible:outline focus-visible:outline-2",
  "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
);
const pillOff = "bg-transparent text-[color:var(--hc-color-text-tertiary)] hover:bg-[color:var(--hc-color-bg-subtle)] hover:text-[color:var(--hc-color-text-primary)]";
const pillOn = "bg-[color:var(--hc-color-brand-800)] text-[color:var(--hc-color-text-on-solid)]";

const fmt = (d: Date, withYear: boolean) =>
  new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) }).format(d);

export function formatDateRange(range?: DateRange): string | undefined {
  if (!range?.from) return undefined;
  if (!range.to) return fmt(range.from, true);
  const sameYear = range.from.getFullYear() === range.to.getFullYear();
  return `${fmt(range.from, !sameYear)} – ${fmt(range.to, true)}`;
}

export function TimeRangeFilter({
  options,
  value,
  onValueChange,
  customRange,
  onCustomRangeChange,
  customLabel = "Custom",
  maxDate,
  ariaLabel = "Time range",
}: TimeRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(customRange);
  const customActive = value === CUSTOM_RANGE_VALUE;

  /* Each time the calendar opens, start from the applied range. */
  useEffect(() => {
    if (open) setDraft(customRange);
  }, [open, customRange]);

  const latest = maxDate ?? new Date();
  const applied = customActive ? formatDateRange(customRange) : undefined;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="time-range-filter"
      className="inline-flex flex-wrap items-center gap-[var(--hc-space-4)]"
    >
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onValueChange(o.value)}
            className={cn(pill, on ? pillOn : pillOff)}
          >
            {o.label}
          </button>
        );
      })}

      {onCustomRangeChange && (
        <Popover open={open} onOpenChange={setOpen} placement="bottom">
          <Popover.Trigger>
            <button
              type="button"
              aria-pressed={customActive}
              aria-label={applied ? `${customLabel}: ${applied}` : `${customLabel} range`}
              className={cn(pill, customActive ? pillOn : pillOff)}
            >
              <CalendarDays aria-hidden="true" className="size-[var(--hc-space-16)]" />
              {applied ?? customLabel}
            </button>
          </Popover.Trigger>
          <Popover.Content
            arrow={false}
            maxWidth="none"
            ariaLabel="Choose a date range"
            {...({ align: "end" } as object)}
          >
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={draft}
              onSelect={setDraft}
              defaultMonth={draft?.from ?? new Date(latest.getFullYear(), latest.getMonth() - 1, 1)}
              disabled={{ after: latest }}
              endMonth={latest}
            />
            <div className="mt-[var(--hc-space-16)] flex items-center justify-between gap-[var(--hc-space-12)] border-t border-[color:var(--hc-color-border-subtle)] pt-[var(--hc-space-16)]">
              <span className="text-[14px] text-[color:var(--hc-color-text-supporting)]">
                {formatDateRange(draft) ?? "Select a start and end date"}
              </span>
              <div className="flex items-center gap-[var(--hc-space-8)]">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!draft?.from || !draft?.to}
                  onClick={() => {
                    if (!draft?.from || !draft?.to) return;
                    onCustomRangeChange(draft);
                    onValueChange(CUSTOM_RANGE_VALUE);
                    setOpen(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </Popover.Content>
        </Popover>
      )}
    </div>
  );
}
