import { useState } from "react";
import type { ReactNode } from "react";
import { Slider } from "../../components/slider";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function SliderDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <ExamplesBlock />
      <UsageBlock />
      <A11yBlock />
      <BestPracticesBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
      <MigrationBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="What Slider is for"
      lead="Pick a number on a bounded range where the position on the scale matters as much as the number — goals, thresholds and targets in configuration screens (for example PBM goal rates against the AABB benchmark)."
    >
      <RuleList
        rules={[
          { tone: "must", text: "Always give it a visible `label`. The label names the control for screen readers too." },
          { tone: "should", text: "Turn on `showInput` when people need an exact value (goals, thresholds). The number box and the slider stay in sync." },
          { tone: "should", text: "Use `marks` for reference points (benchmarks, defaults) and `startLabel` / `endLabel` to say what each end means." },
          { tone: "must-not", text: "Don't use a Slider for an unbounded number or a precise clinical value such as a dose. Use Input type=\"number\"." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [v, setV] = useState(90);
  return (
    <DocBlock
      eyebrow="Anatomy"
      title="Label · number box · track · marks · end captions"
      lead="Every part except the track is optional. The filled part of the track runs from the start to the thumb."
    >
      <Frame>
        <Slider label="Hgb <7 rate" unit="%" showInput value={v} onChange={setV}
          marks={[{ value: 90, label: "AABB 90%" }]} startLabel="Liberal" endLabel="Restrictive" />
      </Frame>
    </DocBlock>
  );
}

/* ══════ Examples ═════════════════════════════════════════════════ */

function ExamplesBlock() {
  const [a, setA] = useState(20);
  const [b, setB] = useState(40);
  return (
    <DocBlock eyebrow="Examples" title="Common set-ups">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        <ExampleCard title="Goal with a benchmark (scale reversed)">
          <Slider label="Hgb >8 rate" unit="%" showInput value={a} onChange={setA}
            marks={[{ value: 20, label: "AABB 20%" }]} startLabel="Restrictive" endLabel="Liberal" />
        </ExampleCard>
        <ExampleCard title="Read-only value, no number box">
          <Slider label="Single unit" unit="%" value={b} onChange={setB} description="Share of transfusions given as one unit" />
        </ExampleCard>
        <ExampleCard title="Small · disabled">
          <Slider label="Wastage" unit="%" size="sm" defaultValue={5} max={20} disabled />
        </ExampleCard>
        <ExampleCard title="Invalid">
          <Slider label="Target" unit="%" showInput defaultValue={95} invalid />
        </ExampleCard>
      </div>
    </DocBlock>
  );
}

/* ══════ Usage ════════════════════════════════════════════════════ */

function UsageBlock() {
  return (
    <DocBlock eyebrow="Usage" title="How to use it" lead="Import from the package. The value is a plain number; `onChange` gets the new number.">
      <Code>{`import { Slider } from "@hc1com/design-system";

const [goal, setGoal] = useState(90);

<Slider
  label="Hgb <7 rate"
  unit="%"
  showInput                 // editable number box beside the label
  min={0} max={100} step={1}
  value={goal}
  onChange={setGoal}        // (value: number) => void
  marks={[{ value: 90, label: "AABB 90%" }]}
  startLabel="Liberal"
  endLabel="Restrictive"
/>`}</Code>
      <RuleList
        rules={[
          { tone: "note", text: "Uncontrolled: pass `defaultValue` and leave out `value`." },
          { tone: "note", text: "Typed values are clamped to min–max and snapped to `step` when the box loses focus." },
          { tone: "note", text: "The ref and any other input props (`name`, `form`, `aria-*`) go to the native range input, so it works inside a <form>." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock eyebrow="Accessibility" title="A real range input underneath">
      <RuleList
        rules={[
          { tone: "note", text: "A native <input type=\"range\"> sits over the painted track, so keyboard, pointer, touch and screen-reader behaviour are the browser's own." },
          { tone: "note", text: "Keys: ←/↓ and →/↑ move one step, Page Up / Page Down move further, Home / End jump to min / max." },
          { tone: "must", text: "Screen readers hear the value with its unit (`aria-valuetext`). Pass `formatValue` when the unit needs words, e.g. \"90 percent\"." },
          { tone: "note", text: "Focus shows the standard focus ring around the thumb." },
          { tone: "must-not", text: "Marks are visual only. If a benchmark matters, say it in the label or description too." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best Practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock eyebrow="Best Practices" title="Do / Don't">
      <DoDontGrid
        dos={[
          { title: "Pair with a number box for goals", description: "`showInput` lets people type 87 instead of fighting a 1px drag." },
          { title: "Name both ends", description: "\"Liberal\" / \"Restrictive\" tell people which way is better, especially when two sliders run in opposite directions." },
          { title: "Mark the benchmark", description: "One or two marks (AABB, national average, default) give the value context." },
        ]}
        donts={[
          { title: "Use it for doses or lab values", description: "Precise clinical numbers belong in an Input with validation, not a drag control." },
          { title: "Crowd the track with marks", description: "More than two or three marks overlap and stop being readable." },
          { title: "Restyle the track or thumb locally", description: "Colours come from tokens. If it looks wrong, change the design system." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Props ════════════════════════════════════════════════════ */

function PropsTableBlock() {
  return (
    <DocBlock eyebrow="Props" title="Slider API">
      <PropsTable
        rows={[
          ["value", "number", "—", "Controlled value. Pair with onChange."],
          ["defaultValue", "number", "min", "Uncontrolled initial value."],
          ["onChange", "(value: number) => void", "—", "Called on drag, keys and typing."],
          ["min / max / step", "number", "0 / 100 / 1", "Range and step."],
          ["label", "ReactNode", "—", "Visible label; names the control."],
          ["description", "ReactNode", "—", "Helper text under the label."],
          ["unit", "string", "''", "Shown after the value, the number box and marks."],
          ["showInput", "boolean", "false", "Editable number box beside the label. Off: value shown as text on the label row."],
          ["marks", "{ value, label? }[]", "—", "Reference points under the track."],
          ["startLabel / endLabel", "ReactNode", "—", "Captions under the ends of the track."],
          ["size", "'sm' | 'md'", "'md'", "Track 4 / 6 px, thumb 14 / 16 px."],
          ["disabled", "boolean", "false", "Dims and blocks interaction."],
          ["invalid", "boolean", "false", "Error colour on the fill, thumb and number box."],
          ["formatValue", "(value) => string", "value + unit", "Text read by screen readers."],
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Tokens ═══════════════════════════════════════════════════ */

function TokensUsedBlock() {
  return (
    <DocBlock eyebrow="Tokens Used" title="Every value comes from a token">
      <PropsTable
        rows={[
          ["Track", "--hc-color-bg-muted", "Unfilled part of the track."],
          ["Fill + thumb ring", "--hc-color-action-primary", "Error state uses --hc-color-status-error-fg."],
          ["Thumb", "--hc-color-bg-surface", "White face of the thumb."],
          ["Marks", "--hc-color-status-info-fg", "Tick and label."],
          ["Focus ring", "--hc-color-border-focus", "Same ring as every other control."],
          ["Captions", "--hc-color-text-supporting", "End labels and description."],
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Notes ════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock eyebrow="Implementation Notes" title="Non-obvious details">
      <Callout>
        Same approach as Checkbox, Radio and Switch: no Radix slider, so apps install nothing new. The painted thumb follows the same geometry as the browser's own thumb, so a click always lands where the thumb is drawn.
      </Callout>
    </DocBlock>
  );
}

function MigrationBlock() {
  return (
    <DocBlock eyebrow="Migration Targets" title="What this replaces">
      <RuleList
        rules={[
          { tone: "should", text: "PBM · GoalsConfig `GoalControl`: a local <input type=\"range\"> with an Input, AABB tick and captions built by hand. Replace with one <Slider showInput marks startLabel endLabel />." },
          { tone: "must-not", text: "Don't build new local range inputs. Use Slider." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Layout helpers ════════════════════════════════════════════ */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: 480, padding: 24, background: t.color.background.surface, border: `1px solid ${t.color.border.default}`, borderRadius: 12 }}>
      {children}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre
      style={{
        margin: "0 0 16px",
        padding: 12,
        background: t.color.background.default,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: 8,
        fontSize: 12,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        color: t.color.text.primary,
        overflowX: "auto",
      }}
    >
      {children}
    </pre>
  );
}

function ExampleCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        background: t.color.background.surface,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: 12,
        minHeight: 140,
      }}
    >
      <div style={{ ...t.type.caption, color: t.color.text.tertiary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}><div style={{ width: "100%" }}>{children}</div></div>
    </div>
  );
}

function PropsTable({ rows }: { rows: (string | number)[][] }) {
  return (
    <div style={{ overflow: "auto", border: `1px solid ${t.color.border.default}`, borderRadius: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: t.color.background.surface }}>
            {rows[0] && rows[0].map((_, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderBottom: `1px solid ${t.color.border.default}`,
                  color: t.color.text.tertiary,
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                {["Prop / Slot", "Type", "Default", "Notes"][i] ?? ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} style={{ borderBottom: r < rows.length - 1 ? `1px solid ${t.color.border.default}` : undefined }}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  style={{
                    padding: "8px 12px",
                    color: c === 0 || c === 1 ? t.color.text.primary : t.color.text.secondary,
                    fontFamily: c === 0 || c === 1 || c === 2 ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
                    fontSize: c === 0 || c === 1 || c === 2 ? 12 : 13,
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
