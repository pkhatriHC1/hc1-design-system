import { useId, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../../utils/cn";
import { Popover } from "../popover";
import { Calendar } from "../calendar";

/**
 * DatePicker — a form field that opens the hc1 Calendar to pick one date.
 *
 * Looks like Input (36px, radius 8, label 14px medium 6px above). The
 * field shows the chosen date; clicking it opens a one-month calendar in
 * a Popover, and picking a day closes it. Use this for every date field
 * — never a native `<input type="date">`.
 *
 *   <DatePicker label="Next report date" value={date} onChange={setDate} />
 *
 * For a date *range* on a dashboard, use the TimeRangeFilter pattern.
 */
export type DatePickerProps = {
  /** The selected date, or undefined. */
  value?: Date;
  onChange: (date: Date | undefined) => void;
  /** Visible label above the field. */
  label?: ReactNode;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  /** @default "Select a date" */
  placeholder?: string;
  /** Earliest selectable date. */
  minDate?: Date;
  /** Latest selectable date. */
  maxDate?: Date;
  disabled?: boolean;
};

const format = (d: Date) =>
  new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(d);

export function DatePicker({
  value,
  onChange,
  label,
  ariaLabel,
  placeholder = "Select a date",
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const disabledDays = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div data-slot="date-picker" className="inline-flex w-full min-w-0 flex-col gap-[var(--hc-field-label-gap)] [font-family:var(--hc-font-sans)]">
      {label != null && (
        <span id={labelId} className="text-[14px] font-medium leading-[1.4] text-[color:var(--hc-color-text-primary)]">
          {label}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen} placement="bottom">
        <Popover.Trigger>
          <button
            type="button"
            disabled={disabled}
            aria-labelledby={label != null ? labelId : undefined}
            aria-label={label == null ? ariaLabel : undefined}
            aria-haspopup="dialog"
            className={cn(
              "flex h-[var(--hc-field-height)] w-full min-w-0 items-center gap-[var(--hc-space-8)] px-[var(--hc-space-12)]",
              "rounded-[var(--hc-radius-control)] border border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-surface)]",
              "text-left text-[14px] cursor-pointer",
              "transition-[border-color,outline-color] duration-150 ease-standard motion-reduce:duration-0",
              "hover:border-[color:var(--hc-color-border-strong)]",
              "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--hc-color-border-focus)]",
              "disabled:cursor-not-allowed disabled:bg-[color:var(--hc-color-bg-subtle)] disabled:text-[color:var(--hc-color-text-disabled)]",
              open && "border-[color:var(--hc-color-border-focus)]",
            )}
          >
            <CalendarDays aria-hidden="true" className="size-[var(--hc-space-16)] shrink-0 text-[color:var(--hc-color-text-tertiary)]" />
            <span className={cn("min-w-0 flex-1 truncate", value ? "text-[color:var(--hc-color-text-primary)]" : "text-[color:var(--hc-color-text-tertiary)]")}>
              {value ? format(value) : placeholder}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Content arrow={false} maxWidth="none" ariaLabel="Choose a date" {...({ align: "start" } as object)}>
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d: Date | undefined) => { onChange(d); setOpen(false); }}
            defaultMonth={value}
            disabled={disabledDays.length ? disabledDays : undefined}
          />
        </Popover.Content>
      </Popover>
    </div>
  );
}
