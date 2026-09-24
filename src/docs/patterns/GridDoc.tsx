import type { ReactNode } from "react";
import { Grid } from "../../patterns";
import { Card } from "../../components/card";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function GridDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <ColumnsBlock />
      <AutoFitBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · Grid"
      title="Grid — responsive tile grid"
      lead="Grid is the responsive wrapper for a row (or wall) of tile-shaped content — KpiCards, product Cards, template gallery items. Pick your responsive model: `columns` for a fixed column count on wide screens with tablet/phone auto-drop, or `minTileWidth` for CSS auto-fit where tiles flow to fit."
    />
  );
}

/* ══════ Columns mode ═════════════════════════════════════════════ */

function ColumnsBlock() {
  return (
    <DocBlock
      title="Columns mode — fixed column count"
      lead="Set `columns` for a fixed wide-screen column count. Auto-drops to 2 columns on tablet and 1 column on phone."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.section.sm }}>
        <div>
          <Eyebrow>columns=2</Eyebrow>
          <Grid columns={2}>
            <SampleCard title="Feature A" description="Two columns on wide" />
            <SampleCard title="Feature B" description="One on phone" />
          </Grid>
        </div>
        <div>
          <Eyebrow>columns=3 (default)</Eyebrow>
          <Grid columns={3}>
            <SampleCard title="Cardiology"  description="42 patients" />
            <SampleCard title="Radiology"   description="18 studies"  />
            <SampleCard title="Oncology"    description="7 requests"  />
          </Grid>
        </div>
        <div>
          <Eyebrow>columns=4 — matches a 4-metric KPI row</Eyebrow>
          <Grid columns={4}>
            <SampleCard title="Tile 1" description="—" />
            <SampleCard title="Tile 2" description="—" />
            <SampleCard title="Tile 3" description="—" />
            <SampleCard title="Tile 4" description="—" />
          </Grid>
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Auto-fit mode ════════════════════════════════════════════ */

function AutoFitBlock() {
  return (
    <DocBlock
      title="Auto-fit mode — flow to fit"
      lead="Set `minTileWidth` for CSS auto-fit. Tiles flow to fit the viewport, dropping to fewer columns as it narrows. Best when the tile count varies (catalog, search results)."
    >
      <div>
        <Eyebrow>minTileWidth=280 · resize the window to see tiles reflow</Eyebrow>
        <Grid minTileWidth={280}>
          <SampleCard title="Cardiology worklist" description="42 active patients · updated 2 min ago" />
          <SampleCard title="Radiology imaging"   description="18 studies · updated 6 min ago" />
          <SampleCard title="Oncology consult"    description="7 open requests · updated 12 min ago" />
          <SampleCard title="Emergency triage"    description="3 in-progress" />
          <SampleCard title="Neurology follow-up" description="12 scheduled" />
          <SampleCard title="Pediatric ward"      description="8 admitted · 2 discharge-ready" />
        </Grid>
      </div>

      <Callout tone="info" title="When to reach for which mode">
        <strong>columns</strong> is for a designed-tight dashboard — 4 KPIs on top, always. <strong>minTileWidth</strong> is for a catalog page where the tile count varies with the data — 6 templates today, 40 tomorrow, both should look right.
      </Callout>
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
  { name: "columns",      type: "2 | 3 | 4 | 5 | 6", def: "3",   desc: "Max column count on wide screens. Ignored when minTileWidth is set." },
  { name: "minTileWidth", type: "number",             def: "—",   desc: "Switches to CSS auto-fit — columns flow to fit the viewport, respecting this minimum tile width." },
  { name: "gap",          type: "number",             def: "16",  desc: "Gap between tiles in px." },
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
          { tone: "should", text: "Reach for `columns` when the design guarantees a specific count (KPI row of exactly 4). Reach for `minTileWidth` when the count varies with the data." },
          { tone: "should", text: "Match the mode to the content. Small chip-shaped tiles want higher column counts; large detail cards with media want fewer columns." },
          { tone: "note",   text: "Grid replaces the previous KpiRow + CardGrid pair — one primitive covers both use cases via the two responsive modes." },
        ]}
      />
    </DocBlock>
  );
}
