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
  Grid,
  KpiCard,
  PageTemplate,
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
      eyebrow="Template · PageTemplate — Dashboard shape"
      title="Dashboard — the standard landing template"
      lead="A dashboard is a PageTemplate with a PageHeader in the header slot, a KPI Grid in the widgets slot, a primary ChartCard as children (main region), and a secondary ChartCard as aside. Consumer fills the slots; the DS handles the spacing + responsive collapse. Same primitive powers the Detail Page shape — see that doc for the record-detail composition."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  return (
    <DocBlock
      title="Full example"
      lead="A real dashboard composed from PageHeader + Grid of 4 KpiCards + primary bar chart + secondary pie chart, all inside a PageTemplate."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
        }}
      >
        <PageTemplate
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
          widgets={
            <Grid columns={4}>
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
            </Grid>
          }
          aside={
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
        >
          <ChartCard title="Monthly reports" description="Last 6 months, all departments">
            <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--hc-color-border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--hc-color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </PageTemplate>
      </div>
    </DocBlock>
  );
}

/* ══════ Slots ══════════════════════════════════════════════════════ */

function SlotsBlock() {
  return (
    <DocBlock
      title="Slots"
      lead="PageTemplate's five slots — eyebrow / header / widgets / main children / aside. For a dashboard: skip eyebrow, put PageHeader in header, KPI Grid in widgets, primary chart as children, secondary chart in aside. Skip aside and children stretches full-width."
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
          <SlotBox>widgets · Grid of KpiCards</SlotBox>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <SlotBox>children · primary ChartCard (2/3 width on wide)</SlotBox>
            <SlotBox>aside · secondary ChartCard (1/3 width)</SlotBox>
          </div>
        </div>
      </div>

      <Callout tone="info" title="Same primitive powers detail pages">
        The record-detail shape uses the same PageTemplate with different slot content — <code>eyebrow</code> for the PatientIdentityStrip, <code>aside</code> for a metadata Card. See the Detail Page template doc for that composition.
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
  { name: "eyebrow",  type: "ReactNode", def: "—",  desc: "Top strap above the header. Skip for a plain dashboard; use for a nested-context strap." },
  { name: "header",   type: "ReactNode", def: "—",  desc: "Header slot — typically an HC1 PageHeader." },
  { name: "widgets",  type: "ReactNode", def: "—",  desc: "Widget row below the header — Grid of KpiCards, filter chips, stats callouts." },
  { name: "children", type: "ReactNode", def: "—",  desc: "Main content — the primary chart card. 2/3 width when aside is present, full-width otherwise." },
  { name: "aside",    type: "ReactNode", def: "—",  desc: "Right rail — secondary chart or drill-down. 1/3 width; stacks below children on narrow." },
  { name: "gap",      type: "number",    def: "24", desc: "Vertical gap between regions in px." },
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
          { tone: "should", text: "Match the Grid columns count to the visible KPI count — a 4-column Grid with 3 KpiCards leaves an awkward gap." },
          { tone: "note",   text: "PageTemplate is a template, not a primitive — it enforces layout but doesn't own any content. The dashboard shape is a specific composition of PageHeader + Grid + KpiCard + ChartCard inside the template's slots." },
        ]}
      />
    </DocBlock>
  );
}
