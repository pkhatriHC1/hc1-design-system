import { useState } from "react";
import type { ReactNode } from "react";
import { Brain, FileText } from "lucide-react";
import { AiInsightCard } from "../../patterns";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function AiInsightCardDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <LiveBlock />
      <VariantsBlock />
      <StatesBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · AiInsightCard"
      title="AiInsightCard — the sanctioned AI-generated moment"
      lead="AiInsightCard is the ONLY component in the DS that uses the violet AI-token family. Reserved for surfaces where the product is showing a clinician a genuine AI-generated result: a suggested care plan, an anomaly the model flagged, a summarized report. The violet frame + sparkles icon + provenance line make AI content unambiguously identifiable to the user."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  const [status, setStatus] = useState<"pending" | "accepted" | "dismissed">("pending");

  if (status === "accepted") {
    return (
      <DocBlock title="Live example" lead="Accepted — replaced with a confirmation. In a real product this would update the care plan.">
        <div
          style={{
            padding: t.space.inline.xl,
            border: `1px dashed ${t.color.border.strong}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
            textAlign: "center",
            color: t.color.status.success.fg,
            fontFamily: t.font.mono,
            fontSize: 13,
          }}
        >
          ✓ Recommendation added to care plan
          <div style={{ marginTop: t.space.stack.md }}>
            <Button variant="ghost" size="sm" onClick={() => setStatus("pending")}>
              Reset
            </Button>
          </div>
        </div>
      </DocBlock>
    );
  }
  if (status === "dismissed") {
    return (
      <DocBlock title="Live example" lead="Dismissed — card removed. Consumer decides whether to remember the dismissal.">
        <div
          style={{
            padding: t.space.inline.xl,
            border: `1px dashed ${t.color.border.strong}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
            textAlign: "center",
            color: t.color.text.tertiary,
            fontFamily: t.font.mono,
            fontSize: 13,
          }}
        >
          — Recommendation dismissed
          <div style={{ marginTop: t.space.stack.md }}>
            <Button variant="ghost" size="sm" onClick={() => setStatus("pending")}>
              Reset
            </Button>
          </div>
        </div>
      </DocBlock>
    );
  }

  return (
    <DocBlock title="Live example" lead="Try Accept or Dismiss. Both close the card; consumer wires whichever downstream effect the AI moment should have.">
      <AiInsightCard
        title="Recommend chest X-ray"
        description="Patient's presenting symptoms — persistent cough, low-grade fever, recent international travel — meet the threshold for tuberculosis screening in the AWMF-2024 guideline."
        provenance="ClinicalAI 4.2 · 87% confidence"
        onAccept={() => setStatus("accepted")}
        onDismiss={() => setStatus("dismissed")}
      />
    </DocBlock>
  );
}

/* ══════ Variants ═══════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock title="Variants" lead="Different AI moments call for different card shapes. Common: recommendation, summary, anomaly flag.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <AiInsightCard
          title="3 patients with anomalous vitals"
          description="Three patients in the cardiology wing show heart-rate variance beyond the 95th percentile for their cohort."
          provenance="VitalsAnomalyDetector 2.1"
          onAccept={() => {}}
          acceptLabel="Review"
          onDismiss={() => {}}
          icon={<Brain />}
        />

        <AiInsightCard
          title="Report summary"
          description="Q3 revenue up 12% YoY. Radiology showed the strongest growth (+18%); cardiology flat. Two facilities missed volume targets."
          provenance="ReportSummarizer 1.8 · GPT-4o"
          extraActions={
            <Button variant="ghost" size="sm">
              <FileText />
              Open full report
            </Button>
          }
          icon={<FileText />}
        />

        <AiInsightCard
          title="Consider medication adjustment"
          description="Patient's most recent creatinine (2.1 mg/dL) suggests renal function has declined. Metformin dose may need reduction per KDIGO 2024."
          provenance="ClinicalAI 4.2 · 72% confidence"
          onAccept={() => {}}
          onDismiss={() => {}}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ States ══════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="Loading" lead="While the model is computing the insight, `loading` swaps the body for pulsing violet placeholders — the frame stays so users know an AI moment is arriving.">
      <AiInsightCard
        title="Analyzing patient history…"
        loading
        provenance="ClinicalAI 4.2 · running"
      />
    </DocBlock>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "title",         type: "ReactNode",   def: "—",           desc: "Card heading — the recommendation or insight, phrased actively." },
  { name: "description",   type: "ReactNode",   def: "—",           desc: "1-2 sentences explaining the reasoning." },
  { name: "provenance",    type: "ReactNode",   def: "—",           desc: "Model name + version + confidence. Renders in a muted strap." },
  { name: "icon",          type: "ReactNode",   def: "<Sparkles />", desc: "Optional icon override. Rendered in a violet-tinted circle." },
  { name: "onAccept",      type: "() => void",  def: "—",           desc: "Accept handler. Renders an Accept Button in the action row." },
  { name: "acceptLabel",   type: "string",      def: "'Accept'",    desc: "Label on the Accept button." },
  { name: "onDismiss",     type: "() => void",  def: "—",           desc: "Dismiss handler. Renders a ghost Dismiss Button." },
  { name: "dismissLabel",  type: "string",      def: "'Dismiss'",   desc: "Label on the Dismiss button." },
  { name: "extraActions",  type: "ReactNode",   def: "—",           desc: "Extra buttons after Dismiss + Accept (view reasoning, report issue)." },
  { name: "loading",       type: "boolean",     def: "false",       desc: "Replaces body with pulsing violet placeholders." },
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
          { tone: "must",  text: "Use ONLY for AI-generated content. Violet is reserved for AI moments — see FOUNDATION.md §8. Never use AiInsightCard for a plain notification, alert, or product callout." },
          { tone: "must",  text: "Always include a provenance line. Model name + version + confidence tell clinicians how to weigh the recommendation. Anonymous AI recommendations undermine trust." },
          { tone: "should", text: "Phrase the title actively — 'Recommend chest X-ray', not 'Chest X-ray recommendation'. Users scan titles for verbs to decide whether to act." },
          { tone: "should", text: "Keep the description to 1-2 sentences. Longer insights should link to a full report page via extraActions ('Open full report')." },
          { tone: "note",   text: "The violet frame is drawn with an inset box-shadow on the left, --hc-color-violet-200 border, and --hc-color-ai-subtle-bg background. Do not restyle the frame or icon color — the visual language is what makes AI content unambiguously identifiable." },
        ]}
      />

      <Callout tone="warning" title="AI content restraint">
        Don&apos;t stack AiInsightCards. One AI moment per view is memorable; three or four turn into noise the user tunes out. If the model produces multiple insights, surface only the highest-confidence one and link to the rest via <code>extraActions</code>.
      </Callout>
    </DocBlock>
  );
}
