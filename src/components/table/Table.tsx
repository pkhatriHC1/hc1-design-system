import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  SortDirection,
  TableBodyProps,
  TableCellProps,
  TableContentProps,
  TableDensity,
  TableEmptyProps,
  TableFiltersProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableLoadingProps,
  TablePaginationProps,
  TableProps,
  TableRowProps,
  TableSearchProps,
  TableToolbarProps,
} from "./Table.types";

/**
 * HC1 Table — the canonical data-presentation primitive.
 *
 * Migrated from Table.css to shadcn-style (cva + Tailwind utilities).
 * No Radix wrap — Table is a presentational primitive built on native
 * <table>/<thead>/<tbody>/<tr>/<td>. The prop API, DOM structure, and
 * a11y wiring are preserved verbatim; every color, height, padding, and
 * state maps 1:1 to the same --hc-* alias the previous Table.css consumed.
 *
 * Density propagates from root → cells via CSS custom properties set
 * on the root by the `density` cva variant:
 *   --hc-table-row-h          — row height on <th> and <td>
 *   --hc-table-cell-pad-x     — horizontal padding on cells
 *   --hc-table-cell-pad-y     — vertical padding on body cells
 *   --hc-table-cell-font-size — body cell font size
 *   --hc-table-cell-icon-size — leading-icon size in cells
 *
 * Change density on the root, everything scales. Same contract as before.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type TableContextValue = {
  density: TableDensity;
  striped: boolean;
};

const TableContext = createContext<TableContextValue>({
  density: "comfortable",
  striped: false,
});

const useTableContext = () => useContext(TableContext);

/* ══════ CVA — ROOT ════════════════════════════════════════════════ */

