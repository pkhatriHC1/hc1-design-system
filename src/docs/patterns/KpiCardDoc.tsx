import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Clock,
  DollarSign,
  Stethoscope,
  Users,
} from "lucide-react";
import { KpiCard, KpiRow } from "../../patterns";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function KpiCardDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <BasicBlock />
      <DeltaBlock />
      <SparklineBlock />
      <StatesBlock />
      <RowBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · KpiCard"
      title="KpiCard — the standard metric card"
      lead="KpiCard is the metric chip every dashboard opens with — label + value + optional delta + optional sparkline + optional icon. The delta auto-colors as success or error based on whether the metric moved in the direction the consumer flagged as 'positive'. Pair with KpiRow for a responsive grid."
    />
  );
}

/* ══════ Basic ══════════════════════════════════════════════════════ */

function BasicBlock() {
  return (
    <DocBlock title="Basic" lead="Label + value is the minimum. Everything else is optional.">
      <KpiRow columns={3}>
        <KpiCard label="Patients" value="342" />
        <KpiCard label="Revenue" value="$9.8M" icon={<DollarSign />} />
        <KpiCard label="Uptime" value="99.8%" icon={<Activity />} />
      </KpiRow>
    </DocBlock>
  );
}

/* ══════ Delta ══════════════════════════════════════════════════════ */

