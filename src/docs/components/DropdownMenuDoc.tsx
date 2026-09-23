import { useState } from "react";
import type { ReactNode } from "react";
import {
  Archive,
  Check,
  Copy,
  MoreHorizontal,
  Pencil,
  Settings,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "../../components/button";
import { DropdownMenu } from "../../components/dropdown-menu";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function DropdownMenuDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <FeaturesBlock />
      <SubmenuBlock />
      <SelectionBlock />
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
      title="The canonical HC1 DropdownMenu"
      lead="DropdownMenu is the row-actions and header-overflow surface. It wraps @radix-ui/react-dropdown-menu with the same panel chrome as Popover and Dialog so the whole floating-overlay family reads as one visual system, and adds HC1-specific affordances — destructive item tone, right-aligned shortcut hints, submenus, checkbox and radio items — for the shapes that show up in real product surfaces."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Twelve subcomponents in one compound. Trigger uses `asChild` to attach the menu to any button (typically HC1 Button); Content is the portalled panel; Item / CheckboxItem / RadioItem are the selectable rows; Label / Separator / Group organize sections; Sub / SubTrigger / SubContent build nested menus."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline">
              Actions
              <MoreHorizontal />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Row actions</DropdownMenu.Label>
            <DropdownMenu.Item shortcut="⌘E">
              <Pencil />
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item shortcut="⌘D">
              <Copy />
              Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Share2 />
              Share…
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item destructive>
              <Trash2 />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Trigger"       desc="`asChild` clones the child (usually a Button) and hangs open/close handlers on it." />
        <Part name="Content"       desc="Portalled panel. Size (sm/md/lg) sets min-width; positioning anchors to the trigger via Radix." />
        <Part name="Label"         desc="Uppercase strap for a section (e.g. 'Row actions'). Not selectable." />
        <Part name="Item"          desc="Row. `destructive` for delete flows, `shortcut` for right-aligned ⌘K hints." />
        <Part name="CheckboxItem"  desc="Toggle item with a Check indicator. Controlled by `checked` + `onCheckedChange`." />
        <Part name="RadioGroup"    desc="Single-value picker containing RadioItem rows. `value` + `onValueChange`." />
        <Part name="Separator"     desc="Horizontal divider between groups of items." />
        <Part name="Sub"           desc="Container for a nested submenu — pairs SubTrigger + SubContent." />
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

/* ══════ Features ═══════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Destructive tones, keyboard shortcuts, and item labels — the three affordances that turn a bare Radix menu into a real product menu."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FeatureTile
          title="Destructive item"
          hint="Red text + red hover fill. Use for delete / discard flows."
          menu={
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline">Row menu</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  <Pencil /> Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Archive /> Archive
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item destructive>
                  <Trash2 /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          }
        />

        <FeatureTile
          title="Keyboard shortcuts"
          hint="`shortcut` prop renders a right-aligned hint. The consumer wires the actual keydown."
          menu={
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline">File</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="lg">
                <DropdownMenu.Item shortcut="⌘N">New batch</DropdownMenu.Item>
                <DropdownMenu.Item shortcut="⌘S">Save</DropdownMenu.Item>
                <DropdownMenu.Item shortcut="⌘⇧E">Export</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item shortcut="⌘W">Close</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          }
        />

        <FeatureTile
          title="Sectioned menu"
          hint="Label + Separator group rows so a long menu reads at a glance."
          menu={
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline">Workspace</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Workspace</DropdownMenu.Label>
                <DropdownMenu.Item>
                  <Settings /> Settings
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Users /> Members
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Label>Account</DropdownMenu.Label>
                <DropdownMenu.Item>Profile</DropdownMenu.Item>
                <DropdownMenu.Item>Sign out</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          }
        />
      </div>
    </DocBlock>
  );
}

function FeatureTile({
  title,
  hint,
  menu,
}: {
  title: string;
  hint: string;
  menu: ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        padding: t.space.inline.lg,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.md,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>{menu}</div>
      <div>
        <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{title}</div>
        <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{hint}</div>
      </div>
    </div>
  );
}

/* ══════ Submenu ═══════════════════════════════════════════════════ */

function SubmenuBlock() {
  return (
    <DocBlock
      title="Submenu"
      lead="Nested menus for hierarchical actions. SubTrigger auto-appends a chevron; SubContent inherits the same panel chrome as the parent."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline">
              Assign
              <Users />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Reassign to me</DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Assign to team</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Cardiology</DropdownMenu.Item>
                <DropdownMenu.Item>Oncology</DropdownMenu.Item>
                <DropdownMenu.Item>Radiology</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Assign to clinician</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Dr. Cooper</DropdownMenu.Item>
                <DropdownMenu.Item>Dr. Riley</DropdownMenu.Item>
                <DropdownMenu.Item>Dr. Patel</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </DocBlock>
  );
}

/* ══════ Selection ═════════════════════════════════════════════════ */

function SelectionBlock() {
  const [showArchived, setShowArchived] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [sort, setSort] = useState("recency");

  return (
    <DocBlock
      title="Selection items"
      lead="CheckboxItem and RadioItem replace popover-embedded checkbox lists. Both use their own left-slot indicator so the item labels still align with plain Items above them."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          gap: t.space.inline.xl,
          justifyContent: "center",
        }}
      >
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline">View options</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size="lg">
            <DropdownMenu.Label>Filters</DropdownMenu.Label>
            <DropdownMenu.CheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
              Show archived
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem checked={showCompleted} onCheckedChange={setShowCompleted}>
              Show completed
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>Sort</DropdownMenu.Label>
            <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenu.RadioItem value="recency">Most recent</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="name">Name (A→Z)</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="severity">Severity</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.stack.xs,
            fontSize: 12,
            fontFamily: t.font.mono,
            color: t.color.text.secondary,
          }}
        >
          <div>showArchived: {String(showArchived)}</div>
          <div>showCompleted: {String(showCompleted)}</div>
          <div>sort: {sort}</div>
          <Check className="hidden" />
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [align, setAlign] = useState<"start" | "center" | "end">("start");
  const [side, setSide] = useState<"top" | "right" | "bottom" | "left">("bottom");
  const [hasShortcuts, setHasShortcuts] = useState(true);
  const [hasDestructive, setHasDestructive] = useState(true);

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered menu in real time.">
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
            padding: t.space.section.sm,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            minHeight: 200,
          }}
        >
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline">
                Open menu
                <MoreHorizontal />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size={size} align={align} side={side}>
              <DropdownMenu.Item shortcut={hasShortcuts ? "⌘E" : undefined}>
                <Pencil />
                Rename
              </DropdownMenu.Item>
              <DropdownMenu.Item shortcut={hasShortcuts ? "⌘D" : undefined}>
                <Copy />
                Duplicate
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Share2 />
                Share…
              </DropdownMenu.Item>
              {hasDestructive && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item destructive shortcut={hasShortcuts ? "⌘⌫" : undefined}>
                    <Trash2 />
                    Delete
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="size" value={size} options={["sm", "md", "lg"]} onChange={(v) => setSize(v as "sm" | "md" | "lg")} />
          <SelectControl
            label="align"
            value={align}
            options={["start", "center", "end"]}
            onChange={(v) => setAlign(v as "start" | "center" | "end")}
          />
          <SelectControl
            label="side"
            value={side}
            options={["bottom", "top", "right", "left"]}
            onChange={(v) => setSide(v as "top" | "right" | "bottom" | "left")}
          />
          <ToggleControl label="hasShortcuts" value={hasShortcuts} onChange={setHasShortcuts} />
          <ToggleControl label="hasDestructive" value={hasDestructive} onChange={setHasDestructive} />
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Controls (shared) ═══════════════════════════════════════════ */

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36,
          padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control,
          border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default,
          color: t.color.text.primary,
          fontFamily: t.font.sans,
          fontSize: 14,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
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
  { name: "open",          type: "boolean",                  def: "—",     desc: "Controlled open state. Pair with `onOpenChange`." },
  { name: "defaultOpen",   type: "boolean",                  def: "false", desc: "Uncontrolled initial open state." },
  { name: "onOpenChange",  type: "(open: boolean) => void",  def: "—",     desc: "Fires when trigger, Escape, or outside-click opens or closes the menu." },
  { name: "modal",         type: "boolean",                  def: "false", desc: "Radix modal mode — blocks background pointer events. Off by default so menus feel light." },
];

