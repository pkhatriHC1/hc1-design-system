import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  Clock,
  FileText,
  Home,
  LayoutGrid,
  MessagesSquare,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Badge } from "../../components/badge";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function SidebarDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CollapseBlock />
      <GroupBlock />
      <PlaygroundBlock />
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
      title="The canonical HC1 Sidebar"
      lead="Sidebar is the standard left-hand navigation for every IQ product. It owns the dark gradient chrome, the collapse animation and keyboard shortcut (Cmd/Ctrl+B), localStorage persistence, active-state visuals, hover/focus rings, tooltip-on-collapsed, and the ARIA navigation landmark. Consumers own only the list of routes — which items exist, their icons, hrefs, and which one is active."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Six subcomponents in one compound: Header, Section, Item, Group (new), Footer, Trigger. Item ships as either an anchor (`href`) or a button (`onClick`) form — the DS picks based on which prop you pass."
    >
      <div
        style={{
          padding: t.space.inline.lg,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: 520,
            display: "flex",
            gap: t.space.inline.md,
            padding: t.space.inline.md,
            background: t.color.background.inverse,
            borderRadius: t.radius.control,
          }}
        >
          <Sidebar
            defaultCollapsed={false}
            persistKey={false}
            ariaLabel="Documentation preview"
          >
            <Sidebar.Header
              
              action={{ label: "New batch", icon: <LayoutGrid />, onClick: () => {} }}
            />
            <Sidebar.Section title="Workspace">
              <Sidebar.Item icon={<Home />} label="Overview" href="#overview" active />
              <Sidebar.Item icon={<BarChart3 />} label="Reports" href="#reports" badge={<Badge variant="info">3</Badge>} />
              <Sidebar.Item icon={<Users />} label="Patients" href="#patients" />
              <Sidebar.Item icon={<Clock />} label="Recent activity" href="#recent" />
            </Sidebar.Section>
            <Sidebar.Section title="Account">
              <Sidebar.Item icon={<Settings />} label="Settings" href="#settings" />
              <Sidebar.Item icon={<MessagesSquare />} label="Support" href="#support" />
            </Sidebar.Section>
            <Sidebar.Footer>
              <span>Version 0.13.0</span>
            </Sidebar.Footer>
          </Sidebar>
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
        <Part name="Header"  desc="Built-in toggle button (X when expanded, hamburger when collapsed) + optional brand + optional primary action. Toggle uses the shared context to flip collapse state; brand is opt-in (most products just show the toggle)." />
        <Part name="Section" desc="Titled group of items. Title renders as an uppercase strap; hidden when the sidebar is collapsed." />
        <Part name="Item"    desc="A single nav row. Renders as an anchor (`href`) or a button (`onClick`). Owns icon, label, active state, badge, and collapsed-mode tooltip." />
        <Part name="Group"   desc="New in 0.13 — collapsible parent row that reveals nested Items on click. Trailing chevron rotates on open." />
        <Part name="Footer"  desc="Small meta slot pinned to the bottom. Hidden when the sidebar is collapsed." />
        <Part name="Trigger" desc="A standalone collapse/expand button. Usually placed in the AppShell top bar for mobile." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code
        style={{
          fontWeight: 600,
          color: t.color.text.primary,
          fontFamily: t.font.mono,
          fontSize: 13,
        }}
      >
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Collapse ═══════════════════════════════════════════════════ */