function DeltaBlock() {
  return (
    <DocBlock
      title="Delta — up/down + positive semantics"
      lead="Pass `positive` to tell the DS which direction is 'good' for this metric. Growth metrics (revenue, patients seen) are positive-up; cost metrics (wait time, error rate) are positive-down. The DS picks the color."
    >
      <KpiRow columns={3}>
        <KpiCard
          label="Revenue"
          value="$9.8M"
          delta={{ value: 12, direction: "up", positive: "up", label: "vs last month" }}
          icon={<DollarSign />}
        />
        <KpiCard
          label="Avg wait time"
          value="14min"
          delta={{ value: 8, direction: "down", positive: "down", label: "vs last month" }}
          icon={<Clock />}
        />
        <KpiCard
          label="Critical alerts"
          value="7"
          delta={{ value: 3, direction: "up", positive: "down", label: "this week" }}
          icon={<AlertTriangle />}
        />
      </KpiRow>

      <Callout tone="info" title="What color means">
        Green means the metric moved the way the consumer wants it to. Red means it moved against them. Neutral means the direction wasn&apos;t declared or the metric is flat. Never override the color with a `style` prop — the semantic mapping is the whole point.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Sparkline ══════════════════════════════════════════════════ */

function SparklineBlock() {
  return (
    <DocBlock
      title="Sparkline"
      lead="Pass an array of numbers for a small inline chart in the corner. Hand-rolled SVG polyline — no Recharts dependency for the tiny visual. Color follows the delta semantics: green when trending positive, red when negative, brand teal otherwise."
    >
      <KpiRow columns={3}>
        <KpiCard
          label="Weekly signups"
          value="1,204"
          sparkline={[840, 920, 810, 950, 1020, 1180, 1204]}
          delta={{ value: 24, direction: "up", label: "week over week" }}
        />
        <KpiCard
          label="Server errors"
          value="42"
          sparkline={[95, 88, 72, 68, 55, 48, 42]}
          delta={{ value: 55, direction: "down", positive: "down", label: "week over week" }}
        />
        <KpiCard
          label="Active clinicians"
          value="86"
          sparkline={[80, 82, 84, 83, 85, 86, 86]}
          delta={{ value: 0, direction: "flat", label: "week over week" }}
        />
      </KpiRow>
    </DocBlock>
  );
}

/* ══════ States ═════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock
      title="Loading + Clickable"
      lead="`loading` swaps the value out for skeletons while data lands. `onClick` turns the whole card into a button — hover feedback, focus ring, press animation."
    >
      <KpiRow columns={2}>
        <KpiCard label="Revenue" value="$9.8M" loading />
        <KpiCard
          label="Patients"
          value="342"
          icon={<Users />}
          delta={{ value: 12, direction: "up", label: "vs last month" }}
          onClick={() => alert("clicked → drill into patients")}
        />
      </KpiRow>
    </DocBlock>
  );
}

/* ══════ Row ════════════════════════════════════════════════════════ */

function RowBlock() {
  return (
    <DocBlock
      title="KpiRow — responsive grid"
      lead="Wraps KpiCards in a responsive grid. `columns` sets the wide-screen column count; the row auto-drops to 2 columns on tablets and 1 column on phones."
    >
      <KpiRow columns={4}>
        <KpiCard label="Revenue" value="$9.8M" icon={<DollarSign />} delta={{ value: 12, direction: "up", label: "vs last mo" }} />
        <KpiCard label="Patients" value="342" icon={<Users />} delta={{ value: 5, direction: "up", label: "vs last mo" }} />
        <KpiCard label="Avg wait" value="14min" icon={<Clock />} delta={{ value: 8, direction: "down", positive: "down", label: "vs last mo" }} />
        <KpiCard label="Clinicians" value="86" icon={<Stethoscope />} delta={{ value: 2, direction: "up", label: "vs last mo" }} />
      </KpiRow>
    </DocBlock>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const CARD_PROPS: PropRow[] = [
  { name: "label",     type: "ReactNode",           def: "—",     desc: "Card label — uppercase small caps by convention." },
  { name: "value",     type: "ReactNode",           def: "—",     desc: "Primary value. Rendered at 28px bold." },
  { name: "delta",     type: "KpiCardDelta",        def: "—",     desc: "{ value, direction, label?, positive? }. Auto-colors per positive semantics." },
  { name: "sparkline", type: "number[]",            def: "—",     desc: "Array of recent values. Rendered as a small SVG polyline in the corner." },
  { name: "icon",      type: "ReactNode",           def: "—",     desc: "Leading icon in a brand-tinted circle at the top-right." },
  { name: "loading",   type: "boolean",             def: "false", desc: "Replaces content with skeleton placeholders." },
  { name: "onClick",   type: "() => void",          def: "—",     desc: "Renders the card as a button with hover / focus / press feedback." },
];

const DELTA_PROPS: PropRow[] = [
  { name: "value",     type: "number",                  def: "—",     desc: "Percentage change — sign derived from `direction`." },
  { name: "direction", type: "'up' | 'down' | 'flat'",  def: "—",     desc: "Direction the metric moved." },
  { name: "label",     type: "ReactNode",               def: "—",     desc: "Comparison text — 'vs last month', 'this week'." },
  { name: "positive",  type: "'up' | 'down'",           def: "'up'",  desc: "Which direction is semantically good. Determines the color mapping." },
];

const ROW_PROPS: PropRow[] = [
  { name: "columns", type: "2 | 3 | 4 | 5 | 6", def: "4", desc: "Wide-screen column count. Auto-drops to 2 on tablet, 1 on phone." },
  { name: "gap",     type: "number",             def: "16", desc: "Gap between cards in px." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>KpiCard</PropSectionEyebrow>
      <PropsTable rows={CARD_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>KpiCardDelta</PropSectionEyebrow>
        <PropsTable rows={DELTA_PROPS} />
      </div>
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>KpiRow</PropSectionEyebrow>
        <PropsTable rows={ROW_PROPS} />
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
          gridTemplateColumns: "160px 1.4fr 100px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 100px 2fr",
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

/* ══════ Notes ══════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          { tone: "must",  text: "Always set `positive` on cost / wait-time / error-rate metrics — otherwise a down-trend renders in the wrong color and confuses the story." },
          { tone: "should", text: "Match the value's typography to its precision. '$9.8M' reads faster than '$9,821,432' on a KpiCard." },
          { tone: "should", text: "Group up to 4-6 KpiCards in one row. More than that and the metrics blur together — reach for a Table instead." },
          { tone: "note",   text: "Sparkline is a rough visual, not a precise chart. If consumers need axes / tooltips / legends, reach for ChartCard." },
        ]}
      />
    </DocBlock>
  );
}
