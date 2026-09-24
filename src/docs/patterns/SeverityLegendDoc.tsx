import type { ReactNode } from "react";
import { SeverityLegend } from "../../patterns";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function SeverityLegendDoc() {
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
      eyebrow="Pattern · SeverityLegend"
      title="SeverityLegend — the color-key row"
      lead="Every clinical surface that colors data by severity — worklists, heatmaps, geo maps, dashboards — needs a legend so users can map colors back to meaning. The DS ships this one so every product uses the same labels, the same order, and the same token mapping."
    />
  );
}

/* ══════ Basic ══════════════════════════════════════════════════════ */

function BasicBlock() {
  return (
    <DocBlock title="Default — all 5 severities" lead="The full spectrum in the canonical order: Critical → High → Medium → Low → Normal.">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
        }}
      >
        <SeverityLegend />
      </div>
    </DocBlock>
  );
}

/* ══════ Variants ═══════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Subset the levels, add a title, override labels for localization, or stack vertically for a map sidebar."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <VariantTile title="Titled">
          <SeverityLegend title="Severity" />
        </VariantTile>
        <VariantTile title="Subset">
          <SeverityLegend levels={["critical", "high", "medium"]} />
        </VariantTile>
        <VariantTile title="Compact — for footers">
          <SeverityLegend compact />
        </VariantTile>
        <VariantTile title="Vertical — for map sidebars">
          <SeverityLegend orientation="vertical" title="Risk" />
        </VariantTile>
        <VariantTile title="Localized labels">
          <SeverityLegend
            labels={{
              critical: "Crítico",
              high: "Alto",
              medium: "Medio",
              low: "Bajo",
              normal: "Normal",
            }}
          />
        </VariantTile>
      </div>
    </DocBlock>
  );
}

function VariantTile({ title, children }: { title: string; children: ReactNode }) {
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
      <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "levels",      type: "SeverityLevel[]",                 def: "all 5",       desc: "Which levels to show, in the given order." },
  { name: "labels",      type: "Partial<Record<SeverityLevel, ReactNode>>", def: "—", desc: "Override labels per level (localization, product-specific language)." },
  { name: "title",       type: "ReactNode",                       def: "—",           desc: "Heading before the swatches ('Severity', 'Risk')." },
  { name: "orientation", type: "'horizontal' | 'vertical'",       def: "'horizontal'", desc: "Layout direction. Horizontal wraps on narrow viewports." },
  { name: "compact",     type: "boolean",                         def: "false",       desc: "Smaller swatch + label, denser padding — for footers." },
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
          { tone: "must",  text: "Do NOT pass a style prop overriding a swatch color. The whole point of the legend is that colors match the tokens the rest of the surface consumes." },
          { tone: "must",  text: "Show the legend near any surface that uses severity color as a primary cue — worklists, maps, dashboards. Users can't rely on color alone; the legend + severity icons + labels together make the mapping accessible." },
          { tone: "should", text: "Keep the canonical order (Critical → High → Medium → Low → Normal) unless the product has a strong reason to reorder. Consistent ordering across products lets users read the legend at a glance." },
          { tone: "note",   text: "Uses --hc-color-severity-* tokens directly. The five severity token groups (critical / high / medium / low / normal) each define text / bg / border colors — the legend renders the bg swatch with the border color." },
        ]}
      />

      <Callout tone="info" title="Companion: SeverityBadge">
        Use HC1&apos;s Badge with the matching semantic variant (danger / warning / neutral / success) as the inline severity marker on rows. SeverityLegend is the color key; SeverityBadge is the per-row mark.
      </Callout>
    </DocBlock>
  );
}
