import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Command,
  Copy,
  Download,
  Home,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sun,
  Trash2,
  Users,
} from "lucide-react";
import { CommandPalette } from "../../patterns";
import type { CommandItem } from "../../patterns";
import { Button } from "../../components/button";
import { Badge } from "../../components/badge";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function CommandPaletteDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <LiveBlock />
      <ShortcutBlock />
      <KeywordsBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · CommandPalette"
      title="CommandPalette — ⌘K global command surface"
      lead="CommandPalette is the standard ⌘K / Ctrl+K palette pattern. Wraps Dialog with a search input at the top and a filterable list of commands below. Commands are a flat config array; the palette groups them by section, filters against label + description + keywords, and fires the action on Enter. Consumers own the open state and the keyboard shortcut binding — the DS renders the palette."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>("—");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const commands: CommandItem[] = useMemo(
    () => [
      { id: "goto-dashboard", label: "Go to dashboard",   icon: <Home />,       group: "Navigation", shortcut: "⌘1", action: () => setLastAction("navigate → dashboard") },
      { id: "goto-reports",   label: "Go to reports",     icon: <BarChart3 />,  group: "Navigation", shortcut: "⌘2", action: () => setLastAction("navigate → reports") },
      { id: "goto-patients",  label: "Go to patients",    icon: <Users />,      group: "Navigation", shortcut: "⌘3", action: () => setLastAction("navigate → patients") },
      { id: "goto-settings",  label: "Open settings",     icon: <Settings />,   group: "Navigation", shortcut: "⌘,", action: () => setLastAction("navigate → settings") },

      { id: "create-batch",   label: "Create new batch",  description: "Start a new analysis batch", icon: <Plus />, group: "Actions", shortcut: "⌘N", action: () => setLastAction("create batch") },
      { id: "copy-link",      label: "Copy share link",   icon: <Copy />,       group: "Actions", shortcut: "⌘L", action: () => setLastAction("copy link") },
      { id: "export-csv",     label: "Export as CSV",     icon: <Download />,   group: "Actions", action: () => setLastAction("export csv") },

      { id: "toggle-theme",   label: theme === "light" ? "Switch to dark mode" : "Switch to light mode", icon: theme === "light" ? <Moon /> : <Sun />, group: "Preferences", keywords: ["theme", "appearance", "night", "dark"], action: () => { setTheme(theme === "light" ? "dark" : "light"); setLastAction(`theme → ${theme === "light" ? "dark" : "light"}`); } },
      { id: "sign-out",       label: "Sign out",          icon: <LogOut />,     group: "Preferences", action: () => setLastAction("sign out") },

      { id: "delete-record",  label: "Delete this record", description: "Requires admin permission", icon: <Trash2 />, group: "Actions", disabled: true, action: () => setLastAction("noop") },
    ],
    [theme],
  );

  /* Cmd+K to open the palette from anywhere in the page. */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <DocBlock
      title="Live example"
      lead="Cmd+K (or Ctrl+K) opens the palette from anywhere on this page. Type to filter, ArrowUp/Down to navigate, Enter to run. The 'Delete this record' row is disabled — see how keyboard nav skips it."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: t.space.stack.md,
        }}
      >
        <Button onClick={() => setOpen(true)}>
          <Command />
          Open command palette
          <Badge variant="neutral">⌘K</Badge>
        </Button>

        <div
          style={{
            fontFamily: t.font.mono,
            fontSize: 12,
            color: t.color.text.secondary,
          }}
        >
          last action: <strong>{lastAction}</strong>
        </div>
      </div>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={commands}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcut binding ═════════════════════════════════ */

function ShortcutBlock() {
  return (
    <DocBlock
      title="Wiring the ⌘K binding"
      lead="The DS doesn't bind the keyboard shortcut for you — consumers own that so the palette can coexist with other Cmd+K listeners in the app. The pattern is a global keydown listener on window."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.lg,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: t.font.mono,
            fontSize: 12,
            lineHeight: 1.6,
            color: t.color.text.primary,
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
{`const [open, setOpen] = useState(false);

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setOpen(true);
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={commands}
/>`}
        </pre>
      </div>
    </DocBlock>
  );
}

/* ══════ Keywords / aliases ═══════════════════════════════════════ */

