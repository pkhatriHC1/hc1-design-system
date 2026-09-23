import type { ReactNode } from "react";
import { Bell, Home, Search, User } from "lucide-react";
import { AppShell } from "../../components/app-shell";
import { Sidebar } from "../../components/sidebar";
import { Button } from "../../components/button";
import { Badge } from "../../components/badge";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function AppShellDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <LiveBlock />
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
      title="The canonical HC1 AppShell"
      lead="AppShell is the standard product-page frame every IQ product wraps around itself. Root distributes children by displayName — AppShell.Header on top (optional), Sidebar + AppShell.Main in the middle row, AppShell.Footer at the bottom (optional). Wire it once at the app root and every route inherits the same frame."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Four slots. Header + Footer are optional; Sidebar + Main are the standard content row."
    >
      <div
        style={{
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(560px, 100%)",
            height: 260,
            display: "grid",
            gridTemplateRows: "36px 1fr 28px",
            border: `1px solid ${t.color.border.default}`,
            borderRadius: t.radius.control,
            overflow: "hidden",
            fontFamily: t.font.mono,
            fontSize: 11,
            color: t.color.text.tertiary,
            background: t.color.background.default,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingInline: 12,
              background: t.color.background.subtle,
              borderBottom: `1px solid ${t.color.border.subtle}`,
            }}
          >
            AppShell.Header
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr" }}>
            <div
              style={{
                background: t.color.background.inverse,
                color: t.color.text.inverse,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Sidebar
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              AppShell.Main
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingInline: 12,
              background: t.color.background.subtle,
              borderTop: `1px solid ${t.color.border.subtle}`,
            }}
          >
            AppShell.Footer
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="AppShell.Header" desc="Optional top bar. Global chrome — brand mark, breadcrumbs, search, user menu. Full-width, shrink-to-content height. Has a bottom divider by default." />
        <Part name="Sidebar"         desc="Left rail. Not an AppShell subcomponent — the actual Sidebar primitive. AppShell auto-wraps in SidebarProvider so Sidebar.Trigger placed anywhere inside (e.g. in the Header) controls collapse." />
        <Part name="AppShell.Main"   desc="Right column. Scrolls its own content while the sidebar stays fixed. Optional maxWidth + center for constrained content layouts." />
        <Part name="AppShell.Footer" desc="Optional bottom bar. Status text, keyboard shortcut hints, environment badges. Shrink-to-content height with a top divider." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code style={{ fontWeight: 600, color: t.color.text.primary, fontFamily: t.font.mono, fontSize: 13 }}>
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  return (
    <DocBlock
      title="Live example"
      lead="A full-height shell with a header (search + user chip), sidebar, main content, and a footer with environment info."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          overflow: "hidden",
          height: 520,
        }}
      >
        <AppShell>
          <AppShell.Header>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
              <Sidebar.Trigger />
              <span
                style={{
                  fontFamily: t.font.mono,
                  fontSize: 13,
                  color: t.color.text.secondary,
                }}
              >
                clinical-iq /
              </span>
              <strong style={{ ...t.type.bodyS, color: t.color.text.primary }}>Overview</strong>
            </div>
            <Button variant="ghost" size="sm">
              <Search />
              Search
              <Badge variant="neutral">⌘K</Badge>
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <Bell />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Account">
              <User />
            </Button>
          </AppShell.Header>

          <Sidebar defaultCollapsed persistKey={false} ariaLabel="Preview sidebar">
            <Sidebar.Header />
            <Sidebar.Section>
              <Sidebar.Item icon={<Home />} label="Overview" href="#" active />
              <Sidebar.Item icon={<Search />} label="Reports" href="#" />
              <Sidebar.Item icon={<User />} label="Account" href="#" />
            </Sidebar.Section>
          </Sidebar>

          <AppShell.Main maxWidth={720} center>
            <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
              <h1 style={{ margin: 0, ...t.type.headingS, color: t.color.text.primary }}>
                Overview
              </h1>
              <p style={{ ...t.type.body, color: t.color.text.secondary, margin: 0 }}>
                This is {"<AppShell.Main>"} with a constrained max width of 720px and centered
                content. Real product routes render page content here.
              </p>
              <div
                style={{
                  border: `1px solid ${t.color.border.subtle}`,
                  borderRadius: t.radius.control,
                  padding: t.space.inline.lg,
                  background: t.color.background.subtle,
                  color: t.color.text.tertiary,
                  ...t.type.caption,
                }}
              >
                Scrollable region — try resizing the browser and scrolling; the sidebar and
                header stay fixed while this column scrolls.
              </div>
            </div>
          </AppShell.Main>

          <AppShell.Footer>
            <span>Environment: <strong>preview</strong></span>
            <span style={{ marginLeft: "auto" }}>Version 0.13.0</span>
          </AppShell.Footer>
        </AppShell>
      </div>
    </DocBlock>
  );
}

/* ══════ Props ═════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const HEADER_PROPS: PropRow[] = [
  { name: "divider", type: "boolean",          def: "true",         desc: "Draw a bottom border between the header and the content row." },
  { name: "padding", type: "number | string",  def: "'12px 24px'",  desc: "Padding around the header content." },
];

const MAIN_PROPS: PropRow[] = [
  { name: "maxWidth", type: "number | string", def: "100%",  desc: "Constrain the main-content column to a max width." },
  { name: "center",   type: "boolean",         def: "false", desc: "Center the constrained content horizontally. Ignored when maxWidth is 100%." },
  { name: "padding",  type: "number | string", def: "24",    desc: "Padding around the main content." },
];

const FOOTER_PROPS: PropRow[] = [
  { name: "divider", type: "boolean",          def: "true",         desc: "Draw a top border between the footer and the content row." },
  { name: "padding", type: "number | string",  def: "'8px 24px'",   desc: "Padding around the footer content." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>AppShell.Header</PropSectionEyebrow>
      <PropsTable rows={HEADER_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>AppShell.Main</PropSectionEyebrow>
        <PropsTable rows={MAIN_PROPS} />
      </div>
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>AppShell.Footer</PropSectionEyebrow>
        <PropsTable rows={FOOTER_PROPS} />
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
          gridTemplateColumns: "160px 1.4fr 160px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 160px 2fr",
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
            text: "AppShell is meant to wrap the entire route tree, not individual pages. Mount it above the router; render each route inside AppShell.Main.",
          },
          {
            tone: "must",
            text: "AppShell auto-wraps its children in SidebarProvider, so Sidebar.Trigger placed anywhere inside (like the AppShell.Header) controls the sidebar's collapse state without extra wiring.",
          },
          {
            tone: "should",
            text: "Reach for maxWidth + center on AppShell.Main for detail pages that read as centered content (settings, docs, single-record views). Leave it at 100% for dashboards and worklists.",
          },
          {
            tone: "note",
            text: "The root uses h-[100dvh] (dynamic viewport height) so mobile browsers with retracting URL bars get an honest full-height shell.",
          },
        ]}
      />

      <Callout tone="info" title="When to skip the shell">
        Not every screen wants a shell. Login pages, printable views, and embedded dashboards usually don&apos;t. Skip AppShell entirely on those routes and render the content directly.
      </Callout>
    </DocBlock>
  );
}
