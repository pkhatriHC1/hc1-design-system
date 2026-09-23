import type { ReactNode } from "react";
import type { TableDensity } from "../../components/table";

/**
 * A single column definition for the DataTable.
 *
 *   key       — stable identifier (React key + sort key).
 *   header    — cell content in the header row.
 *   accessor  — extracts the cell value from a row. Used for the default
 *               `render` and for local sorting when `sortable` is on.
 *   render    — custom cell render. Receives the full row; use for
 *               composite cells (avatar + name, severity badge, etc.).
 *   sortable  — when true, the header becomes a sort control. Consumer
 *               owns the sort state; DataTable emits `onSortChange` and
 *               reflects the current sort visually.
 *   width     — fixed column width (px number or CSS length).
 *   align     — 'right' shifts text alignment and marks the head cell
 *               as numeric (matches Table.Head's `numeric` prop).
 */
export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  accessor?: (row: T) => unknown;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: "left" | "right";
};

/** Sort state as owned by the consumer and reflected by DataTable's headers. */
export type DataTableSort = {
  /** Column key currently sorted on. */
  key: string;
  /** Sort direction. */
  direction: "asc" | "desc";
};

/**
 * Pagination configuration handed to DataTable. Consumer owns page and
 * onChange; DataTable renders the Pagination primitive with the shape
 * that fits the data-table footer.
 */
export type DataTablePagination = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
};

export type DataTableProps<T> = {
  /** Row data — the exact array to render. Pagination + sort happen
   *  in the consumer's state; DataTable does not slice or resort. */
  data: T[];
  /** Column definitions. Order determines column order. */
  columns: DataTableColumn<T>[];
  /**
   * Extract a stable id from each row. Used for React keys and (when
   * selection is on) for tracking which rows are selected.
   */
  rowKey: (row: T) => string;

  /* ── Sort ─────────────────────────────────────────────────────── */
  /** Current sort state — `null` for "no sort". */
  sortState?: DataTableSort | null;
  /**
   * Fired when the user activates a sortable header. Consumer owns the
   * new sort state (three-way cycle: asc → desc → null is a common
   * convention but the consumer picks the semantics).
   */
  onSortChange?: (sort: DataTableSort | null) => void;

  /* ── Selection ────────────────────────────────────────────────── */
  /**
   * When set, a leading checkbox column appears. Array of selected row
   * keys (as returned by `rowKey`).
   */
  selection?: string[];
  /** Fired when the user checks / unchecks a row or the header. */
  onSelectionChange?: (selected: string[]) => void;

  /* ── Pagination ───────────────────────────────────────────────── */
  /** Optional pagination footer. Omit for a scrolling / infinite table. */
  pagination?: DataTablePagination;

  /* ── Toolbar ──────────────────────────────────────────────────── */
  /** Rendered above the table — typically a FilterBar. */
  toolbar?: ReactNode;

  /* ── Row interactions ─────────────────────────────────────────── */
  /**
   * Fired when the user clicks or Enter/Space activates a row. Adds
   * hover feedback + focusable rows.
   */
  onRowClick?: (row: T) => void;

  /* ── Loading + Empty ──────────────────────────────────────────── */
  /** When true, renders skeleton rows instead of data. */
  loading?: boolean;
  /** How many skeleton rows to render while loading. @default 5 */
  loadingRows?: number;
  /** Content of the empty state when `data` is empty and not loading. */
  emptyMessage?: ReactNode;
  /** Optional icon for the empty state. */
  emptyIcon?: ReactNode;

  /* ── Table-primitive passthrough ──────────────────────────────── */
  /** Row-height ladder. @default 'comfortable' */
  density?: TableDensity;
  /** Zebra striping. @default false */
  striped?: boolean;
  /** Draw the outer surface frame. @default true */
  bordered?: boolean;
  /** Sticky header (requires `maxHeight`). @default false */
  stickyHeader?: boolean;
  /** Max height of the scrolling content region. */
  maxHeight?: number | string;
  /** Accessible label for the table. */
  ariaLabel?: string;
  className?: string;
};
