import type { ReactNode } from "react";
import { Archive, ChevronRight, FileText, MessagesSquare, Star } from "lucide-react";
import { PatientIdentityStrip } from "../../patterns";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function PatientIdentityStripDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <BasicBlock />
      <VariantsBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · PatientIdentityStrip"
      title="PatientIdentityStrip — persistent patient header"
      lead="PatientIdentityStrip is the identity chip pinned to the top of every route inside a patient's chart. Clinicians look at it every few minutes to confirm they're editing the right record; the design has to be scannable at a glance. Left: Avatar + name + MRN + severity Badge. Middle: meta pairs. Right: consumer actions."
    />
  );
}

/* ══════ Basic ══════════════════════════════════════════════════════ */

function BasicBlock() {
  return (
    <DocBlock
      title="Standard"
      lead="Name + MRN + severity + three meta pairs + a couple of actions. The canonical shape."
    >
      <PatientIdentityStrip
        name="Alicia Reyes"
        mrn="MRN-000431"
        severity="critical"
        subline="Encounter 2026-09-24"
        meta={[
          { label: "Age", value: "62" },
          { label: "Sex", value: "F" },
          { label: "DOB", value: "1963-04-12" },
          { label: "Bed", value: "3E-14" },
        ]}
        actions={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="Star patient">
              <Star />
            </Button>
            <Button variant="outline" size="sm">
              <MessagesSquare />
              Comments
            </Button>
            <Button size="sm">
              <FileText />
              Open chart
              <ChevronRight />
            </Button>
          </>
        }
      />
    </DocBlock>
  );
}

/* ══════ Variants ═══════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Compact mode reduces padding + avatar size for embedding inside cards or modals. Severity is optional — leave it off for anonymized or non-clinical contexts."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.lg }}>
        <VariantTile title="Compact — for embedding in cards / modals">
          <PatientIdentityStrip
            compact
            name="Ben Ortiz"
            mrn="MRN-000842"
            severity="high"
            meta={[
              { label: "Age", value: "48" },
              { label: "Sex", value: "M" },
            ]}
            actions={
              <Button variant="ghost" size="icon-sm" aria-label="Archive">
                <Archive />
              </Button>
            }
          />
        </VariantTile>

        <VariantTile title="No severity — for anonymized / non-clinical views">
          <PatientIdentityStrip
            name="Anonymous — Case #742"
            mrn="ANON-000742"
            meta={[
              { label: "Age band", value: "60–69" },
              { label: "Sex", value: "F" },
              { label: "Region", value: "Northeast" },
            ]}
          />
        </VariantTile>

        <VariantTile title="Minimal — name + MRN only">
          <PatientIdentityStrip name="Chandra Patel" mrn="MRN-001291" />
        </VariantTile>
      </div>
    </DocBlock>
  );
}

function VariantTile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div
        style={{
          ...t.type.caption,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: t.color.text.tertiary,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "name",            type: "string",         def: "—",     desc: "Patient display name — first + last." },
  { name: "mrn",             type: "string",         def: "—",     desc: "Medical Record Number. Rendered in monospaced tertiary text under the name." },
  { name: "subline",         type: "ReactNode",      def: "—",     desc: "Secondary identifier under the MRN — DOB, encounter id, etc." },
  { name: "photo",           type: "string",         def: "—",     desc: "Optional patient photo. Falls back to name-derived initials on the Avatar." },
  { name: "severity",        type: "SeverityLevel",  def: "—",     desc: "Clinical severity. Renders as a colored Badge next to the name." },
  { name: "severityLabel",   type: "ReactNode",      def: "—",     desc: "Override the Badge label ('Watch list', 'In review', etc.)." },
  { name: "meta",            type: "PatientMeta[]",  def: "—",     desc: "Label + value pairs. Wrap to a new line on narrow viewports." },
  { name: "actions",         type: "ReactNode",      def: "—",     desc: "Right-aligned action slot." },
  { name: "compact",         type: "boolean",        def: "false", desc: "Reduce padding + avatar size for embedding inside cards or modals." },
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
          { tone: "must",  text: "Show the same MRN format across every product. Users memorize the shape (MRN-000431); a mid-flow format change signals 'wrong record' and slows them down." },
          { tone: "must",  text: "Never hide the strip on scroll. Clinicians look at it to confirm the record every few minutes; a scroll-away strip breaks that check." },
          { tone: "should", text: "Reach for the compact variant only when embedded inside another surface (a Card, a Modal). Full size is the default on route roots." },
          { tone: "should", text: "Cap meta at 4 pairs on wide screens, 2 on narrow. More than 4 turns the strip into a wall of small text and users can't scan it." },
          { tone: "note",   text: "Composes Avatar (with name-derived initials) + Badge (with the severity → variant mapping baked in). No new tokens — the strip inherits from severity + brand + neutral scales." },
        ]}
      />

      <Callout tone="info" title="Placement">
        Render PatientIdentityStrip immediately below AppShell.Header on any route inside a patient chart, above the PageHeader. Patient identity is chrome; the page&apos;s own header is content chrome — they read as two distinct straps.
      </Callout>
    </DocBlock>
  );
}