const tableRootVariants = cva(
  cn(
    "flex flex-col min-w-0 overflow-hidden",
    "bg-white text-neutral-900 font-sans",
  ),
  {
    variants: {
      density: {
        compact: cn(
          "[--hc-table-row-h:var(--hc-table-row-h-compact)]",
          "[--hc-table-cell-pad-x:var(--hc-space-8)]",
          "[--hc-table-cell-pad-y:var(--hc-space-4)]",
          "[--hc-table-cell-font-size:var(--hc-font-size-14)]",
          "[--hc-table-cell-icon-size:14px]",
        ),
        comfortable: cn(
          "[--hc-table-row-h:var(--hc-table-row-h-comfortable)]",
          "[--hc-table-cell-pad-x:var(--hc-space-12)]",
          "[--hc-table-cell-pad-y:var(--hc-space-8)]",
          "[--hc-table-cell-font-size:var(--hc-font-size-14)]",
          "[--hc-table-cell-icon-size:16px]",
        ),
        relaxed: cn(
          "[--hc-table-row-h:var(--hc-table-row-h-relaxed)]",
          "[--hc-table-cell-pad-x:var(--hc-space-16)]",
          "[--hc-table-cell-pad-y:var(--hc-space-12)]",
          "[--hc-table-cell-font-size:var(--hc-font-size-16)]",
          "[--hc-table-cell-icon-size:18px]",
        ),
      },
      fullWidth: {
        true:  "w-full",
        false: "",
      },
      bordered: {
        true:  "border border-neutral-100 rounded-surface shadow-none",
        false: "",
      },
      striped: {
        /* Zebra rows painted via nth-child descendant selector on tbody rows. */
        true: "[&_[data-slot=table-tbody]_[data-slot=table-row]:nth-child(even)_[data-slot=table-cell]]:bg-neutral-50",
        false: "",
      },
      hover: {
        /* Force hover feedback on non-clickable rows via descendant selector. */
        true: "[&_[data-slot=table-tbody]_[data-slot=table-row]:hover_[data-slot=table-cell]]:bg-neutral-100",
        false: "",
      },
    },
    defaultVariants: {
      density: "comfortable",
      fullWidth: true,
      bordered: true,
      striped: false,
      hover: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const TableRoot = forwardRef<HTMLDivElement, TableProps>(function TableRoot(
  {
    density        = "comfortable",
    striped        = false,
    hover          = false,
    fullWidth      = true,
    bordered       = true,
    ariaLabel,
    ariaLabelledBy,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const contextValue = useMemo<TableContextValue>(
    () => ({ density, striped }),
    [density, striped],
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-slot="table-root"
        style={style as CSSProperties}
        className={cn(
          tableRootVariants({
            density,
            fullWidth,
            bordered,
            striped,
            hover,
          } as VariantProps<typeof tableRootVariants>),
          className,
        )}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
});
TableRoot.displayName = "Table";

/* ══════ TOOLBAR / SEARCH / FILTERS ════════════════════════════════ */

const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(function TableToolbar(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="table-toolbar"
      className={cn(
        "flex items-center gap-12 min-w-0",
        "py-12 px-16",
        "bg-white border-b border-neutral-100",
        "min-h-[52px]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
TableToolbar.displayName = "Table.Toolbar";

const TableSearch = forwardRef<HTMLDivElement, TableSearchProps>(function TableSearch(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="table-search"
      className={cn(
        "flex-[1_1_320px] min-w-0 flex items-center",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
TableSearch.displayName = "Table.Search";

const TableFilters = forwardRef<HTMLDivElement, TableFiltersProps>(function TableFilters(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="table-filters"
      className={cn(
        "flex-none flex items-center gap-8 ml-auto flex-wrap",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
TableFilters.displayName = "Table.Filters";

/* ══════ CONTENT (scroll frame + <table>) ══════════════════════════ */

const TableContent = forwardRef<HTMLDivElement, TableContentProps>(function TableContent(
  {
    stickyHeader = false,
    maxHeight,
    loading      = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const scroll = stickyHeader || maxHeight != null;

  const contentStyle: CSSProperties = {
    ...(style as CSSProperties),
    ...(maxHeight != null
      ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
      : null),
  };

  return (
    <div
      ref={ref}
      data-slot="table-content"
      data-sticky-header={stickyHeader || undefined}
      data-loading={loading || undefined}
      style={contentStyle}
      className={cn(
        "relative min-w-0 overflow-x-auto overflow-y-hidden",
        scroll && "overflow-y-auto",
        loading && "[&_[data-slot=table-el]]:opacity-50",
        className,
      )}
      {...rest}
    >
      <table
        data-slot="table-el"
        role="table"
        aria-busy={loading || undefined}
        className={cn(
          "w-full font-sans text-neutral-900",
          /* border-collapse: separate + spacing 0 so per-cell borders + sticky
             backgrounds work without doubling. */
          "border-separate border-spacing-0 table-auto",
          /* Sticky header — cells inside <thead> stick to the top of the
             scroll container. */
          stickyHeader && cn(
            "[&_[data-slot=table-thead]_[data-slot=table-th]]:sticky",
            "[&_[data-slot=table-thead]_[data-slot=table-th]]:top-0",
            "[&_[data-slot=table-thead]_[data-slot=table-th]]:z-sticky",
            "[&_[data-slot=table-thead]_[data-slot=table-th]]:bg-white",
            "[&_[data-slot=table-thead]_[data-slot=table-th]]:shadow-[var(--hc-table-sticky-shadow)]",
          ),
        )}
      >
        {children}
      </table>
    </div>
  );
});
TableContent.displayName = "Table.Content";

/* ══════ HEADER / BODY ═════════════════════════════════════════════ */

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, children, ...rest },
  ref,
) {
  return (
    <thead
      ref={ref}
      data-slot="table-thead"
      className={cn("bg-white", className)}
      {...rest}
    >
      {children}
    </thead>
  );
});
TableHeader.displayName = "Table.Header";

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <tbody
      ref={ref}
      data-slot="table-tbody"
      className={cn("bg-white", className)}
      {...rest}
    >
      {children}
    </tbody>
  );
});
TableBody.displayName = "Table.Body";

/* ══════ ROW ═══════════════════════════════════════════════════════ */

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  {
    selected,
    disabled,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isClickable = typeof onClick === "function" && !disabled;

  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (!isClickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <tr
      ref={ref}
      data-slot="table-row"
      data-clickable={isClickable || undefined}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={cn(
        "transition-[background-color] duration-150 ease-standard motion-reduce:duration-0",
        /* Clickable rows: cursor + focus ring. */
        isClickable && cn(
          "cursor-pointer",
          "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          /* Hover feedback on cells. */
          "hover:[&_[data-slot=table-cell]]:bg-neutral-100",
        ),
        /* Selected: subtle wash + left accent painted with inset shadow on first cell. */
        selected && cn(
          "[&_[data-slot=table-cell]]:bg-neutral-100",
          "[&_[data-slot=table-cell]:first-child]:shadow-[inset_3px_0_0_var(--hc-table-selected-accent)]",
        ),
        /* Disabled: dim + no interaction; suppress hover paint. */
        disabled && cn(
          "[&_[data-slot=table-cell]]:text-neutral-400",
          "[&_[data-slot=table-cell]]:cursor-not-allowed",
          "hover:[&_[data-slot=table-cell]]:bg-white",
        ),
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
});
TableRow.displayName = "Table.Row";

/* ══════ HEAD CELL ═════════════════════════════════════════════════ */

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  {
    sort,
    onSortChange,
    numeric,
    width,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const isSortable = sort !== undefined;

  const ariaSort: "ascending" | "descending" | "none" | undefined = isSortable
    ? sort === "asc"
      ? "ascending"
      : sort === "desc"
        ? "descending"
        : "none"
    : undefined;

  const nextSort = (current: SortDirection): SortDirection => {
    if (current === null) return "asc";
    if (current === "asc") return "desc";
    return null;
  };

  const handleSort = () => {
    if (!isSortable) return;
    onSortChange?.(nextSort(sort ?? null));
  };

  const headStyle: CSSProperties = {
    ...(style as CSSProperties),
    ...(width != null
      ? { width: typeof width === "number" ? `${width}px` : width }
      : null),
  };

  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={ariaSort}
      data-slot="table-th"
      data-numeric={numeric || undefined}
      style={headStyle}
      className={cn(
        /* Body */
        "align-middle h-[var(--hc-table-row-h)]",
        "py-8 px-[var(--hc-table-cell-pad-x)]",
        /* Typography */
        "font-sans text-12 font-semibold leading-[1.4] tracking-[0.06em]",
        "text-neutral-500",
        /* Frame */
        "border-b border-neutral-200 bg-white",
        "whitespace-nowrap select-none",
        /* Alignment */
        numeric ? "text-right [font-variant-numeric:tabular-nums]" : "text-left",
        className,
      )}
      {...rest}
    >
      {isSortable ? (
        <button
          type="button"
          data-slot="table-sort"
          onClick={handleSort}
          className={cn(
            "appearance-none border-0 p-0 m-0 bg-transparent text-inherit cursor-pointer",
            "font-[inherit] tracking-[inherit]",
            "inline-flex items-center gap-4 min-h-[24px] min-w-0",
            numeric && "flex-row-reverse",
            "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:rounded-control",
            "hover:text-neutral-900",
          )}
        >
          <span>{children}</span>
          <SortIndicator direction={sort ?? null} />
        </button>
      ) : (
        children
      )}
    </th>
  );
});
TableHead.displayName = "Table.Head";

function SortIndicator({ direction }: { direction: SortDirection }) {
  const active = direction !== null;
  return (
    <span
      aria-hidden="true"
      data-slot="table-sort-indicator"
      data-active={active || undefined}
      className={cn(
        "inline-flex items-center shrink-0",
        active ? "text-brand-500" : "text-neutral-500",
      )}
    >
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 1 L9 5 H1 Z"
          fill="currentColor"
          opacity={direction === "asc" ? 1 : direction === "desc" ? 0.3 : 0.5}
        />
        <path
          d="M5 11 L9 7 H1 Z"
          fill="currentColor"
          opacity={direction === "desc" ? 1 : direction === "asc" ? 0.3 : 0.5}
        />
      </svg>
    </span>
  );
}

/* ══════ CELL ══════════════════════════════════════════════════════ */

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {
    numeric,
    leadingIcon,
    truncate = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <td
      ref={ref}
      data-slot="table-cell"
      data-numeric={numeric || undefined}
      className={cn(
        /* Body */
        "align-middle h-[var(--hc-table-row-h)]",
        "py-[var(--hc-table-cell-pad-y)] px-[var(--hc-table-cell-pad-x)]",
        /* Typography */
        "text-[length:var(--hc-table-cell-font-size)] leading-[1.4] text-neutral-900",
        /* Frame */
        "bg-white min-w-0",
        /* Row separator via bottom border (border-collapse: separate). */
        "border-b border-neutral-100",
        /* Alignment */
        numeric && "text-right [font-variant-numeric:tabular-nums]",
        /* Truncate: nowrap + ellipsis. max-w:1px forces truncation inside a
           flexible table layout — same trick as the original CSS. */
        truncate && "whitespace-nowrap overflow-hidden text-ellipsis max-w-[1px]",
        /* Remove final row's border so it sits flush with the surface. */
        "[[data-slot=table-row]:last-child_&]:border-b-0",
        className,
      )}
      {...rest}
    >
      {leadingIcon ? (
        <span
          data-slot="table-cell-content"
          className="inline-flex items-center gap-8 min-w-0"
        >
          <span
            data-slot="table-cell-icon"
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center shrink-0 text-neutral-500",
              "size-[var(--hc-table-cell-icon-size)]",
              "[&_svg]:size-[var(--hc-table-cell-icon-size)] [&_svg]:block",
            )}
          >
            {leadingIcon}
          </span>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </td>
  );
});
TableCell.displayName = "Table.Cell";

/* ══════ EMPTY / LOADING ═══════════════════════════════════════════ */

const TableEmpty = forwardRef<HTMLDivElement, TableEmptyProps>(function TableEmpty(
  { icon, title, description, action, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      data-slot="table-empty"
      className={cn(
        "flex flex-col items-center justify-center text-center gap-8",
        "py-32 px-16 min-h-[240px]",
        "text-neutral-500 bg-white",
        className,
      )}
      {...rest}
    >
      {icon && (
        <span
          data-slot="table-empty-icon"
          className={cn(
            "inline-flex items-center justify-center",
            "size-[48px] rounded-full bg-neutral-100 text-neutral-500 mb-4",
            "[&_svg]:block [&_svg]:size-[24px]",
          )}
        >
          {icon}
        </span>
      )}
      {title && (
        <div
          data-slot="table-empty-title"
          className="m-0 text-neutral-900 text-18 font-semibold leading-[1.4]"
        >
          {title}
        </div>
      )}
      {description && (
        <div
          data-slot="table-empty-description"
          className="m-0 text-neutral-500 text-14 leading-normal max-w-[48ch]"
        >
          {description}
        </div>
      )}
      {children}
      {action && (
        <div
          data-slot="table-empty-action"
          className="mt-8 flex gap-8 justify-center flex-wrap"
        >
          {action}
        </div>
      )}
    </div>
  );
});
TableEmpty.displayName = "Table.Empty";

const TableLoading = forwardRef<HTMLDivElement, TableLoadingProps>(function TableLoading(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      data-slot="table-loading"
      className={cn(
        "flex flex-col items-center justify-center gap-8",
        "py-32 px-16 min-h-[240px]",
        "text-neutral-500 bg-white",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block rounded-full size-[28px] border-[2.5px] border-neutral-200 border-t-brand-500",
          "animate-spin motion-reduce:[animation-duration:2500ms]",
        )}
      />
      {label && (
        <span className="text-14 text-neutral-500 leading-[1.4]">{label}</span>
      )}
      {children}
    </div>
  );
});
TableLoading.displayName = "Table.Loading";

/* ══════ FOOTER / PAGINATION ═══════════════════════════════════════ */

const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(function TableFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="table-footer"
      className={cn(
        "flex items-center gap-12 flex-wrap min-w-0",
        "py-12 px-16 min-h-[52px]",
        "bg-white border-t border-neutral-100",
        "text-neutral-500 text-14 leading-[1.4]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
TableFooter.displayName = "Table.Footer";

const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(function TablePagination(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="table-pagination"
      className={cn(
        "ml-auto flex items-center gap-8",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
TablePagination.displayName = "Table.Pagination";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type TableCompound = typeof TableRoot & {
  Toolbar:    typeof TableToolbar;
  Search:     typeof TableSearch;
  Filters:    typeof TableFilters;
  Content:    typeof TableContent;
  Header:     typeof TableHeader;
  Head:       typeof TableHead;
  Body:       typeof TableBody;
  Row:        typeof TableRow;
  Cell:       typeof TableCell;
  Empty:      typeof TableEmpty;
  Loading:    typeof TableLoading;
  Footer:     typeof TableFooter;
  Pagination: typeof TablePagination;
};

const Table = TableRoot as TableCompound;
Table.Toolbar    = TableToolbar;
Table.Search     = TableSearch;
Table.Filters    = TableFilters;
Table.Content    = TableContent;
Table.Header     = TableHeader;
Table.Head       = TableHead;
Table.Body       = TableBody;
Table.Row        = TableRow;
Table.Cell       = TableCell;
Table.Empty      = TableEmpty;
Table.Loading    = TableLoading;
Table.Footer     = TableFooter;
Table.Pagination = TablePagination;

export { Table, useTableContext, tableRootVariants };
