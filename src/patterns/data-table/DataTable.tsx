import { useMemo } from "react";
import type { ReactNode } from "react";
import { Table } from "../../components/table";
import type { SortDirection } from "../../components/table";
import { Checkbox } from "../../components/checkbox";
import { Pagination } from "../../components/pagination";
import { EmptyState } from "../../components/empty-state";
import { Skeleton } from "../../components/skeleton";
import type { DataTableColumn, DataTableProps } from "./DataTable.types";

/**
 * DataTable — the headline data pattern.
 *
 * Composes Table + Checkbox + Pagination + EmptyState + Skeleton into
 * one config-driven surface. Consumer defines `data` + `columns` + the
 * usual state (sort, selection, pagination) and gets a full worklist:
 * sortable headers, an auto-added selection checkbox column, a
 * loading skeleton, an empty state, and a pagination footer.
 *
 *   <DataTable
 *     data={patients}
 *     columns={columns}
 *     rowKey={(row) => row.id}
 *     toolbar={<FilterBar>…</FilterBar>}
 *     sortState={sort}
 *     onSortChange={setSort}
 *     selection={selected}
 *     onSelectionChange={setSelected}
 *     pagination={{ page, pageSize, total, onPageChange, onPageSizeChange }}
 *     loading={isLoading}
 *     emptyMessage="No patients match your filters"
 *     onRowClick={(row) => navigate(`/patients/${row.id}`)}
 *   />
 *
 * Data slicing (pagination + sort) stays with the consumer — DataTable
 * never re-orders or paginates the array. Consumers who want local
 * sort can add a `useMemo` step; consumers who page against an API
 * just pass whatever came back on the current request.
 */

