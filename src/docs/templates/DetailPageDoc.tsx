import type { ReactNode } from "react";
import { Archive, ChevronRight, Star } from "lucide-react";
import { DetailPage, PatientIdentityStrip } from "../../patterns";
import { PageHeader } from "../../components/page-header";
import { Breadcrumb } from "../../components/breadcrumb";
import { Tabs } from "../../components/tabs";
import { Card } from "../../components/card";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function DetailPageDoc() {
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
      eyebrow="Template · DetailPage"
      title="DetailPage — the standard record-detail template"
      lead="DetailPage is the layout every record-detail route in HC1 opens with: an optional identity strap (patient / resource identity) → PageHeader (breadcrumb + title + tabs + actions) → two-column body with main content and an optional right rail. Consumer fills the slots; the DS handles the vertical spacing and responsive collapse."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  return (
    <DocBlock title="Full example" lead="Patient chart detail page composed from PatientIdentityStrip + PageHeader (with breadcrumb + tabs + actions) + main content + right rail.">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
        }}
      >
        <DetailPage
          identity={
            <PatientIdentityStrip
              name="Alicia Reyes"
              mrn="MRN-000431"
              severity="critical"
              meta={[
                { label: "Age", value: "62" },
                { label: "Sex", value: "F" },
                { label: "Bed", value: "3E-14" },
              ]}
              actions={
                <>
                  <Button variant="ghost" size="icon-sm" aria-label="Star">
                    <Star />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive />
                    Archive
                  </Button>
                </>
              }
            />
          }
          header={
            <PageHeader
              breadcrumb={
                <Breadcrumb>
                  <Breadcrumb.List>
                    <Breadcrumb.Item><Breadcrumb.Link href="#">Patients</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.Current>Alicia Reyes</Breadcrumb.Current></Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb>
              }
              title="Alicia Reyes"
              subtitle="Admission 2026-09-22 · Encounter #EN-4421"
              actions={
                <Button>
                  Open chart
                  <ChevronRight />
                </Button>
              }
              tabs={
                <Tabs defaultValue="overview">
                  <Tabs.List>
                    <Tabs.Tab value="overview">Overview</Tabs.Tab>
                    <Tabs.Tab value="labs">Labs</Tabs.Tab>
                    <Tabs.Tab value="notes">Notes</Tabs.Tab>
                    <Tabs.Tab value="history">History</Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              }
            />
          }
          sidebar={
            <Card>
              <Card.Header>
                <Card.Title>Care team</Card.Title>
                <Card.Description>Primary + on-call</Card.Description>
              </Card.Header>
              <Card.Content>
                <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm, ...t.type.bodyS, color: t.color.text.secondary }}>
                  <div><strong>Dr. Cooper</strong> · Primary</div>
                  <div><strong>Dr. Riley</strong> · Attending</div>
                  <div><strong>Dr. Patel</strong> · On-call</div>
                </div>
              </Card.Content>
            </Card>
          }
        >
          <Card>
            <Card.Header>
              <Card.Title>Vitals — last 24 hours</Card.Title>
              <Card.Description>All measurements within expected range</Card.Description>
            </Card.Header>
            <Card.Content>
              <div style={{ ...t.type.body, color: t.color.text.secondary }}>
                Main tab content renders here. Charts, tables, timelines, lists — DetailPage doesn&apos;t care what fills the main region.
              </div>
            </Card.Content>
          </Card>
        </DetailPage>
      </div>
    </DocBlock>
  );
}

/* ══════ Slots ═══════════════════════════════════════════════════ */

function SlotsBlock() {
  return (
    <DocBlock title="Slots" lead="Four optional slots — the DS renders whichever ones you pass. Skip `sidebar` and `main` stretches full-width. Skip `identity` for non-record routes (docs pages, admin panels).">
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
            gridTemplateRows: "40px 80px 200px",
            gap: 12,
            fontFamily: t.font.mono,
            fontSize: 11,
            color: t.color.text.tertiary,
          }}
        >
          <SlotBox>identity · PatientIdentityStrip (opt)</SlotBox>
          <SlotBox>header · PageHeader (title + breadcrumb + tabs + actions)</SlotBox>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <SlotBox>main (children) · 2/3 width on wide</SlotBox>
            <SlotBox>sidebar · 1/3 width</SlotBox>
          </div>
        </div>
      </div>

      <Callout tone="info" title="Composition with DashboardHero">
        DetailPage and DashboardHero share the same 2/3 + 1/3 chart-row shape. DetailPage adds an identity strap on top and puts the tabs inside the header; DashboardHero uses the main region for KPIs + charts.
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

/* ══════ Props ═══════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "identity", type: "ReactNode", def: "—",  desc: "Optional identity strap — typically a PatientIdentityStrip." },
  { name: "header",   type: "ReactNode", def: "—",  desc: "PageHeader — breadcrumb + title + tabs + actions." },
  { name: "sidebar",  type: "ReactNode", def: "—",  desc: "Right rail — metadata card, related records, timeline." },
  { name: "children", type: "ReactNode", def: "—",  desc: "Main content region — the tab body typically." },
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

/* ══════ Notes ═══════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          { tone: "must",   text: "Render the identity strap on every route inside a patient chart. Clinicians look at it to confirm the record every few minutes." },
          { tone: "should", text: "Match the sidebar to the tab. The 'Overview' tab's sidebar might show care team; the 'Labs' tab's sidebar might show recent trends. Sidebar content that never changes is a Card, not a sidebar." },
          { tone: "note",   text: "DetailPage is a template — no content opinions, no chrome. It's a layout wrapper around DS primitives." },
        ]}
      />
    </DocBlock>
  );
}
