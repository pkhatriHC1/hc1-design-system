import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { MoreHorizontal, Trash2, Users } from "lucide-react";
import { DataTable, FilterBar } from "../../patterns";
import type { DataTableColumn, DataTableSort } from "../../patterns";
import { Avatar } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { DropdownMenu } from "../../components/dropdown-menu";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

/* ══════ Sample data ══════════════════════════════════════════════════ */

type Severity = "critical" | "high" | "medium" | "low" | "normal";

type Patient = {
  id: string;
  name: string;
  mrn: string;
  severity: Severity;
  assignee: string;
  lastUpdated: string;
};

const PATIENTS: Patient[] = [
  { id: "p-1",  name: "Alicia Reyes",     mrn: "MRN-000431", severity: "critical", assignee: "Dr. Cooper",  lastUpdated: "2 min ago" },
  { id: "p-2",  name: "Ben Ortiz",        mrn: "MRN-000842", severity: "high",     assignee: "Dr. Riley",   lastUpdated: "18 min ago" },
  { id: "p-3",  name: "Chandra Patel",    mrn: "MRN-001291", severity: "medium",   assignee: "Dr. Patel",   lastUpdated: "1 hr ago" },
  { id: "p-4",  name: "Daniela Ito",      mrn: "MRN-001744", severity: "low",      assignee: "Dr. Cooper",  lastUpdated: "3 hr ago" },
  { id: "p-5",  name: "Ellis Nakamura",   mrn: "MRN-002012", severity: "normal",   assignee: "Dr. Quinn",   lastUpdated: "1 day ago" },
  { id: "p-6",  name: "Farrah Bello",     mrn: "MRN-002289", severity: "critical", assignee: "Dr. Cooper",  lastUpdated: "4 hr ago" },
  { id: "p-7",  name: "Grigor Wei",       mrn: "MRN-002561", severity: "high",     assignee: "Dr. Patel",   lastUpdated: "6 hr ago" },
  { id: "p-8",  name: "Harriet Solis",    mrn: "MRN-002834", severity: "medium",   assignee: "Dr. Riley",   lastUpdated: "9 hr ago" },
  { id: "p-9",  name: "Ivan Kowalski",    mrn: "MRN-003107", severity: "low",      assignee: "Dr. Quinn",   lastUpdated: "1 day ago" },
  { id: "p-10", name: "Jamila Osman",     mrn: "MRN-003380", severity: "normal",   assignee: "Dr. Patel",   lastUpdated: "2 days ago" },
  { id: "p-11", name: "Kenji Tanaka",     mrn: "MRN-003653", severity: "high",     assignee: "Dr. Cooper",  lastUpdated: "3 days ago" },
  { id: "p-12", name: "Lena Kruse",       mrn: "MRN-003926", severity: "medium",   assignee: "Dr. Riley",   lastUpdated: "3 days ago" },
];

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  normal: 4,
};

const SEVERITY_META: Record<Severity, { label: string; variant: Parameters<typeof Badge>[0]["variant"] }> = {
  critical: { label: "Critical", variant: "danger" },
  high:     { label: "High",     variant: "warning" },
  medium:   { label: "Medium",   variant: "warning" },
  low:      { label: "Low",      variant: "neutral" },
  normal:   { label: "Normal",   variant: "success" },
};

/* ══════ Entry ══════════════════════════════════════════════════════ */

export function DataTableDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <BasicBlock />
      <WithFilterBarBlock />
      <SelectionBlock />
      <StatesBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · DataTable"
      title="DataTable — the headline worklist pattern"
      lead="DataTable composes Table + Checkbox + Pagination + EmptyState + Skeleton into one config-driven surface. Consumer supplies `data` + `columns` + state (sort, selection, pagination) and gets a full worklist — sortable headers, an auto-added selection checkbox column, loading skeletons, an empty state, and a pagination footer. Data slicing (pagination + sort) lives with the consumer; DataTable never re-orders or paginates the array on its own — pass in whatever came back from your API."
    />
  );
}

/* ══════ Basic ═════════════════════════════════════════════════════ */

