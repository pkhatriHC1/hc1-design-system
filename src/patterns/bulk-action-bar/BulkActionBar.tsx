import type { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/button";
import { cn } from "../../utils/cn";

/**
 * BulkActionBar — sticky action strap for table row selections.
 *
 * When the user has selected N rows in a DataTable, a bar animates in
 * above (or below) the table showing "N of M selected" + a Clear
 * affordance + consumer-supplied bulk action buttons. Rendered
 * conditionally on `selectedCount > 0` by the consumer.
 *
 *   {selected.length > 0 && (
 *     <BulkActionBar
 *       selectedCount={selected.length}
 *       totalCount={total}
 *       onClear={() => setSelected([])}
 *       actions={
 *         <>
 *           <Button variant="outline">Assign</Button>
 *           <Button variant="destructive">Delete</Button>
 *         </>
 *       }
 *     />
 *   )}
 */

export type BulkActionBarProps = HTMLAttributes<HTMLDivElement> & {
  /** How many rows are currently selected. */
  selectedCount: number;
  /** Total number of rows the selection is measured against (for "N of M"). */
  totalCount?: number;
  /** Fires when the user clicks the Clear affordance. */
  onClear?: () => void;
  /** Label on the Clear button. @default 'Clear' */
  clearLabel?: string;
  /** Right-aligned bulk-action buttons. */
  actions?: ReactNode;
  /** Style variant. `sticky` pins to the bottom of the viewport. @default 'inline' */
  variant?: "inline" | "sticky";
};

export function BulkActionBar({
  selectedCount,
  totalCount,
  onClear,
  clearLabel = "Clear",
  actions,
  variant = "inline",
  className,
  ...rest
}: BulkActionBarProps) {
  return (
    <div
      role="toolbar"
      aria-label={`${selectedCount} selected`}
      data-slot="bulk-action-bar"
      data-variant={variant}
      className={cn(
        "flex flex-wrap items-center gap-3",
        "rounded-[var(--hc-radius-control)] border shadow-[var(--hc-shadow-sm)]",
        "border-[color:var(--hc-color-brand-100)]",
        "bg-[color:var(--hc-color-brand-50)]",
        "px-[var(--hc-space-16)] py-[var(--hc-space-8)]",
        "text-[color:var(--hc-color-text-primary)]",
        variant === "sticky" && [
          "sticky bottom-4 z-sticky",
          "shadow-[var(--hc-shadow-lg)]",
        ],
        className,
      )}
      {...rest}
    >
      <div
        data-slot="bulk-action-bar-summary"
        className="flex items-center gap-2 text-[13px] font-medium"
      >
        <span
          data-slot="bulk-action-bar-count"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--hc-color-action-primary)] text-[12px] font-semibold text-[color:var(--hc-color-text-on-solid)]"
          aria-hidden="true"
        >
          {selectedCount}
        </span>
        <span>
          {selectedCount === 1 ? "row selected" : "rows selected"}
          {typeof totalCount === "number" && (
            <span className="ml-1 font-normal text-[color:var(--hc-color-text-secondary)]">
              of {totalCount}
            </span>
          )}
        </span>
      </div>

      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X />
          {clearLabel}
        </Button>
      )}

      {actions && (
        <div
          data-slot="bulk-action-bar-actions"
          className="ml-auto flex flex-wrap items-center gap-2"
        >
          {actions}
        </div>
      )}
    </div>
  );
}
