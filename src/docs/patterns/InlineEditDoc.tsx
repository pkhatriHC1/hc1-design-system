import { useState } from "react";
import type { ReactNode } from "react";
import { InlineEdit } from "../../patterns";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function InlineEditDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <LiveBlock />
      <MultilineBlock />
      <DisabledBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · InlineEdit"
      title="InlineEdit — read ↔ edit toggle"
      lead="InlineEdit shows the current value as text; clicking or focusing enters an edit mode with Input + Save + Cancel. Enter saves, Escape cancels — the standard keyboard grammar. Use for detail-page property panels where each field can be edited independently without a full form submit."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  const [name, setName] = useState("Alicia Reyes");
  return (
    <DocBlock title="Live example" lead="Hover the value to reveal the edit icon, click to enter edit mode. Enter to save, Escape to cancel. The DS doesn't fire `onSave` unless the value actually changed.">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          flexDirection: "column",
          gap: t.space.stack.md,
        }}
      >
        <PairRow label="Full name">
          <InlineEdit value={name} onSave={setName} />
        </PairRow>
      </div>
    </DocBlock>
  );
}

function PairRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: t.space.inline.md }}>
      <span
        style={{
          ...t.type.caption,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: t.color.text.tertiary,
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

/* ══════ Multiline ═════════════════════════════════════════════════ */

function MultilineBlock() {
  const [bio, setBio] = useState("Cardiology fellow. Interested in structural heart disease + AI-assisted diagnostics.");
  return (
    <DocBlock title="Multiline" lead="Set `multiline` and the DS renders Textarea inside. Enter inserts a newline; Cmd/Ctrl+Enter saves.">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
        }}
      >
        <PairRow label="Bio">
          <InlineEdit multiline value={bio} onSave={setBio} />
        </PairRow>
      </div>
    </DocBlock>
  );
}

/* ══════ Disabled ═════════════════════════════════════════════════ */

function DisabledBlock() {
  return (
    <DocBlock title="Disabled — read-only" lead="Set `disabled` to render as plain text with no edit affordance. Use for fields the current user doesn't have permission to edit.">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          flexDirection: "column",
          gap: t.space.stack.md,
        }}
      >
        <PairRow label="MRN">
          <InlineEdit disabled value="MRN-000431" onSave={() => {}} />
        </PairRow>
      </div>
    </DocBlock>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "value",       type: "string",              def: "—",     desc: "Current value." },
  { name: "onSave",      type: "(value: string) => void", def: "—", desc: "Fires when the user commits and the draft differs from the current value." },
  { name: "onCancel",    type: "() => void",          def: "—",     desc: "Fires when the user Escapes or clicks Cancel." },
  { name: "placeholder", type: "string",              def: "'Click to edit'", desc: "Shown in read mode when the value is empty." },
  { name: "multiline",   type: "boolean",             def: "false", desc: "Renders Textarea instead of Input for multi-line edits." },
  { name: "disabled",    type: "boolean",             def: "false", desc: "Render as plain text with no edit affordance." },
  { name: "renderValue", type: "(value: string) => ReactNode", def: "—", desc: "Custom read-mode formatter (date pretty-print, badge, etc.)." },
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
          gridTemplateColumns: "160px 1.4fr 140px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 140px 2fr",
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
          { tone: "must",   text: "onSave only fires when the draft differs from the value. Callers can safely PATCH the field from onSave without worrying about redundant round-trips." },
          { tone: "should", text: "For fields that need async validation (unique username, format check), pass the API check inside onSave and revert value locally on error." },
          { tone: "note",   text: "Keyboard: Enter saves in single-line mode; Cmd/Ctrl+Enter saves in multiline mode (bare Enter inserts newline). Escape cancels in both." },
        ]}
      />

      <Callout tone="info" title="Composes cleanly with data grids">
        Detail-page property tables (30+ fields, each independently editable) work well with InlineEdit — no bulk save button, no dirty-state modal, no unsaved-changes warning. Every commit is atomic.
      </Callout>
    </DocBlock>
  );
}
