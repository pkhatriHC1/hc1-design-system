import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../../components/input";
import type { InputProps } from "../../components/input";
import { Combobox } from "../../components/combobox";
import type { ComboboxOption, ComboboxProps } from "../../components/combobox";
import { Button } from "../../components/button";
import { cn } from "../../utils/cn";

/**
 * FilterBar — the standard toolbar sitting above a DataTable or worklist.
 *
 * Composes Input (as a search field) + Combobox (as filter dropdowns) +
 * a right-aligned action slot in one flex row with sensible wrapping.
 * Consumers compose the parts explicitly (Search + Filter + custom
 * Actions); the DS owns the spacing, alignment, and the auto-rendered
 * "Clear all" button when `onClearAll` is provided.
 *
 * Usage:
 *   <FilterBar
 *     onClearAll={activeCount > 0 ? handleReset : undefined}
 *   >
 *     <FilterBar.Search value={q} onChange={setQ} placeholder="Search patients…" />
 *     <FilterBar.Filter
 *       label="Severity"
 *       value={severity}
 *       onChange={setSeverity}
 *       options={SEVERITY_OPTIONS}
 *     />
 *     <FilterBar.Filter
 *       label="Assignee"
 *       value={assignee}
 *       onChange={setAssignee}
 *       options={ASSIGNEE_OPTIONS}
 *     />
 *   </FilterBar>
 */

/* ══════ Root ══════════════════════════════════════════════════════ */

export type FilterBarProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * When provided, the FilterBar auto-renders a "Clear all" ghost button
   * pinned to the right side of the row. Consumers use this instead of
   * hand-rendering a Clear button so every FilterBar in HC1 clears the
   * same way. Omit to hide the clear affordance (e.g. when no filters
   * are active).
   */
  onClearAll?: () => void;
  /** Label on the auto-rendered clear button. @default 'Clear all' */
  clearLabel?: string;
  /** Optional label rendered at the start of the row. */
  label?: ReactNode;
  /** Compose Search + Filter + Actions children. */
  children?: ReactNode;
};

function FilterBarRoot({
  onClearAll,
  clearLabel = "Clear all",
  label,
  className,
  children,
  ...rest
}: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      className={cn(
        "flex flex-wrap items-center gap-[var(--hc-space-8)]",
        "py-[var(--hc-space-8)]",
        className,
      )}
      role="toolbar"
      aria-label="Filters"
      {...rest}
    >
      {label && (
        <span
          data-slot="filter-bar-label"
          className="text-[13px] font-medium text-[color:var(--hc-color-text-secondary)]"
        >
          {label}
        </span>
      )}
      {children}
      {onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="ml-auto"
          data-slot="filter-bar-clear"
        >
          <X />
          {clearLabel}
        </Button>
      )}
    </div>
  );
}

/* ══════ Search ═══════════════════════════════════════════════════ */

export type FilterBarSearchProps = Omit<
  InputProps,
  "type" | "size" | "leadingIcon" | "fullWidth" | "label" | "helperText"
> & {
  /** Search field width. @default 240 (px) */
  width?: number | string;
};

const FilterBarSearch = forwardRef<HTMLInputElement, FilterBarSearchProps>(
  function FilterBarSearch({ width = 240, className, ...rest }, forwardedRef) {
    return (
      <div
        data-slot="filter-bar-search"
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        className="shrink-0"
      >
        <Input
          ref={forwardedRef}
          type="search"
          size="sm"
          leadingIcon={<Search />}
          clearable
          className={className}
          {...rest}
        />
      </div>
    );
  },
);
FilterBarSearch.displayName = "FilterBar.Search";

/* ══════ Filter ═══════════════════════════════════════════════════ */

export type FilterBarFilterProps = Omit<
  ComboboxProps,
  "size" | "fullWidth" | "label" | "value" | "onChange" | "options"
> & {
  /**
   * Visible chip label — placed before the selected value in the
   * trigger ("Severity: Critical") so the user can tell which filter
   * they're looking at even when the value is short.
   */
  label: string;
  value?: string;
  onChange?: (value: string, option: ComboboxOption) => void;
  options: ComboboxOption[];
  /** Filter chip width. @default 200 */
  width?: number | string;
};

function FilterBarFilter({
  label,
  value,
  onChange,
  options,
  width = 200,
  placeholder,
  className,
  ...rest
}: FilterBarFilterProps) {
  /* Compose the label into the placeholder + selected value so the
     trigger reads "Severity: Critical" or "Severity: All". */
  const activeOption = options.find((o) => o.value === value);
  const triggerPlaceholder = placeholder ?? `${label}: All`;
  const displayOptions = activeOption
    ? options.map((o) =>
        o.value === activeOption.value ? { ...o, label: `${label}: ${o.label}` } : o,
      )
    : options;

  return (
    <div
      data-slot="filter-bar-filter"
      style={{ width: typeof width === "number" ? `${width}px` : width }}
      className="shrink-0"
    >
      <Combobox
        size="sm"
        options={displayOptions}
        value={value}
        onChange={onChange}
        placeholder={triggerPlaceholder}
        className={className}
        {...rest}
      />
    </div>
  );
}

/* ══════ Actions ═══════════════════════════════════════════════════ */

export type FilterBarActionsProps = HTMLAttributes<HTMLDivElement>;

function FilterBarActions({ className, children, ...rest }: FilterBarActionsProps) {
  return (
    <div
      data-slot="filter-bar-actions"
      className={cn("ml-auto flex items-center gap-[var(--hc-space-8)]", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ══════ Compound export ═══════════════════════════════════════════ */

type FilterBarCompound = typeof FilterBarRoot & {
  Search: typeof FilterBarSearch;
  Filter: typeof FilterBarFilter;
  Actions: typeof FilterBarActions;
};

export const FilterBar = FilterBarRoot as FilterBarCompound;
FilterBar.Search = FilterBarSearch;
FilterBar.Filter = FilterBarFilter;
FilterBar.Actions = FilterBarActions;
