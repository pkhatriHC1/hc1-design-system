import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { DateRange, DayPickerProps } from "react-day-picker";
import { cn } from "../../utils/cn";

export type { DateRange };

/**
 * Calendar — the hc1 date grid (single date or a range).
 *
 * Built on react-day-picker (the library shadcn's Calendar uses), styled
 * only with DS tokens. It handles keyboard navigation, ARIA grid roles
 * and screen-reader labels. Use it inside a Popover; for time-range
 * filters use the TimeRangeFilter pattern, which wraps this for you.
 *
 *   <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />
 *
 * There is no className or style: every product's calendar looks the same.
 */
/* Distributive Omit keeps DayPicker's mode-specific unions (single / range / multiple) intact. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type CalendarProps = DistributiveOmit<DayPickerProps, "className" | "style" | "classNames" | "styles" | "components">;

const dayButton = cn(
  "inline-flex size-[var(--hc-space-32)] items-center justify-center",
  "rounded-[var(--hc-radius-control)] border-0 bg-transparent p-0",
  "text-[14px] font-medium text-[color:var(--hc-color-text-primary)] [font-variant-numeric:tabular-nums]",
  "cursor-pointer hover:bg-[color:var(--hc-color-bg-subtle)]",
  "focus:outline-none focus-visible:outline focus-visible:outline-2",
  "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-1",
  "disabled:cursor-not-allowed disabled:text-[color:var(--hc-color-text-disabled)] disabled:hover:bg-transparent",
);

const navButton = cn(
  "absolute top-0 inline-flex size-[var(--hc-space-32)] items-center justify-center",
  "rounded-[var(--hc-radius-control)] border-0 bg-transparent p-0 cursor-pointer",
  "text-[color:var(--hc-color-text-secondary)] hover:bg-[color:var(--hc-color-bg-subtle)]",
  "focus:outline-none focus-visible:outline focus-visible:outline-2",
  "focus-visible:outline-[color:var(--hc-color-border-focus)]",
  "disabled:opacity-40 disabled:cursor-not-allowed",
);

export function Calendar(props: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      {...(props as DayPickerProps)}
      classNames={{
        root: "relative [font-family:var(--hc-font-sans)]",
        months: "flex flex-col gap-[var(--hc-space-24)] sm:flex-row",
        month: "flex flex-col gap-[var(--hc-space-12)]",
        month_caption: "flex h-[var(--hc-space-32)] items-center justify-center",
        caption_label: "text-[14px] font-semibold text-[color:var(--hc-color-text-primary)]",
        nav: "absolute inset-x-0 top-0 z-[1] flex justify-between",
        button_previous: cn(navButton, "left-0"),
        button_next: cn(navButton, "right-0"),
        chevron: "size-[var(--hc-space-16)]",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-[var(--hc-space-32)] pb-[var(--hc-space-4)] text-center text-[12px] font-medium text-[color:var(--hc-color-text-tertiary)]",
        weeks: "flex flex-col gap-[2px]",
        week: "flex",
        day: "relative p-0 text-center",
        day_button: dayButton,
        today: "[&>button]:font-bold [&>button]:text-[color:var(--hc-color-text-link)]",
        outside: "[&>button]:text-[color:var(--hc-color-text-disabled)]",
        disabled: "",
        hidden: "invisible",
        selected:
          "[&>button]:bg-[color:var(--hc-color-brand-800)] [&>button]:text-[color:var(--hc-color-text-on-solid)] [&>button]:hover:bg-[color:var(--hc-color-brand-800)]",
        range_start: "rounded-l-[var(--hc-radius-control)] bg-[color:var(--hc-color-brand-50)]",
        range_end: "rounded-r-[var(--hc-radius-control)] bg-[color:var(--hc-color-brand-50)]",
        range_middle:
          "bg-[color:var(--hc-color-brand-50)] [&>button]:!bg-transparent [&>button]:!text-[color:var(--hc-color-text-primary)] [&>button]:rounded-none",
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft aria-hidden="true" className="size-[var(--hc-space-16)]" />
          ) : (
            <ChevronRight aria-hidden="true" className="size-[var(--hc-space-16)]" />
          ),
      }}
    />
  );
}
