import { useState } from "react";
import type { ReactNode } from "react";
import { Archive, MessagesSquare, Trash2 } from "lucide-react";
import { BulkActionBar, DataTable } from "../../patterns";
import type { DataTableColumn } from "../../patterns";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

type Row = { id: string; name: string; mrn: string; assignee: string };

const ROWS: Row[] = [
  { id: "r1", name: "Alicia Reyes",  mrn: "MRN-000431", assignee: "Dr. Cooper" },
  { id: "r2", name: "Ben Ortiz",     mrn: "MRN-000842", assignee: "Dr. Riley" },
  { id: "r3", name: "Chandra Patel", mrn: "MRN-001291", assignee: "Dr. Patel" },
  { id: "r4", name: "Daniela Ito",   mrn: "MRN-001744", assignee: "Dr. Cooper" },
  { id: "r5", name: "Ellis Nakamura", mrn: "MRN-002012", assignee: "Dr. Quinn" },
];

export function BulkActionBarDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <LiveBlock />
      <VariantsBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · BulkActionBar"
      title="BulkActionBar — sticky action strap for table selections"
      lead="When a user selects rows in a DataTable, a BulkActionBar appears with 'N of M selected' + a Clear affordance + consumer-supplied bulk actions. Consumers render it conditionally on `selection.length > 0` — the DS handles the visual + layout + a11y."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  const [selected, setSelected] = useState<string[]>([]);

  const columns: DataTableColumn<Row>[] = [
    { key: "name",     header: "Name",     accessor: (r) => r.name },
    { key: "mrn",      header: "MRN",      accessor: (r) => r.mrn },
    { key: "assignee", header: "Assignee", accessor: (r) => r.assignee },
  ];

  return (
    <DocBlock title="Live example" lead="Select one or more rows in the table below. The BulkActionBar appears above — Clear deselects, the buttons are consumer actions.">
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            totalCount={ROWS.length}
            onClear={() => setSelected([])}
            actions={
              <>
                <Button variant="outline" size="sm">
                  <MessagesSquare />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Archive />
                  Archive
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 />
                  Delete
                </Button>
              </>
            }
          />
        )}
        <DataTable<Row>
          data={ROWS}
          columns={columns}
          rowKey={(row) => row.id}
          selection={selected}
          onSelectionChange={setSelected}
          ariaLabel="Bulk selection demo"
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Variants ══════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock title="Sticky variant" lead="`variant='sticky'` pins the bar to the bottom of the viewport with a stronger shadow — useful for long tables where the top of the page has scrolled out of view.">
      <div
        style={{
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
        }}
      >
        <BulkActionBar
          selectedCount={12}
          totalCount={340}
          onClear={() => {}}
          variant="sticky"
          actions={
            <>
              <Button variant="outline" size="sm">Assign</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </>
          }
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Props ═══════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "selectedCount", type: "number",             def: "—",         desc: "How many rows are currently selected." },
  { name: "totalCount",    type: "number",             def: "—",         desc: "Total rows for 'N of M selected' display." },
  { name: "onClear",       type: "() => void",         def: "—",         desc: "Fires when the user clicks Clear." },
  { name: "clearLabel",    type: "string",             def: "'Clear'",   desc: "Label on the Clear button." },
  { name: "actions",       type: "ReactNode",          def: "—",         desc: "Right-aligned bulk-action buttons." },
  { name: "variant",       type: "'inline' | 'sticky'", def: "'inline'", desc: "sticky pins to the bottom of the viewport with a stronger shadow." },
];

function PropsBlock() {
  return (
    <DocBlock title="Props">
      <PropsTable rows={PROPS} />
    </DocBlock>
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
          gridTemplateColumns: "160px 1.4fr 120px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 120px 2fr",
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

/* ══════ Notes ═══════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          { tone: "must",   text: "Render conditionally on selection.length > 0. Always-rendered bars steal focus and confuse the surface — the bar only makes sense when there's a selection." },
          { tone: "should", text: "Confirm destructive bulk actions with a ConfirmDialog (typedGuard for 10+ rows). One click that deletes 40 patients is a UX bug waiting to happen." },
          { tone: "note",   text: "Wire onClear back to your selection state. The DS calls it when the user clicks Clear; the consumer resets the selection." },
        ]}
      />

      <Callout tone="info" title="Composes with DataTable">
        BulkActionBar and DataTable share the `selection` array. Render the bar above (or below) the table conditionally on `selection.length {"> 0"}` — the DS handles the presentation, the consumer owns the state.
      </Callout>
    </DocBlock>
  );
}