const ITEM_PROPS: PropRow[] = [
  { name: "onSelect",      type: "(e: Event) => void", def: "—",     desc: "Fires when the user selects the row. Menu closes after — call `e.preventDefault()` to keep it open." },
  { name: "disabled",      type: "boolean",            def: "false", desc: "Row is visible but not selectable. Skipped by keyboard nav." },
  { name: "destructive",   type: "boolean",            def: "false", desc: "Red text + red hover fill. Use for delete / discard actions." },
  { name: "shortcut",      type: "ReactNode",          def: "—",     desc: "Right-aligned hint (e.g. '⌘K'). Visual only — the consumer wires the actual keydown." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>DropdownMenu (root)</PropSectionEyebrow>
      <PropsTable rows={ROOT_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>DropdownMenu.Item</PropSectionEyebrow>
        <PropsTable rows={ITEM_PROPS} />
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
          gridTemplateColumns: "160px 1.4fr 120px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 120px 2fr",
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
            text: "Always use `asChild` on Trigger with an HC1 Button as the child. Nested-button HTML (button inside button) breaks focus and is invalid.",
          },
          {
            tone: "must",
            text: "Icon-only trigger buttons (three-dot overflow menus) need `aria-label` on the Button. The menu itself has no label — the trigger is the accessible entry point.",
          },
          {
            tone: "should",
            text: "Group rows with `Label` + `Separator` when the menu has more than 5 items. A long unbroken list is hard to scan.",
          },
          {
            tone: "should",
            text: "Use `destructive` for exactly one action per menu — the last one, above a separator. Multiple destructive items in one menu confuse the visual hierarchy.",
          },
          {
            tone: "note",
            text: "Under the hood: @radix-ui/react-dropdown-menu handles keyboard nav (Arrow keys, Home/End, first-letter jump), Escape to close, focus return to trigger, click-outside to dismiss, and the ARIA role tree (menu / menuitem / menuitemcheckbox / menuitemradio).",
          },
        ]}
      />

      <Callout tone="info" title="Menu vs. Popover">
        DropdownMenu is for a LIST OF ACTIONS. Popover is for RICH CONTENT (filter form, inline editor, preview card). If your surface has an input inside, it wants a Popover, not a DropdownMenu — DropdownMenu's keyboard nav and typeahead assume every child is a Menu.Item.
      </Callout>
    </DocBlock>
  );
}
