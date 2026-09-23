import type { ReactNode } from "react";
import { ArrowRight, Filter, Plus, Users } from "lucide-react";
import { PageHeader } from "../../components/page-header";
import { Breadcrumb } from "../../components/breadcrumb";
import { Tabs } from "../../components/tabs";
import { Button } from "../../components/button";
import { Badge } from "../../components/badge";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function PageHeaderDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <BasicBlock />
      <BreadcrumbBlock />
      <TabsBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 PageHeader"
      lead="PageHeader is the standard hero strap at the top of every product page — optional breadcrumb + title + optional description on the left, optional meta or actions on the right, optional tabs row at the bottom. Every IQ route wraps its content in this so type ramp and spacing stay consistent."
    />
  );
}

/* ══════ Basic ═════════════════════════════════════════════════════ */

function BasicBlock() {
  return (
    <DocBlock
      title="Basic"
      lead="Title + subtitle + action buttons. The most common shape — used for dashboards, worklists, and settings pages."
    >
      <Card>
        <PageHeader
          title="Patients"
          subtitle="42 patients across 3 facilities"
          actions={
            <>
              <Button variant="outline">
                <Filter />
                Filter
              </Button>
              <Button>
                <Plus />
                Add patient
              </Button>
            </>
          }
        />
      </Card>
    </DocBlock>
  );
}

/* ══════ With Breadcrumb ════════════════════════════════════════════ */

function BreadcrumbBlock() {
  return (
    <DocBlock
      title="With breadcrumb"
      lead="For detail pages nested inside a hierarchy — the breadcrumb strip renders above the title with a subtle color so it doesn't compete with the title's weight."
    >
      <Card>
        <PageHeader
          breadcrumb={
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#">Patients</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#">Cardiology</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Current>Alicia Reyes</Breadcrumb.Current>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          }
          title="Alicia Reyes"
          subtitle="MRN-000431 · Cardiology · Admitted 2 days ago"
          meta={<Badge variant="danger">Critical</Badge>}
        />
      </Card>
    </DocBlock>
  );
}

/* ══════ With Tabs ═════════════════════════════════════════════════ */

function TabsBlock() {
  return (
    <DocBlock
      title="With tabs"
      lead="Route-level tabs sit at the bottom of the header, on top of the content divider. Use HC1's Tabs primitive inside — the PageHeader handles the surrounding spacing so the tab strip reads as page chrome."
    >
      <Card>
        <PageHeader
          breadcrumb={
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#">Patients</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Current>Alicia Reyes</Breadcrumb.Current>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          }
          title="Alicia Reyes"
          subtitle="MRN-000431 · Cardiology"
          actions={
            <Button variant="outline">
              <Users />
              Assign
              <ArrowRight />
            </Button>
          }
          tabs={
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="history">History</Tabs.Tab>
                <Tabs.Tab value="labs">Labs</Tabs.Tab>
                <Tabs.Tab value="notes">Notes</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          }
        />
        <div
          style={{
            padding: `${t.space.section.sm} 0`,
            ...t.type.body,
            color: t.color.text.tertiary,
          }}
        >
          Tab content would render below the header.
        </div>
      </Card>
    </DocBlock>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        padding: t.space.inline.xl,
      }}
    >
      {children}
    </div>
  );
}

/* ══════ Props ═════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "breadcrumb", type: "ReactNode",         def: "—",     desc: "Optional breadcrumb strip rendered above the title. Compose HC1's Breadcrumb inside." },
  { name: "title",      type: "ReactNode",         def: "—",     desc: "Page title. Rendered as h1 by default." },
  { name: "titleAs",    type: "'h1' | 'h2'",       def: "'h1'",  desc: "Element used to render the title." },
  { name: "subtitle",   type: "ReactNode",         def: "—",     desc: "Short description shown under the title." },
  { name: "meta",       type: "ReactNode",         def: "—",     desc: "Right-aligned informational content (badges, timestamps). Mutually exclusive with actions." },
  { name: "actions",    type: "ReactNode",         def: "—",     desc: "Right-aligned action buttons. Mutually exclusive with meta." },
  { name: "tabs",       type: "ReactNode",         def: "—",     desc: "Tabs row rendered at the bottom of the header (before content). Compose HC1's Tabs inside." },
];

function PropsTableBlock() {
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

/* ══════ Notes ═════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          {
            tone: "must",
            text: "One PageHeader per route. It renders an h1 by default — multiple h1s per page confuse screen readers and violate document outline conventions.",
          },
          {
            tone: "must",
            text: "meta and actions are mutually exclusive — pass one or the other, not both. The right-aligned slot fits only one row of content cleanly.",
          },
          {
            tone: "should",
            text: "Reach for the breadcrumb slot on any page nested more than one level deep. Users navigating from a search result page directly need the trail to orient themselves.",
          },
          {
            tone: "note",
            text: "PageHeader is unopinionated about the surrounding layout — it just renders the strap. Padding, background, and horizontal constraints come from the AppShell.Main / Card / Section it sits inside.",
          },
        ]}
      />

      <Callout tone="info" title="Tabs at the bottom, not the top">
        Tabs render below the title + description with a bottom border shared with the content area. This distinction matters: tabs above the title read as top-level nav (which is Sidebar&apos;s job); tabs below the title read as within-page navigation.
      </Callout>
    </DocBlock>
  );
}
