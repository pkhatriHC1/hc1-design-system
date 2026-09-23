import { useState } from "react";
import type { ReactNode } from "react";
import { FilterBar } from "../../patterns";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

const SEVERITY_OPTIONS = [
  { label: "Critical", value: "critical" },
  { label: "High",     value: "high" },
  { label: "Medium",   value: "medium" },
  { label: "Low",      value: "low" },
  { label: "Normal",   value: "normal" },
];

const ASSIGNEE_OPTIONS = [
  { label: "Dr. Cooper", value: "cooper" },
  { label: "Dr. Riley",  value: "riley" },
  { label: "Dr. Patel",  value: "patel" },
  { label: "Dr. Quinn",  value: "quinn" },
];

export function FilterBarDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <BasicBlock />
      <LabelledBlock />
      <ActionsBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · FilterBar"
      title="FilterBar — search + filters + Clear all in one row"
      lead="FilterBar is the standard toolbar that sits above a DataTable or worklist. Composes Input (as a search field) + Combobox (as filter dropdowns) + an optional right-aligned action slot in one flex row with wrapping. Consumers compose the parts explicitly — the DS owns the spacing, alignment, and the auto-rendered Clear all button when `onClearAll` is passed."
    />
  );
}

/* ══════ Basic ═════════════════════════════════════════════════════ */

function BasicBlock() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<string | undefined>(undefined);
  const [assignee, setAssignee] = useState<string | undefined>(undefined);

  const activeCount = (query ? 1 : 0) + (severity ? 1 : 0) + (assignee ? 1 : 0);
  const clear = () => {
    setQuery("");
    setSeverity(undefined);
    setAssignee(undefined);
  };

  return (
    <DocBlock
      title="Live example"
      lead="Search + two filter dropdowns + auto-rendered Clear all button. The Clear affordance appears only when `onClearAll` is passed — consumers hide it when nothing is active by passing `undefined`."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.lg,
        }}
      >
        <FilterBar onClearAll={activeCount > 0 ? clear : undefined}>
          <FilterBar.Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients or MRN"
          />
          <FilterBar.Filter
            label="Severity"
            value={severity}
            onChange={setSeverity}
            options={SEVERITY_OPTIONS}
          />
          <FilterBar.Filter
            label="Assignee"
            value={assignee}
            onChange={setAssignee}
            options={ASSIGNEE_OPTIONS}
          />
        </FilterBar>
      </div>

      <div
        style={{
          marginTop: t.space.stack.md,
          fontFamily: t.font.mono,
          fontSize: 12,
          color: t.color.text.secondary,
          display: "flex",
          gap: t.space.inline.md,
          flexWrap: "wrap",
        }}
      >
        <span>query: &quot;{query}&quot;</span>
        <span>severity: {severity ?? "—"}</span>
        <span>assignee: {assignee ?? "—"}</span>
        <span>active: {activeCount}</span>
      </div>
    </DocBlock>
  );
}

/* ══════ With label ════════════════════════════════════════════════ */

function LabelledBlock() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<string | undefined>(undefined);

  return (
    <DocBlock
      title="With a leading label"
      lead="Pass `label` on the FilterBar root for a short strap at the start of the row (e.g. 'Filters' or 'Refine by')."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.lg,
        }}
      >
        <FilterBar label="Refine by">
          <FilterBar.Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
          />
          <FilterBar.Filter
            label="Severity"
            value={severity}
            onChange={setSeverity}
            options={SEVERITY_OPTIONS}
          />
        </FilterBar>
      </div>
    </DocBlock>
  );
}

/* ══════ Custom actions ════════════════════════════════════════════ */

function ActionsBlock() {
  return (
    <DocBlock
      title="Custom actions"
      lead="When the auto-rendered Clear button doesn't cover what you need (Save filter, Export, Download CSV), drop a `FilterBar.Actions` slot in — it's right-aligned automatically."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.lg,
        }}
      >
        <FilterBar>
          <FilterBar.Search placeholder="Search…" />
          <FilterBar.Filter
            label="Severity"
            options={SEVERITY_OPTIONS}
          />
          <FilterBar.Actions>
            <Button variant="outline" size="sm">Save filter</Button>
            <Button variant="ghost" size="sm">Export CSV</Button>
          </FilterBar.Actions>
        </FilterBar>
      </div>
    </DocBlock>
  );
}

/* ══════ Props ═════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const ROOT_PROPS: PropRow[] = [
  { name: "onClearAll", type: "() => void",   def: "—",           desc: "When provided, auto-renders a Clear all ghost button pinned to the right side." },
  { name: "clearLabel", type: "string",       def: "'Clear all'", desc: "Label on the auto-rendered clear button." },
  { name: "label",      type: "ReactNode",    def: "—",           desc: "Optional label rendered at the start of the row." },
];

const SEARCH_PROPS: PropRow[] = [
  { name: "value",       type: "string",                   def: "—",     desc: "Controlled search value." },
  { name: "onChange",    type: "(e) => void",              def: "—",     desc: "Native input change handler." },
  { name: "placeholder", type: "string",                   def: "—",     desc: "Placeholder inside the input." },
  { name: "width",       type: "number | string",          def: "240",   desc: "Fixed width for the search field." },
];

const FILTER_PROPS: PropRow[] = [
  { name: "label",    type: "string",                             def: "—",     desc: "Chip label composed into the trigger ('Severity: Critical' when active)." },
  { name: "value",    type: "string",                             def: "—",     desc: "Selected value." },
  { name: "onChange", type: "(value, option) => void",            def: "—",     desc: "Fires when the user picks an option." },
  { name: "options",  type: "ComboboxOption[]",                   def: "—",     desc: "Option list. Same shape as Combobox." },
  { name: "width",    type: "number | string",                    def: "200",   desc: "Fixed width for the filter chip." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>FilterBar (root)</PropSectionEyebrow>
      <PropsTable rows={ROOT_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>FilterBar.Search</PropSectionEyebrow>
        <PropsTable rows={SEARCH_PROPS} />
      </div>
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>FilterBar.Filter</PropSectionEyebrow>
        <PropsTable rows={FILTER_PROPS} />
      </div>
      <Callout tone="note" title="Everything else is passed through">
        FilterBar.Search accepts every Input prop and FilterBar.Filter accepts every Combobox prop (except the ones the DS owns — size / label / value / onChange / options). Use them like the standalone primitives.
      </Callout>
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
          gridTemplateColumns: "160px 1.4fr 140px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 140px 2fr",
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
            text: "Reset pagination to page 1 whenever a filter or search value changes. Users expect a filter change to show the top of the filtered list, not the middle of the old list.",
          },
          {
            tone: "should",
            text: "Wire onClearAll to reset every filter you track + reset pagination + clear the search input. The DS shows the button only when you pass a callback, so passing undefined when no filters are active hides it automatically.",
          },
          {
            tone: "should",
            text: "For server-side search, debounce the API call inside the search field's onChange — the DS fires on every keystroke.",
          },
          {
            tone: "note",
            text: "FilterBar composes DS primitives (Input + Combobox + Button). Every primitive prop you need is still accessible on the sugar wrappers — pass loading, disabled, leadingIcon, etc. just like on the standalone primitive.",
          },
        ]}
      />
    </DocBlock>
  );
}
