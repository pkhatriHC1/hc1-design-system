import type { ReactNode } from "react";
import { Home, Search, User } from "lucide-react";
import { AppShell } from "../../components/app-shell";
import { Sidebar } from "../../components/sidebar";
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
      lead="AppShell is the standard product-page frame every IQ product wraps around itself. Root distributes children by displayName — AppShell.TopBar on top (the standard hc1 bar; AppShell.Header is the legacy free-form slot), Sidebar + AppShell.Main in the middle row, AppShell.Footer at the bottom (optional). Wire it once at the app root and every route inherits the same frame."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="TopBar on top, Sidebar + Main as the content row, an optional Footer. AppShell.Header remains only for products still migrating."
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
            AppShell.TopBar
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
        <Part name="AppShell.TopBar" desc="The standard hc1 top bar, 64px high. Fixed slots in a fixed order; products switch optional slots on or off. Use this, not AppShell.Header, in every product." />
        <Part name="AppShell.Header" desc="Legacy free-form top bar. Kept for existing products during migration; new screens use AppShell.TopBar." />
        <Part name="Sidebar"         desc="Left rail. Not an AppShell subcomponent — the actual Sidebar primitive. AppShell auto-wraps in SidebarProvider so Sidebar.Trigger placed anywhere inside (e.g. in the Header) controls collapse." />
        <Part name="AppShell.Main"   desc="Right column. Scrolls its own content while the sidebar stays fixed. Defaults to 32px padding and a 1440px max width (the SourceIQ standard)." />
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
      lead="A full-height shell with the standard top bar (every optional slot switched on), sidebar, main content, and a footer with environment info."
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
          <AppShell.TopBar
            product={{ name: "SourceIQ" }}
            context="Memorial General Hospital"
            search={{ placeholder: "Search", shortcut: "⌘K", onOpen: () => {} }}
            assistant={{ onClick: () => {} }}
            notifications={{ count: 3, onClick: () => {} }}
            user={{ name: "Lisa Chen", role: "Category Manager", email: "lisa.chen@hc1.com", menu: [
              { label: "Profile", onSelect: () => {} },
              { label: "Preferences", onSelect: () => {} },
              { label: "Sign out", destructive: true, separatorBefore: true, onSelect: () => {} },
            ] }}
          />

          <Sidebar defaultCollapsed persistKey={false} ariaLabel="Preview sidebar">
            <Sidebar.Header />
            <Sidebar.Section>
              <Sidebar.Item icon={<Home />} label="Overview" href="#" active />
              <Sidebar.Item icon={<Search />} label="Reports" href="#" />
              <Sidebar.Item icon={<User />} label="Account" href="#" />
            </Sidebar.Section>
          </Sidebar>

          <AppShell.Main>
            <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
              <h1 style={{ margin: 0, ...t.type.headingS, color: t.color.text.primary }}>
                Overview
              </h1>
              <p style={{ ...t.type.body, color: t.color.text.secondary, margin: 0 }}>
                This is {"<AppShell.Main>"} with its standard 32px padding and 1440px max
                width. Real product routes render a PageTemplate here.
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

const TOPBAR_PROPS: PropRow[] = [
  { name: "product",       type: "{ name; logo?; href? }",                  def: "—", desc: "Required. Product name, optional logo and home link. Always on the left." },
  { name: "user",          type: "{ name; role?; avatarSrc?; email?; menu?; onClick? }",   def: "—", desc: "Required. Avatar, name and role. Always last on the right. Pass `menu` (label, icon?, onSelect, destructive?, separatorBefore?) to open the standard user menu with name, role and email at the top." },
  { name: "context",       type: "ReactNode",                               def: "—", desc: "Optional. Organisation, site or patient context, after a divider next to the product." },
  { name: "search",        type: "{ placeholder?; shortcut?; onOpen }",     def: "—", desc: "Optional. A search trigger that opens your search or command palette." },
  { name: "assistant",     type: "{ label?; onClick }",                     def: "—", desc: "Optional. The amber IQ Assistant launcher. Pair it with <AssistantPanel>." },
  { name: "notifications", type: "{ count?; onClick }",                     def: "—", desc: "Optional. Bell button with a red unread count (99+ cap)." },
  { name: "help",          type: "{ href?; onClick? }",                     def: "—", desc: "Optional. Help button; an href opens in a new tab." },
];

const HEADER_PROPS: PropRow[] = [
  { name: "divider", type: "boolean",          def: "true",         desc: "Draw a bottom border between the header and the content row." },
  { name: "padding", type: "number | string",  def: "'12px 24px'",  desc: "Padding around the header content." },
];

const MAIN_PROPS: PropRow[] = [
  { name: "maxWidth", type: "number | string", def: "1440px", desc: "Max width of the content column (--hc-page-max-width). Was 100% before 0.16." },
  { name: "center",   type: "boolean",         def: "false", desc: "Center the constrained content horizontally. Ignored when maxWidth is 100%." },
  { name: "padding",  type: "number | string", def: "32px",  desc: "Padding around the main content (--hc-page-pad). Was 24 before 0.16." },
];

const FOOTER_PROPS: PropRow[] = [
  { name: "divider", type: "boolean",          def: "true",         desc: "Draw a top border between the footer and the content row." },
  { name: "padding", type: "number | string",  def: "'8px 24px'",   desc: "Padding around the footer content." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>AppShell.TopBar</PropSectionEyebrow>
      <PropsTable rows={TOPBAR_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>AppShell.Header (legacy)</PropSectionEyebrow>
        <PropsTable rows={HEADER_PROPS} />
      </div>
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
            tone: "must",
            text: "Use AppShell.TopBar for the top bar. It has no className, style or children on purpose: products switch slots on or off but never restyle or add to the bar. Need a new slot? Propose it for the design system.",
          },
          {
            tone: "should",
            text: "Keep AppShell.Main at its defaults (32px padding, 1440px max width). For centred single-column pages, use PageTemplate variant=\"focused\" rather than changing maxWidth.",
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