function CollapseBlock() {
  return (
    <DocBlock
      title="Collapsed rail"
      lead="Collapse shrinks the sidebar to an icon-only rail. Labels disappear, badges disappear, footer disappears, and every Item shows its label as a right-side tooltip on hover / focus. State persists across reloads via localStorage (opt out with `persistKey={false}`)."
    >
      <div
        style={{
          padding: t.space.inline.lg,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: 420,
            display: "flex",
            gap: t.space.inline.md,
            padding: t.space.inline.md,
            background: t.color.background.inverse,
            borderRadius: t.radius.control,
          }}
        >
          <Sidebar defaultCollapsed persistKey={false} ariaLabel="Collapsed preview">
            <Sidebar.Header
              
              action={{ label: "New batch", icon: <LayoutGrid />, onClick: () => {} }}
            />
            <Sidebar.Section>
              <Sidebar.Item icon={<Home />} label="Overview" href="#" active />
              <Sidebar.Item icon={<BarChart3 />} label="Reports" href="#" />
              <Sidebar.Item icon={<Users />} label="Patients" href="#" />
              <Sidebar.Item icon={<Clock />} label="Recent" href="#" />
              <Sidebar.Item icon={<Settings />} label="Settings" href="#" />
            </Sidebar.Section>
          </Sidebar>
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Group ══════════════════════════════════════════════════════ */

function GroupBlock() {
  return (
    <DocBlock
      title="Sidebar.Group"
      lead="Collapsible parent row that holds nested Items or nested Groups. Renders like Item at rest (same 48px pill, same icon/label/badge slots, same hover / focus / tooltip behavior) plus a trailing chevron that rotates on open. State is uncontrolled (`defaultOpen`) or controlled (`open` + `onOpenChange`) — pick controlled when you want to open a group programmatically after route matches a nested child."
    >
      <div
        style={{
          padding: t.space.inline.lg,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: 520,
            display: "flex",
            gap: t.space.inline.md,
            padding: t.space.inline.md,
            background: t.color.background.inverse,
            borderRadius: t.radius.control,
          }}
        >
          <Sidebar defaultCollapsed={false} persistKey={false} ariaLabel="Group preview">
            <Sidebar.Header  />
            <Sidebar.Section>
              <Sidebar.Item icon={<Home />} label="Overview" href="#" />
              <Sidebar.Group icon={<Users />} label="Patients" defaultOpen active badge={<Badge variant="info">32</Badge>}>
                <Sidebar.Item icon={<LayoutGrid />} label="All patients" href="#" active />
                <Sidebar.Item icon={<Clock />} label="Recent" href="#" />
                <Sidebar.Item icon={<Star />} label="Starred" href="#" />
              </Sidebar.Group>
              <Sidebar.Group icon={<Building2 />} label="Facilities">
                <Sidebar.Item icon={<FileText />} label="Locations" href="#" />
                <Sidebar.Item icon={<FileText />} label="Departments" href="#" />
              </Sidebar.Group>
              <Sidebar.Item icon={<Settings />} label="Settings" href="#" />
            </Sidebar.Section>
          </Sidebar>
        </div>
      </div>

      <Callout tone="warning" title="Collapsed-rail behaviour">
        When the sidebar is collapsed, a Group renders as an icon-only row with a tooltip — its children are hidden entirely. Fan-out popover UX is deliberately out of scope for this primitive. If a consumer needs a nested menu in the collapsed rail, they should render a DropdownMenu on the Group's icon click and hand the DS the composition, not vice-versa.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [collapsed, setCollapsed] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [showGroup, setShowGroup] = useState(true);

  return (
    <DocBlock
      title="Playground"
      lead="Toggle every top-level knob and see how the rail responds."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: t.space.inline.lg,
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              height: 480,
              display: "flex",
              gap: t.space.inline.md,
              padding: t.space.inline.md,
              background: t.color.background.inverse,
              borderRadius: t.radius.control,
            }}
          >
            <Sidebar
              collapsed={collapsed}
              onCollapsedChange={setCollapsed}
              persistKey={false}
              ariaLabel="Playground preview"
            >
              <Sidebar.Header
                
                action={{ label: "New batch", icon: <LayoutGrid />, onClick: () => {} }}
              />
              <Sidebar.Section title="Workspace">
                <Sidebar.Item icon={<Home />} label="Overview" href="#" active />
                <Sidebar.Item
                  icon={<BarChart3 />}
                  label="Reports"
                  href="#"
                  badge={showBadge ? <Badge variant="info">3</Badge> : undefined}
                />
                {showGroup ? (
                  <Sidebar.Group icon={<Users />} label="Patients" defaultOpen>
                    <Sidebar.Item icon={<LayoutGrid />} label="All patients" href="#" />
                    <Sidebar.Item icon={<Clock />} label="Recent" href="#" />
                  </Sidebar.Group>
                ) : (
                  <Sidebar.Item icon={<Users />} label="Patients" href="#" />
                )}
              </Sidebar.Section>
              {showFooter && (
                <Sidebar.Footer>
                  <span>Version 0.13.0</span>
                </Sidebar.Footer>
              )}
            </Sidebar>
          </div>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <ToggleControl label="collapsed" value={collapsed} onChange={setCollapsed} />
          <ToggleControl label="showFooter" value={showFooter} onChange={setShowFooter} />
          <ToggleControl label="showBadge" value={showBadge} onChange={setShowBadge} />
          <ToggleControl label="showGroup" value={showGroup} onChange={setShowGroup} />
        </div>
      </div>
    </DocBlock>
  );
}

function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: t.space.inline.md,
        padding: `${t.space.stack.sm} ${t.space.inline.md}`,
        borderRadius: t.radius.control,
        border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default,
        cursor: "pointer",
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
      {children}
    </span>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const ROOT_PROPS: PropRow[] = [
  { name: "collapsed",         type: "boolean",                              def: "—",           desc: "Controlled collapsed state. Pair with onCollapsedChange." },
  { name: "defaultCollapsed",  type: "boolean",                              def: "false",       desc: "Uncontrolled initial collapsed state." },
  { name: "onCollapsedChange", type: "(collapsed: boolean) => void",         def: "—",           desc: "Fires when the trigger, shortcut, or an Item click toggles collapse." },
  { name: "persistKey",        type: "string | false",                       def: "'hc-sidebar-collapsed'", desc: "localStorage key for collapsed state. `false` disables persistence." },
  { name: "keyboardShortcut",  type: "string | false",                       def: "'b'",         desc: "Cmd/Ctrl+<key> toggles collapse. `false` disables the shortcut." },
  { name: "ariaLabel",         type: "string",                               def: "'Primary'",   desc: "Accessible name for the <nav> landmark." },
];

const GROUP_PROPS: PropRow[] = [
  { name: "icon",         type: "ReactNode",                     def: "—",     desc: "Leading icon — matches Sidebar.Item's icon slot." },
  { name: "label",        type: "string",                        def: "—",     desc: "Trigger label. Used as the collapsed-tooltip content by default." },
  { name: "badge",        type: "ReactNode",                     def: "—",     desc: "Optional trailing badge. Hidden when the sidebar is collapsed." },
  { name: "active",       type: "boolean",                       def: "false", desc: "Reserved for 'a descendant item is active'. Purely visual — consumer derives it from the router." },
  { name: "open",         type: "boolean",                       def: "—",     desc: "Controlled open state. Pair with onOpenChange." },
  { name: "defaultOpen",  type: "boolean",                       def: "false", desc: "Uncontrolled initial open state." },
  { name: "onOpenChange", type: "(open: boolean) => void",       def: "—",     desc: "Fires when the group opens or closes." },
  { name: "tooltip",      type: "ReactNode",                     def: "label", desc: "Content shown when the sidebar is collapsed and the trigger is hovered / focused." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>Sidebar (root)</PropSectionEyebrow>
      <PropsTable rows={ROOT_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>Sidebar.Group</PropSectionEyebrow>
        <PropsTable rows={GROUP_PROPS} />
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
          gridTemplateColumns: "180px 1.4fr 140px 2fr",
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
            gridTemplateColumns: "180px 1.4fr 140px 2fr",
            padding: `${t.space.inline.md} ${t.space.inline.lg}`,
            borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
            alignItems: "start",
            gap: t.space.inline.md,
          }}
        >
          <code
            style={{
              fontFamily: t.font.mono,
              fontSize: 13,
              color: t.color.action.primary,
              fontWeight: 600,
            }}
          >
            {row.name}
          </code>
          <code
            style={{
              fontFamily: t.font.mono,
              fontSize: 12,
              color: t.color.text.secondary,
              wordBreak: "break-word",
            }}
          >
            {row.type}
          </code>
          <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
            {row.def}
          </code>
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
            text: "Use `href` for real routes and `onClick` for actions that aren't navigation. Do not fake a link with an onClick handler — screen readers and middle-click won't behave correctly.",
          },
          {
            tone: "must",
            text: "Mark exactly one Item as `active` per section based on the current route. The DS applies aria-current='page' on the marked item.",
          },
          {
            tone: "should",
            text: "Group nested routes with Sidebar.Group when there are 3+ children. Two children are usually easier to read as flat items.",
          },
          {
            tone: "note",
            text: "Sidebar auto-provides context to its subcomponents. If the collapse Trigger lives outside the sidebar (e.g. in an AppShell top bar), wrap both in <SidebarProvider> so state is shared.",
          },
          {
            tone: "note",
            text: "Height comes from the app shell — Sidebar itself is a self-contained column. Match --hc-space-32/48 tokens from the primitive; do not restyle heights via consumer classes.",
          },
        ]}
      />
    </DocBlock>
  );
}
