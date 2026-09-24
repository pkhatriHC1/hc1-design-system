import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../../patterns";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

/* ══════ Sample data ══════════════════════════════════════════════════ */

const MONTHLY = [
  { month: "Jan", clinical: 42, admin: 22 },
  { month: "Feb", clinical: 48, admin: 24 },
  { month: "Mar", clinical: 55, admin: 26 },
  { month: "Apr", clinical: 51, admin: 28 },
  { month: "May", clinical: 62, admin: 30 },
  { month: "Jun", clinical: 71, admin: 32 },
  { month: "Jul", clinical: 78, admin: 34 },
  { month: "Aug", clinical: 82, admin: 36 },
  { month: "Sep", clinical: 79, admin: 38 },
];

const PIE = [
  { name: "Cardiology",   value: 42 },
  { name: "Radiology",    value: 26 },
  { name: "Oncology",     value: 18 },
  { name: "Neurology",    value: 14 },
];

const CHART_COLORS = [
  "var(--hc-color-chart-1)",
  "var(--hc-color-chart-2)",
  "var(--hc-color-chart-3)",
  "var(--hc-color-chart-4)",
  "var(--hc-color-chart-5)",
];

/* ══════ Entry ══════════════════════════════════════════════════════ */

export function ChartCardDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <ChartTypesBlock />
      <StatesBlock />
      <ActionsBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · ChartCard"
      title="ChartCard — chart-in-a-card wrapper"
      lead="ChartCard is the standard Card frame for a Recharts chart. Title + description + optional actions in the header, a fixed-height body that hosts the chart, and built-in loading + empty states. Consumers write the chart itself with Recharts primitives and get the framing for free."
    />
  );
}

/* ══════ Chart types ═══════════════════════════════════════════════ */

function ChartTypesBlock() {
  return (
    <DocBlock
      title="Four chart types"
      lead="ChartCard doesn't wrap the chart type — it wraps ANY Recharts chart. LineChart, BarChart, AreaChart, PieChart, or a composed chart with multiple series each just drop into the ChartCard children."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <ChartCard title="Monthly reports" description="Clinical + admin, YTD">
          <LineChart data={MONTHLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--hc-color-border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="clinical" stroke="var(--hc-color-chart-1)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="admin"    stroke="var(--hc-color-chart-2)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Reports by month" description="Stacked bars">
          <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--hc-color-border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} />
            <Tooltip />
            <Bar dataKey="clinical" fill="var(--hc-color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="admin"    fill="var(--hc-color-chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Cumulative volume" description="Area chart, YTD">
          <AreaChart data={MONTHLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--hc-color-border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="clinical" stackId="1" stroke="var(--hc-color-chart-1)" fill="var(--hc-color-chart-1)" fillOpacity={0.3} />
            <Area type="monotone" dataKey="admin"    stackId="1" stroke="var(--hc-color-chart-2)" fill="var(--hc-color-chart-2)" fillOpacity={0.3} />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Reports by department" description="Current quarter">
          <PieChart>
            <Pie data={PIE} dataKey="value" nameKey="name" outerRadius={70} paddingAngle={2}>
              {PIE.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>

      <Callout tone="info" title="Chart color palette">
        The DS ships a five-color chart palette at <code>--hc-color-chart-1..5</code> (see the <a href="#colors">Colors</a> foundation). Reference them via <code>var(--hc-color-chart-1)</code> in your chart props; the palette rotates automatically for pie / donut segments.
      </Callout>
    </DocBlock>
  );
}

/* ══════ States ═══════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="Loading + Empty" lead="Both are built-in — the DS renders a bar-skeleton while loading and a contained EmptyState when there's no data.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <ChartCard title="Monthly reports" description="Waiting on data…" loading />
        <ChartCard title="Monthly reports" description="This month" empty emptyMessage="No reports filed this month yet." />
      </div>
    </DocBlock>
  );
}

/* ══════ Actions ═══════════════════════════════════════════════════ */

function ActionsBlock() {
  return (
    <DocBlock
      title="Header actions"
      lead="The `actions` slot fits a timeframe picker, export button, or filter menu inline in the header — right-aligned automatically."
    >
      <ChartCard
        title="Monthly spend"
        description="Last 9 months, all departments"
        actions={
          <>
            <Button variant="ghost" size="sm">Last 9m</Button>
            <Button variant="outline" size="sm">Export</Button>
          </>
        }
      >
        <LineChart data={MONTHLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--hc-color-border-subtle)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="clinical" stroke="var(--hc-color-chart-1)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="admin"    stroke="var(--hc-color-chart-2)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>
    </DocBlock>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "title",        type: "ReactNode",             def: "—",     desc: "Card heading — one line, sentence case." },
  { name: "description",  type: "ReactNode",             def: "—",     desc: "Subheading — timeframe, source, legend." },
  { name: "actions",      type: "ReactNode",             def: "—",     desc: "Right-aligned action slot in the header." },
  { name: "loading",      type: "boolean",               def: "false", desc: "Replace body with a skeleton placeholder." },
  { name: "empty",        type: "boolean",               def: "false", desc: "Replace body with an EmptyState." },
  { name: "emptyMessage", type: "ReactNode",             def: "'No data for this range'", desc: "Empty-state message." },
  { name: "emptyIcon",    type: "ReactNode",             def: "—",     desc: "Optional empty-state icon." },
  { name: "height",       type: "number",                def: "240",   desc: "Chart body height in px." },
  { name: "children",     type: "ReactElement (Recharts)", def: "—",   desc: "Single Recharts chart — LineChart / BarChart / AreaChart / PieChart. Wrapped in ResponsiveContainer automatically." },
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

/* ══════ Notes ══════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          { tone: "must", text: "Install recharts as a peer dep in your consumer app. The DS declares it optional so products that don't ship charts don't pay for it in their bundle." },
          { tone: "must", text: "Reference chart colors via --hc-color-chart-1..5 so the palette stays consistent across products. Hard-coded hex values drift as design retunes." },
          { tone: "should", text: "Share the height across ChartCards in the same dashboard. Different heights make the row feel unbalanced." },
          { tone: "should", text: "Use the `empty` prop when the timeframe returned zero rows — a Recharts chart with no data reads as broken; an EmptyState reads as intentional." },
          { tone: "note", text: "ChartCard wraps children in a ResponsiveContainer so the chart resizes with the card. Do not add your own ResponsiveContainer — Recharts will nest two of them and behave oddly." },
        ]}
      />
    </DocBlock>
  );
}
