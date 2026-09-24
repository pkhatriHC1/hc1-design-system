import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, DollarSign, Filter, RefreshCw, Users } from "lucide-react";
import {
  ChartCard,
  DashboardHero,
  KpiCard,
  KpiRow,
} from "../../patterns";
import { PageHeader } from "../../components/page-header";
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
  { month: "Apr", value: 65 },
  { month: "May", value: 72 },
  { month: "Jun", value: 78 },
  { month: "Jul", value: 84 },
  { month: "Aug", value: 92 },
  { month: "Sep", value: 98 },
];

const PIE = [
  { name: "Cardiology", value: 42 },
  { name: "Radiology",  value: 26 },
  { name: "Oncology",   value: 18 },
  { name: "Neurology",  value: 14 },
];

const CHART_COLORS = [
  "var(--hc-color-chart-1)",
  "var(--hc-color-chart-2)",
  "var(--hc-color-chart-3)",
  "var(--hc-color-chart-4)",
];

/* ══════ Entry ══════════════════════════════════════════════════════ */

export function DashboardPatternDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <LiveBlock />
      <SlotsBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Template · DashboardHero"
      title="DashboardHero — the standard dashboard landing template"
      lead="DashboardHero is the vertical layout every HC1 dashboard opens with: PageHeader on top, KpiRow below, then a two-column chart row with a primary chart (2/3 width) and a secondary chart or drill-down (1/3 width). Consumer fills the slots; the DS handles the spacing + responsive collapse."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  return (
    <DocBlock
      title="Full example"
      lead="A real dashboard composed from PageHeader + KpiRow (4 metrics) + primary bar chart + secondary pie chart."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
        }}
      >
        <DashboardHero
          header={
            <PageHeader
              title="ClinicalIQ overview"
              subtitle="September 2026 · all facilities"
              actions={
                <>
                  <Button variant="outline">
                    <Filter />
                    Filter
                  </Button>
                  <Button>
                    <RefreshCw />
                    Refresh
                  </Button>
                </>
              }
            />
          }
          kpis={
            <KpiRow columns={4}>
              <KpiCard
                label="Revenue"
                value="$9.8M"
                icon={<DollarSign />}
                delta={{ value: 12, direction: "up", label: "vs last month" }}
              />
              <KpiCard
                label="Patients"
                value="342"
                icon={<Users />}
                delta={{ value: 5, direction: "up", label: "vs last month" }}
              />
              <KpiCard
                label="Avg wait"
                value="14min"
                icon={<Clock />}
                delta={{ value: 8, direction: "down", positive: "down", label: "vs last month" }}
              />
              <KpiCard
                label="Uptime"
                value="99.8%"
                delta={{ value: 0, direction: "flat", label: "vs last month" }}
              />
            </KpiRow>
          }
          primary={
            <ChartCard title="Monthly reports" description="Last 6 months, all departments">
              <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--hc-color-border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--hc-color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartCard>
          }
          secondary={
            <ChartCard title="Reports by dept" description="Current quarter">
              <PieChart>
                <Pie data={PIE} dataKey="value" nameKey="name" outerRadius={60} paddingAngle={2}>
                  {PIE.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ChartCard>
          }
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Slots ══════════════════════════════════════════════════════ */

function SlotsBlock() {
  return (
    <DocBlock
      title="Slots"
      lead="Four optional slots — the DS renders whichever ones you pass. Skip `secondary` and `primary` stretches full-width; skip both and the chart row disappears entirely."
    >
      <div
        style={{
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "40px 60px 120px",
            gap: 12,
            fontFamily: t.font.mono,
            fontSize: 11,
            color: t.color.text.tertiary,
          }}
        >
          <SlotBox>header · PageHeader</SlotBox>
          <SlotBox>kpis · KpiRow</SlotBox>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <SlotBox>primary · ChartCard (2/3 width on wide)</SlotBox>
            <SlotBox>secondary · ChartCard (1/3 width)</SlotBox>
          </div>
        </div>
      </div>

      <Callout tone="info" title="Anything else? Use children">
        DashboardHero renders any additional children below the primary/secondary chart row. Drop a Table, a second KpiRow, or a nested DashboardHero in the children slot for more content.
      </Callout>
    </DocBlock>
  );
}

function SlotBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.default}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}
    >
      {children}
    </div>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "header",    type: "ReactNode", def: "—",  desc: "Top strap — typically an HC1 PageHeader." },
  { name: "kpis",      type: "ReactNode", def: "—",  desc: "KPI row — typically an HC1 KpiRow." },
  { name: "primary",   type: "ReactNode", def: "—",  desc: "Primary chart card. 2/3 width on wide screens when secondary is present." },
  { name: "secondary", type: "ReactNode", def: "—",  desc: "Secondary chart / drill-down. 1/3 width; stacks below primary on narrow viewports." },
  { name: "children",  type: "ReactNode", def: "—",  desc: "Anything below the chart row (tables, lists, secondary KpiRows)." },
  { name: "gap",       type: "number",    def: "24", desc: "Vertical gap between regions in px." },
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
          { tone: "must",  text: "Use consistent ChartCard heights across the primary + secondary slots so the row reads as balanced." },
          { tone: "should", text: "For dashboards with 3+ charts, use `children` to drop additional ChartCard rows below the primary/secondary row rather than cramming everything into one line." },
          { tone: "should", text: "Match the KpiRow columns count to the visible KPI count — a 4-column row with 3 KpiCards leaves an awkward gap." },
          { tone: "note",   text: "DashboardHero is a template, not a primitive — it enforces layout but doesn't own any content. Everything inside is a composition of PageHeader / KpiRow / ChartCard." },
        ]}
      />
    </DocBlock>
  );
}