function BasicBlock() {
  const [sort, setSort] = useState<DataTableSort | null>({ key: "severity", direction: "asc" });

  const columns: DataTableColumn<Patient>[] = [
    {
      key: "name",
      header: "Patient",
      sortable: true,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
          <Avatar size="sm" name={row.name} />
          <div>
            <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
              {row.name}
            </div>
            <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{row.mrn}</div>
          </div>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      sortable: true,
      width: 140,
      accessor: (row) => SEVERITY_ORDER[row.severity],
      render: (row) => (
        <Badge variant={SEVERITY_META[row.severity].variant}>
          {SEVERITY_META[row.severity].label}
        </Badge>
      ),
    },
    { key: "assignee", header: "Assignee", sortable: true, width: 160, accessor: (row) => row.assignee },
    { key: "lastUpdated", header: "Last updated", width: 140, align: "right", accessor: (row) => row.lastUpdated },
    {
      key: "actions",
      header: "",
      width: 56,
      render: () => (
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Row actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Assign to me</DropdownMenu.Item>
            <DropdownMenu.Item>Snooze 24h</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item destructive>
              <Trash2 />
              Remove
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    },
  ];

  const sorted = useMemo(() => sortData(PATIENTS, columns, sort), [sort, columns]);

  return (
    <DocBlock
      title="Live worklist"
      lead="A real DataTable with an Avatar-in-name cell, severity Badge, sortable columns, and a per-row DropdownMenu of actions. Click any sortable header to cycle asc → desc → cleared."
    >
      <DataTable<Patient>
        data={sorted}
        columns={columns}
        rowKey={(row) => row.id}
        sortState={sort}
        onSortChange={setSort}
        ariaLabel="Patient worklist"
        density="comfortable"
      />
    </DocBlock>
  );
}

/* ══════ With FilterBar ════════════════════════════════════════════ */

function WithFilterBarBlock() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<string | undefined>(undefined);
  const [assignee, setAssignee] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return PATIENTS.filter((p) => {
      if (query && !(p.name.toLowerCase().includes(query.toLowerCase()) || p.mrn.toLowerCase().includes(query.toLowerCase()))) return false;
      if (severity && p.severity !== severity) return false;
      if (assignee && p.assignee !== assignee) return false;
      return true;
    });
  }, [query, severity, assignee]);

  const columns: DataTableColumn<Patient>[] = [
    { key: "name",     header: "Patient",  sortable: true,  accessor: (row) => row.name, render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
        <Avatar size="sm" name={row.name} />
        <div>
          <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{row.name}</div>
          <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{row.mrn}</div>
        </div>
      </div>
    ) },
    { key: "severity", header: "Severity", width: 120, render: (row) => <Badge variant={SEVERITY_META[row.severity].variant}>{SEVERITY_META[row.severity].label}</Badge> },
    { key: "assignee", header: "Assignee", width: 140, accessor: (row) => row.assignee },
    { key: "lastUpdated", header: "Last updated", width: 140, align: "right", accessor: (row) => row.lastUpdated },
  ];

  const sorted = useMemo(() => sortData(filtered, columns, sort), [filtered, sort, columns]);
  const paged = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page]);

  const activeFilterCount = (query ? 1 : 0) + (severity ? 1 : 0) + (assignee ? 1 : 0);
  const handleClearAll = () => {
    setQuery("");
    setSeverity(undefined);
    setAssignee(undefined);
    setPage(1);
  };

  return (
    <DocBlock
      title="With FilterBar toolbar"
      lead="The pattern that unblocks every worklist in HC1 — DataTable with a FilterBar toolbar. Filters + search + Clear all + pagination + sort all wired to consumer state; DataTable + FilterBar handle the presentation."
    >
      <DataTable<Patient>
        data={paged}
        columns={columns}
        rowKey={(row) => row.id}
        sortState={sort}
        onSortChange={setSort}
        pagination={{
          page,
          pageSize,
          total: sorted.length,
          onPageChange: setPage,
        }}
        ariaLabel="Patient worklist"
        emptyMessage="No patients match your filters"
        toolbar={
          <FilterBar
            onClearAll={activeFilterCount > 0 ? handleClearAll : undefined}
            label={<><Users style={{ width: 14, height: 14, verticalAlign: "middle" }} /> Filters</>}
          >
            <FilterBar.Search
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search patients or MRN"
            />
            <FilterBar.Filter
              label="Severity"
              value={severity}
              onChange={(v) => { setSeverity(v); setPage(1); }}
              options={[
                { label: "Critical", value: "critical" },
                { label: "High",     value: "high" },
                { label: "Medium",   value: "medium" },
                { label: "Low",      value: "low" },
                { label: "Normal",   value: "normal" },
              ]}
            />
            <FilterBar.Filter
              label="Assignee"
              value={assignee}
              onChange={(v) => { setAssignee(v); setPage(1); }}
              options={[
                { label: "Dr. Cooper", value: "Dr. Cooper" },
                { label: "Dr. Riley",  value: "Dr. Riley" },
                { label: "Dr. Patel",  value: "Dr. Patel" },
                { label: "Dr. Quinn",  value: "Dr. Quinn" },
              ]}
            />
          </FilterBar>
        }
      />
    </DocBlock>
  );
}

