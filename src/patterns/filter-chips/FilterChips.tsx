import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * FilterChips — a row of toggle chips that filter the content below.
 *
 * Each chip shows a label, an optional icon and an optional meta line
 * (e.g. "6 · 1,422,696"). Clicking a chip selects it; clicking the
 * selected chip clears the filter. One chip at a time (single select).
 *
 *   <FilterChips
 *     ariaLabel="Initiative category"
 *     options={[
 *       { value: "contract_watchdog", label: "Contract Watchdog", meta: "6 · 1,422,696", icon: <FileText /> },
 *       { value: "price_variance", label: "Price Variance", meta: "5 · 184,416", icon: <DollarSign /> },
 *     ]}
 *     value={category}            // null = no filter
 *     onValueChange={setCategory}
 *   />
 *
 * Use FilterChips for a handful of visible, one-click filters with a
 * summary each. For many options or several filters at once, use
 * FilterBar with Select/Combobox instead.
 */
export type FilterChipOption = {
  value: string;
  label: ReactNode;
  /** Small second line, e.g. a count and total. */
  meta?: ReactNode;
  /** Optional lucide icon. */
  icon?: ReactNode;
};

export type FilterChipsProps = {
  options: FilterChipOption[];
  /** Selected value, or null for no filter. */
  value: string | null;
  onValueChange: (value: string | null) => void;
  /** Accessible name for the group. */
  ariaLabel: string;
  /** Shows a "Clear" chip while a filter is active. @default true */
  showClear?: boolean;
};

export function FilterChips({ options, value, onValueChange, ariaLabel, showClear = true }: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="filter-chips"
      className="flex flex-wrap items-stretch gap-[var(--hc-space-8)] [font-family:var(--hc-font-sans)]"
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onValueChange(selected ? null : o.value)}
            className={cn(
              "inline-flex min-h-[var(--hc-field-height)] items-center gap-[var(--hc-space-8)] text-left",
              "rounded-[var(--hc-radius-control)] border px-[var(--hc-space-12)] py-[var(--hc-space-8)]",
              "cursor-pointer transition-[background-color,border-color] duration-150 ease-standard motion-reduce:duration-0",
              "focus:outline-none focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
              selected
                ? "border-[color:var(--hc-color-action-primary)] bg-[color:var(--hc-color-brand-50)]"
                : "border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-surface)] hover:border-[color:var(--hc-color-border-strong)]",
            )}
          >
            {o.icon && (
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex shrink-0 [&>svg]:size-[var(--hc-space-16)]",
                  selected ? "text-[color:var(--hc-color-action-primary)]" : "text-[color:var(--hc-color-text-tertiary)]",
                )}
              >
                {o.icon}
              </span>
            )}
            <span className="flex min-w-0 flex-col">
              <span className="text-[14px] font-semibold leading-tight text-[color:var(--hc-color-text-primary)]">{o.label}</span>
              {o.meta != null && (
                <span className="text-[12px] leading-tight text-[color:var(--hc-color-text-tertiary)] [font-variant-numeric:tabular-nums]">
                  {o.meta}
                </span>
              )}
            </span>
          </button>
        );
      })}
      {showClear && value != null && (
        <button
          type="button"
          onClick={() => onValueChange(null)}
          className={cn(
            "inline-flex min-h-[var(--hc-field-height)] items-center gap-[var(--hc-space-4)] self-center",
            "rounded-[var(--hc-radius-control)] px-[var(--hc-space-8)] text-[14px] font-medium",
            "cursor-pointer text-[color:var(--hc-color-text-secondary)] hover:bg-[color:var(--hc-color-bg-subtle)]",
            "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--hc-color-border-focus)]",
          )}
        >
          <X aria-hidden="true" className="size-[var(--hc-space-16)]" /> Clear
        </button>
      )}
    </div>
  );
}