export function DataTable<T>({
  data,
  columns,
  rowKey,
  sortState,
  onSortChange,
  selection,
  onSelectionChange,
  pagination,
  toolbar,
  onRowClick,
  loading = false,
  loadingRows = 5,
  emptyMessage = "No results",
  emptyIcon,
  density = "comfortable",
  striped = false,
  bordered = true,
  stickyHeader = false,
  maxHeight,
  ariaLabel,
  className,
}: DataTableProps<T>) {
  const selectionActive = !!selection && !!onSelectionChange;
  const totalColumns = columns.length + (selectionActive ? 1 : 0);

  /* ── Selection state derivations ─────────────────────────────── */
  const rowKeys = useMemo(() => data.map((row) => rowKey(row)), [data, rowKey]);
  const selectedSet = useMemo(() => new Set(selection ?? []), [selection]);
  const allChecked = rowKeys.length > 0 && rowKeys.every((k) => selectedSet.has(k));
  const someChecked = !allChecked && rowKeys.some((k) => selectedSet.has(k));

  const toggleAll = (next: boolean) => {
    if (!onSelectionChange) return;
    if (next) {
      const merged = new Set([...(selection ?? []), ...rowKeys]);
      onSelectionChange(Array.from(merged));
    } else {
      const remaining = (selection ?? []).filter((k) => !rowKeys.includes(k));
      onSelectionChange(remaining);
    }
  };
  const toggleRow = (key: string, next: boolean) => {
    if (!onSelectionChange) return;
    if (next) onSelectionChange(Array.from(new Set([...(selection ?? []), key])));
    else onSelectionChange((selection ?? []).filter((k) => k !== key));
  };

  /* ── Sort helpers ─────────────────────────────────────────────── */
  const resolveSortDir = (colKey: string): SortDirection | undefined => {
    const col = columns.find((c) => c.key === colKey);
    if (!col?.sortable) return undefined;
    if (sortState?.key === colKey) return sortState.direction;
    return null;
  };

  const cycleSort = (colKey: string) => {
    if (!onSortChange) return;
    const current = sortState?.key === colKey ? sortState.direction : null;
    /* Three-way cycle: asc → desc → cleared. */
    if (current === null) onSortChange({ key: colKey, direction: "asc" });
    else if (current === "asc") onSortChange({ key: colKey, direction: "desc" });
    else onSortChange(null);
  };

  /* ── Render ───────────────────────────────────────────────────── */
  const showEmpty = !loading && data.length === 0;

  return (
    <Table
      density={density}
      striped={striped}
      bordered={bordered}
      hover={!!onRowClick}
      ariaLabel={ariaLabel}
      className={className}
    >
      {toolbar && <Table.Toolbar>{toolbar}</Table.Toolbar>}

      <Table.Content
        stickyHeader={stickyHeader}
        maxHeight={maxHeight}
        loading={loading}
      >
        <Table.Header>
          <Table.Row>
            {selectionActive && (
              <Table.Head width={44} aria-label="Select all rows">
                <Checkbox
                  size="sm"
                  checked={allChecked}
                  indeterminate={someChecked}
                  onCheckedChange={(next) => toggleAll(next)}
                />
              </Table.Head>
            )}
            {columns.map((col) => renderHead(col, resolveSortDir(col.key), () => cycleSort(col.key)))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {loading &&
            Array.from({ length: loadingRows }).map((_, i) => (
              <Table.Row key={`__loading-${i}`}>
                {selectionActive && (
                  <Table.Cell>
                    <Skeleton width={16} height={16} radius="4px" />
                  </Table.Cell>
                )}
                {columns.map((col) => (
                  <Table.Cell key={col.key}>
                    <Skeleton height={12} radius="4px" />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}

          {!loading &&
            data.map((row) => {
              const key = rowKey(row);
              const selected = selectionActive && selectedSet.has(key);
              return (
                <Table.Row
                  key={key}
                  selected={selected}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectionActive && (
                    <Table.Cell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="sm"
                        checked={selected}
                        onCheckedChange={(next) => toggleRow(key, next)}
                        aria-label="Select row"
                      />
                    </Table.Cell>
                  )}
                  {columns.map((col) => (
                    <Table.Cell key={col.key} numeric={col.align === "right"}>
                      {renderCell(col, row)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}

          {showEmpty && (
            <Table.Row>
              <Table.Cell colSpan={totalColumns} style={{ padding: 0 }}>
                <EmptyState variant="default" layout="contained">
                  {emptyIcon && <EmptyState.Icon>{emptyIcon}</EmptyState.Icon>}
                  <EmptyState.Title>
                    {typeof emptyMessage === "string" ? emptyMessage : "No results"}
                  </EmptyState.Title>
                  {typeof emptyMessage !== "string" && (
                    <EmptyState.Description>{emptyMessage}</EmptyState.Description>
                  )}
                </EmptyState>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>

      {pagination && !loading && data.length > 0 && (
        <Table.Footer>
          <DataTableFooter pagination={pagination} />
        </Table.Footer>
      )}
    </Table>
  );
}

function renderHead<T>(
  col: DataTableColumn<T>,
  sort: SortDirection | undefined,
  onSortChange: () => void,
) {
  const isSortable = !!col.sortable;
  return (
    <Table.Head
      key={col.key}
      width={col.width}
      numeric={col.align === "right"}
      sort={isSortable ? sort : undefined}
      onSortChange={isSortable ? onSortChange : undefined}
    >
      {col.header}
    </Table.Head>
  );
}

function renderCell<T>(col: DataTableColumn<T>, row: T): ReactNode {
  if (col.render) return col.render(row);
  if (col.accessor) return renderValue(col.accessor(row));
  return renderValue((row as Record<string, unknown>)[col.key]);
}

function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return value as ReactNode;
}

function DataTableFooter({ pagination }: { pagination: NonNullable<DataTableProps<unknown>["pagination"]> }) {
  const pageCount = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  return (
    <Pagination
      page={pagination.page}
      pageCount={pageCount}
      pageSize={pagination.pageSize}
      totalItems={pagination.total}
      pageSizeOptions={pagination.pageSizeOptions}
      onPageChange={pagination.onPageChange}
      onPageSizeChange={pagination.onPageSizeChange}
      size="sm"
    >
      <Pagination.Info />
      <Pagination.PageSize />
      <Pagination.Previous />
      <Pagination.PageList />
      <Pagination.Next />
    </Pagination>
  );
}