/* ══════ Selection ═════════════════════════════════════════════════ */

function SelectionBlock() {
  const [selected, setSelected] = useState<string[]>([]);

  const columns: DataTableColumn<Patient>[] = [
    { key: "name",     header: "Patient",     accessor: (row) => row.name },
    { key: "severity", header: "Severity",    render: (row) => <Badge variant={SEVERITY_META[row.severity].variant}>{SEVERITY_META[row.severity].label}</Badge> },
    { key: "assignee", header: "Assignee",    accessor: (row) => row.assignee },
    { key: "lastUpdated", header: "Updated",  accessor: (row) => row.lastUpdated, align: "right" },
  ];

  return (
    <DocBlock
      title="Selection"
      lead="Pass `selection` (array of row keys) + `onSelectionChange` and a leading checkbox column auto-appears. Header checkbox reflects all / some / none states (indeterminate for partial). Selecting a row doesn't fire onRowClick — the checkbox cell stops propagation."
    >
      <div
        style={{
          display: "flex",
          gap: t.space.inline.md,
          marginBottom: t.space.stack.md,
          alignItems: "center",
        }}
      >
        <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
          Selected: <strong>{selected.length}</strong>
        </span>
        {selected.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setSelected([])}>
            Clear selection
          </Button>
        )}
      </div>
      <DataTable<Patient>
        data={PATIENTS.slice(0, 6)}
        columns={columns}
        rowKey={(row) => row.id}
        selection={selected}
        onSelectionChange={setSelected}
        ariaLabel="Selectable worklist"
      />
    </DocBlock>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  const columns: DataTableColumn<Patient>[] = [
    { key: "name",     header: "Patient",  accessor: (row) => row.name },
    { key: "severity", header: "Severity", accessor: (row) => row.severity },
    { key: "assignee", header: "Assignee", accessor: (row) => row.assignee },
  ];

  return (
    <DocBlock title="Loading + Empty" lead="Both are opinionated presets — the DS renders skeleton rows while `loading` is true, and a contained EmptyState inside a full-width cell when `data` is empty and not loading.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <div>
          <StateEyebrow>Loading</StateEyebrow>
          <DataTable<Patient> data={[]} columns={columns} rowKey={(row) => row.id} loading loadingRows={4} />
        </div>
        <div>
          <StateEyebrow>Empty</StateEyebrow>
          <DataTable<Patient> data={[]} columns={columns} rowKey={(row) => row.id} emptyMessage="No patients yet — add one to get started." />
        </div>
      </div>
    </DocBlock>
  );
}

function StateEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...t.type.caption,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontWeight: 700,
        color: t.color.text.tertiary,
        marginBottom: t.space.stack.sm,
      }}
    >
      {children}
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "data",              type: "T[]",                                               def: "—",           desc: "Row data. DataTable never slices or re-orders — pass what should appear on the current page." },
  { name: "columns",           type: "DataTableColumn<T>[]",                              def: "—",           desc: "Column definitions. See DataTableColumn table below." },
  { name: "rowKey",            type: "(row: T) => string",                                def: "—",           desc: "Extract a stable id from each row — for React keys and selection tracking." },
  { name: "sortState",         type: "{ key, direction } | null",                         def: "null",        desc: "Current sort — null for 'no sort'. Consumer owns." },
  { name: "onSortChange",      type: "(sort | null) => void",                             def: "—",           desc: "Fires on a sortable header click. Three-way cycle: asc → desc → null." },
  { name: "selection",         type: "string[]",                                          def: "—",           desc: "Array of selected row keys. When set, a leading checkbox column auto-appears." },
  { name: "onSelectionChange", type: "(selected: string[]) => void",                      def: "—",           desc: "Fires when the user toggles a row or the header checkbox." },
  { name: "pagination",        type: "{ page, pageSize, total, onPageChange, … }",        def: "—",           desc: "Optional pagination footer. Omit for a scrolling or infinite table." },
  { name: "toolbar",           type: "ReactNode",                                         def: "—",           desc: "Rendered above the table inside Table.Toolbar — typically a FilterBar." },
  { name: "onRowClick",        type: "(row: T) => void",                                  def: "—",           desc: "Fires when the user clicks or activates a row. Auto-enables hover + focus feedback." },
  { name: "loading",           type: "boolean",                                           def: "false",       desc: "Renders skeleton rows instead of data. Preserves layout." },
  { name: "loadingRows",       type: "number",                                            def: "5",           desc: "Number of skeleton rows while loading." },
  { name: "emptyMessage",      type: "ReactNode",                                         def: "'No results'", desc: "Content of the empty state when data is empty and not loading." },
  { name: "density",           type: "'compact'|'comfortable'|'relaxed'",                 def: "'comfortable'", desc: "Row-height ladder." },
  { name: "stickyHeader",      type: "boolean",                                           def: "false",       desc: "Sticky header (requires maxHeight)." },
  { name: "maxHeight",         type: "number | string",                                   def: "—",           desc: "Max height of the scrolling content region." },
];