function KeywordsBlock() {
  return (
    <DocBlock
      title="Keywords + custom filter"
      lead="Every command has a `keywords` array for search aliases the label doesn't cover. In the live demo above, 'Switch to dark mode' matches typing 'night', 'appearance', or 'theme' — the labels stay clean but the palette still finds the command. For advanced filtering (fuzzy match, scoring, remote search) pass a custom `filter` function."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.lg,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: t.font.mono,
            fontSize: 12,
            lineHeight: 1.6,
            color: t.color.text.primary,
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
{`// Aliases — 'night' or 'appearance' finds 'Switch to dark mode'
{
  id: "toggle-theme",
  label: "Switch to dark mode",
  icon: <Moon />,
  keywords: ["theme", "appearance", "night", "dark"],
  action: () => setTheme("dark"),
}

// Custom filter — fuzzy match instead of substring
<CommandPalette
  commands={commands}
  filter={(cmd, query) => fuzzyMatch(cmd.label, query)}
/>`}
        </pre>
      </div>
    </DocBlock>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const ROOT_PROPS: PropRow[] = [
  { name: "open",          type: "boolean",                          def: "—",     desc: "Controlled open state. Pair with onOpenChange." },
  { name: "onOpenChange",  type: "(open: boolean) => void",          def: "—",     desc: "Fires when the palette opens or closes." },
  { name: "commands",      type: "CommandItem[]",                    def: "—",     desc: "Command definitions. First-seen order determines group order." },
  { name: "placeholder",   type: "string",                           def: "'What do you want to do?'", desc: "Search input placeholder." },
  { name: "emptyMessage",  type: "ReactNode",                        def: "'No commands found.'", desc: "Content shown when no commands match the query." },
  { name: "filter",        type: "(cmd, query) => boolean",          def: "label+desc+keywords substring", desc: "Custom filter predicate." },
];

const COMMAND_PROPS: PropRow[] = [
  { name: "id",          type: "string",       def: "—",     desc: "Stable identifier — React key + selection tracking." },
  { name: "label",       type: "string",       def: "—",     desc: "Primary searchable string shown in the row." },
  { name: "description", type: "string",       def: "—",     desc: "Secondary line under the label. Also matched by search." },
  { name: "icon",        type: "ReactNode",    def: "—",     desc: "Leading icon (typically a lucide icon)." },
  { name: "shortcut",    type: "ReactNode",    def: "—",     desc: "Right-aligned shortcut hint (e.g. '⌘K'). Visual only — consumer wires the actual keydown." },
  { name: "group",       type: "string",       def: "—",     desc: "Section heading. Commands with the same group render together." },
  { name: "keywords",    type: "string[]",     def: "—",     desc: "Extra search terms. Use for aliases without cluttering the label." },
  { name: "disabled",    type: "boolean",      def: "false", desc: "Visible, unselectable, skipped by keyboard nav." },
  { name: "action",      type: "() => void",   def: "—",     desc: "Fires when the command is activated. Palette closes automatically." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>CommandPalette</PropSectionEyebrow>
      <PropsTable rows={ROOT_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>CommandItem</PropSectionEyebrow>
        <PropsTable rows={COMMAND_PROPS} />
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
            text: "Every command needs a stable `id` — the DS uses it as the React key and highlight tracker. Reusing ids across renders is fine; changing them across renders breaks the highlight state.",
          },
          {
            tone: "must",
            text: "The DS does NOT bind the ⌘K shortcut — consumers wire the keydown handler themselves. This lets the palette coexist with other Cmd+K listeners (product-specific pages, third-party embeds).",
          },
          {
            tone: "should",
            text: "Group long command sets. A flat list of 20+ commands is a wall of text; three groups of 6-8 read at a glance. Order groups by importance (Navigation > Actions > Preferences typically).",
          },
          {
            tone: "should",
            text: "Set `disabled: true` on commands the current user can't run (permission-gated actions) rather than hiding them. Users understand 'greyed out' as 'exists but needs different context'; disappeared commands make the palette feel unpredictable.",
          },
          {
            tone: "note",
            text: "Keyboard: type-to-search auto-focuses the input, ArrowUp/Down navigate (disabled rows skipped), Home/End jump to first/last, Enter runs the highlighted command, Escape closes. aria-activedescendant reflects the highlighted row for screen readers.",
          },
        ]}
      />

      <Callout tone="info" title="Recent commands + per-context sets">
        The DS palette is stateless — it doesn&apos;t remember what the user ran or what page they&apos;re on. If you want recent commands or context-specific sets (different commands on the patient detail page vs. the reports page), sort or filter the `commands` array on your end before passing it in.
      </Callout>
    </DocBlock>
  );
}
