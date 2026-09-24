import type { ReactNode } from "react";
import { CardGrid } from "../../patterns";
import { Card } from "../../components/card";
import {
  DocPage,
  DocBlock,
  RuleList,
  t,
} from "../standards/_shared";

export function CardGridDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <BasicBlock />
      <ColumnsBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · CardGrid"
      title="CardGrid — responsive grid wrapper for Cards"
      lead="CardGrid is the layout wrapper for a gallery of tile-shaped content — Card grids, template lists, catalog listings. Auto-drops columns as the viewport narrows: 4 → 3 → 2 → 1. Similar to KpiRow but sized for larger tiles."
    />
  );
}

/* ══════ Basic ═══════════════════════════════════════════════════ */

function BasicBlock() {
  return (
    <DocBlock title="Basic" lead="Three columns on wide, two on tablet, one on phone.">
      <CardGrid columns={3}>
        <SampleCard title="Cardiology worklist" description="42 active patients · updated 2 min ago" />
        <SampleCard title="Radiology imaging" description="18 studies · updated 6 min ago" />
        <SampleCard title="Oncology consult" description="7 open requests · updated 12 min ago" />
        <SampleCard title="Emergency triage" description="3 in-progress" />
        <SampleCard title="Neurology follow-up" description="12 scheduled" />
        <SampleCard title="Pediatric ward" description="8 admitted · 2 discharge-ready" />
      </CardGrid>
    </DocBlock>
  );
}

function SampleCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Header>
    </Card>
  );
}

/* ══════ Columns ═════════════════════════════════════════════════ */

function ColumnsBlock() {
  return (
    <DocBlock title="Column counts" lead="Every count 2..6 is supported. Row auto-drops on tablet + phone regardless of the wide-screen count.">
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.section.sm }}>
        <div>
          <Eyebrow>columns=2</Eyebrow>
          <CardGrid columns={2}>
            <SampleCard title="Feature A" description="Description" />
            <SampleCard title="Feature B" description="Description" />
          </CardGrid>
        </div>
        <div>
          <Eyebrow>columns=4</Eyebrow>
          <CardGrid columns={4}>
            <SampleCard title="Tile 1" description="—" />
            <SampleCard title="Tile 2" description="—" />
            <SampleCard title="Tile 3" description="—" />
            <SampleCard title="Tile 4" description="—" />
          </CardGrid>
        </div>
      </div>
    </DocBlock>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
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

/* ══════ Props ═══════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "columns",       type: "2 | 3 | 4 | 5 | 6", def: "3",   desc: "Wide-screen column count. Auto-drops on tablet + phone." },
  { name: "minTileWidth",  type: "number",             def: "240", desc: "Min tile width in px. Below this, columns collapse." },
  { name: "gap",           type: "number",             def: "16",  desc: "Gap between tiles in px." },
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
          { tone: "should", text: "Match the column count to the tile density. Small tiles (60x60 chips) → 6+ columns; standard Cards → 3; large Cards with media → 2." },
          { tone: "should", text: "For heterogeneous content sizes, reach for CSS Grid directly instead of CardGrid — the grid forces uniform column widths which can awkwardly stretch a small Card." },
          { tone: "note",   text: "CardGrid is a Tailwind + inline-style hybrid: Tailwind classes handle the breakpoint columns, inline style handles the auto-fit min-tile-width for finer-grained density control." },
        ]}
      />
    </DocBlock>
  );
}