const COLUMN_PROPS: PropRow[] = [
  { name: "key",        type: "string",                            def: "—",     desc: "Stable identifier — React key + sort key." },
  { name: "header",     type: "ReactNode",                         def: "—",     desc: "Cell content in the header row." },
  { name: "accessor",   type: "(row: T) => unknown",               def: "—",     desc: "Extract the cell value. Used by the default render and by consumer-side sort." },
  { name: "render",     type: "(row: T) => ReactNode",             def: "—",     desc: "Custom cell render. Use for composite cells (Avatar + name, severity Badge, action menus)." },
  { name: "sortable",   type: "boolean",                           def: "false", desc: "Makes the header a sort control. Consumer owns sortState." },
  { name: "width",      type: "number | string",                   def: "—",     desc: "Fixed column width — px number or CSS length." },
  { name: "align",      type: "'left' | 'right'",                  def: "'left'", desc: "'right' shifts alignment and marks the cell numeric." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>DataTable</PropSectionEyebrow>
      <PropsTable rows={PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>DataTableColumn&lt;T&gt;</PropSectionEyebrow>
        <PropsTable rows={COLUMN_PROPS} />
      </div>
    </DocBlock>
  );
}

function PropSectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...t.type.caption,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontWeight: 700,
        color: t.color.text.tertiary,
        marginBottom: t.space.stack.sm,
      }}
    >
      {children}
    </div>
  );
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1.4fr 140px 2fr",
          background: t.color.background.subtle,
          padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
          borderBottom: `1px solid ${t.color.border.subtle}`,
        }}
      >
        <HeaderCell>Prop</HeaderCell>
        <HeaderCell>Type</HeaderCell>
        <HeaderCell>Default</HeaderCell>
        <HeaderCell>Description</HeaderCell>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.name}
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1.4fr 140px 2fr",
            padding: `${t.space.inline.md} ${t.space.inline.lg}`,
            borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
            alignItems: "start",
            gap: t.space.inline.md,
          }}
        >
          <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>{row.name}</code>
          <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>{row.type}</code>
          <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{row.def}</code>
          <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
        </div>
      ))}
    </div>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: t.color.text.tertiary,
      }}
    >
      {children}
    </span>
  );
}

/* ══════ Notes ═════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          {
            tone: "must",
            text: "Every row needs a stable rowKey. Use the record's server-side id — a hashed row index breaks selection when the data reorders.",
          },
          {
            tone: "must",
            text: "Data slicing (pagination + sort) happens outside DataTable. Sort a client-side array with useMemo; page against your API and pass whatever came back on the current page.",
          },
          {
            tone: "should",
            text: "Reach for the render prop for anything richer than a scalar cell — avatar + name, severity badge, timestamps that need relative formatting, row action menus. Bare `accessor` is only for plain strings.",
          },
          {
            tone: "should",
            text: "Match density to context. `compact` for dense dashboards, `comfortable` (default) for standard worklists, `relaxed` for detail-heavy tables (large chart previews, wrapped text).",
          },
          {
            tone: "note",
            text: "Under the hood: composes Table + Checkbox + Pagination + EmptyState + Skeleton. All the primitive APIs remain accessible on the components/ side if you need a bespoke table shape.",
          },
        ]}
      />

      <Callout tone="info" title="When to reach for the Table primitive instead">
        DataTable is the preset — it bakes in the checkbox column, the pagination footer shape, the loading skeleton, the empty state. Reach for the raw `Table` compound when you need a shape DataTable doesn&apos;t support: multi-level headers, expandable rows, virtualized bodies, or a bespoke footer.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Local sort utility ══════════════════════════════════════════ */

function sortData<T>(rows: T[], columns: DataTableColumn<T>[], sort: DataTableSort | null): T[] {
  if (!sort) return rows;
  const col = columns.find((c) => c.key === sort.key);
  if (!col?.accessor) return rows;
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = col.accessor!(a) as string | number | null | undefined;
    const vb = col.accessor!(b) as string | number | null | undefined;
    if (va == null && vb == null) return 0;
    if (va == null) return 1 * factor;
    if (vb == null) return -1 * factor;
    if (va < vb) return -1 * factor;
    if (va > vb) return 1 * factor;
    return 0;
  });
}
