import type { ReactNode } from "react";
import { Archive, ChevronRight, Star } from "lucide-react";
import { PageTemplate, PatientIdentityStrip } from "../../patterns";
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
      eyebrow="Template · PageTemplate — Detail Page shape"
      title="Detail Page — the standard record-detail template"
      lead="A detail page is a PageTemplate with a PatientIdentityStrip in the eyebrow slot, a PageHeader (breadcrumb + title + tabs + actions) in the header slot, main content as children, and a metadata Card in the aside. Consumer fills the slots; the DS handles the vertical spacing and responsive collapse. Same primitive powers the Dashboard shape — see that doc for the KPI + charts composition."
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
        <PageTemplate
          eyebrow={
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
          aside={
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
                Main tab content renders here. Charts, tables, timelines, lists — PageTemplate doesn&apos;t care what fills the main region.
              </div>
            </Card.Content>
          </Card>
        </PageTemplate>
      </div>
    </DocBlock>
  );
}

/* ══════ Slots ═══════════════════════════════════════════════════ */

function SlotsBlock() {
  return (
    <DocBlock title="Slots" lead="PageTemplate's five slots — eyebrow / header / widgets / children / aside. For a detail page: put PatientIdentityStrip in eyebrow, PageHeader (with tabs) in header, main content as children, metadata Card in aside. Skip aside and children stretches full-width; skip eyebrow for non-record routes.">
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
          <SlotBox>eyebrow · PatientIdentityStrip (opt)</SlotBox>
          <SlotBox>header · PageHeader (title + breadcrumb + tabs + actions)</SlotBox>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <SlotBox>children · main content · 2/3 width on wide</SlotBox>
            <SlotBox>aside · metadata Card · 1/3 width</SlotBox>
          </div>
        </div>
      </div>

      <Callout tone="info" title="Same primitive powers dashboards">
        A dashboard is a PageTemplate with the same shape but different slot content — <code>widgets</code> for a KPI Grid, primary chart as children, secondary chart in aside. See the Dashboard template doc for that composition.
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
  { name: "eyebrow",  type: "ReactNode", def: "—",  desc: "Top strap — typically a PatientIdentityStrip for record-detail routes." },
  { name: "header",   type: "ReactNode", def: "—",  desc: "PageHeader — breadcrumb + title + tabs + actions." },
  { name: "widgets",  type: "ReactNode", def: "—",  desc: "Optional widget row (KPI Grid, filter chips). Detail pages usually skip this." },
  { name: "children", type: "ReactNode", def: "—",  desc: "Main content region — the tab body typically." },
  { name: "aside",    type: "ReactNode", def: "—",  desc: "Right rail — metadata card, related records, timeline. 1/3 width; stacks below children on narrow." },
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
          { tone: "note",   text: "PageTemplate is a template — no content opinions, no chrome. The detail-page shape is a specific composition of PatientIdentityStrip + PageHeader + Card inside the template's slots." },
        ]}
      />
    </DocBlock>
  );
}
