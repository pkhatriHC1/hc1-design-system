import { Activity, Clock, DollarSign, Target, TrendingUp, Users } from "lucide-react";
import { Grid, KpiCard, KpiGroup } from "../../patterns";
import { DocPage, DocBlock, RuleList, Callout, t } from "../standards/_shared";
import { PropsTable, PropSectionEyebrow, type PropRow } from "./_props";

export function KpiCardDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <VariantsBlock />
      <DeltaBlock />
      <GroupBlock />
      <StatesBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · KpiCard"
      title="KpiCard — the standard metric card"
      lead="Every metric tile in every hc1 product is a KpiCard. Its look is fixed: a 12px uppercase label, a 24px bold value, an optional 14px supporting line. You never pick a variant by name. The card works out which one it is from the data you pass, so two products showing the same kind of metric always look the same."
    />
  );
}

/* ══════ Variants ═══════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock
      title="Three variants, chosen by the data"
      lead="basic: label and value. trend: add `delta` (and usually `supportingText`). goal: add `goal`, which draws a progress bar towards a target. An `icon` is allowed on any of them."
    >
      <Grid columns={3}>
        <KpiCard icon={<DollarSign />} label="Direct product savings" value="$219,240" />
        <KpiCard
          label="Active vendors"
          value="5"
          delta={{ value: 2.1, direction: "up" }}
          supportingText="vs last month"
        />
        <KpiCard
          label="Hgb <7 rate"
          value="88.3%"
          delta={{ value: 0.5, direction: "up" }}
          supportingText="vs last month"
          goal={{ label: "Goal: 90%", progress: 98, status: "at-risk" }}
        />
      </Grid>
    </DocBlock>
  );
}

/* ══════ Delta ══════════════════════════════════════════════════════ */

function DeltaBlock() {
  return (
    <DocBlock
      title="Delta and goal colours"
      lead="Pass `positive` to say which direction is good for this metric. Growth metrics (revenue, patients seen) are positive-up; cost metrics (wait time, error rate) are positive-down. The DS picks green or red. A goal bar is green on track, amber at risk, red off track."
    >
      <Grid columns={3}>
        <KpiCard
          icon={<TrendingUp />}
          label="Revenue"
          value="$9.8M"
          delta={{ value: 12, direction: "up", positive: "up" }}
          supportingText="vs last month"
          goal={{ label: "Goal: $10M", progress: 98, status: "on-track" }}
        />
        <KpiCard
          icon={<Clock />}
          label="Avg wait time"
          value="14 min"
          delta={{ value: 8, direction: "down", positive: "down" }}
          supportingText="vs last month"
          goal={{ label: "Goal: 10 min", progress: 60, status: "at-risk" }}
        />
        <KpiCard
          icon={<Activity />}
          label="Critical alerts"
          value="7"
          delta={{ value: 3, direction: "up", positive: "down" }}
          supportingText="this week"
          goal={{ label: "Goal: 0", progress: 20, status: "off-track" }}
        />
      </Grid>

      <Callout tone="info" title="What colour means">
        Green means the metric moved the way you want. Red means it moved against you. Grey means flat or no declared direction. KpiCard has no className or style, so the colour mapping can&apos;t be overridden: that is the point.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Group ══════════════════════════════════════════════════════ */

function GroupBlock() {
  return (
    <DocBlock
      title="KpiGroup — related metrics in one card"
      lead="When several KPIs tell one story (identified → realized → still to capture), put them in a KpiGroup. It draws one card with dividers instead of separate tiles. Use Grid for unrelated KPIs."
    >
      <KpiGroup>
        <KpiCard icon={<Target />} label="Identified savings" value="9,769,947" supportingText="across 12 initiatives" />
        <KpiCard
          icon={<TrendingUp />}
          label="Realized savings"
          value="2,540,186"
          supportingText="from 3 completed initiatives"
          goal={{ label: "26% captured", progress: 26, status: "at-risk" }}
        />
        <KpiCard icon={<Activity />} label="Still to capture" value="7,229,761" supportingText="across 9 active initiatives" />
      </KpiGroup>
    </DocBlock>
  );
}

/* ══════ States ═════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock
      title="Loading, clickable and compact"
      lead="`loading` swaps the value for skeletons. `onClick` makes the whole card a button with hover, focus and press feedback. `density=&quot;compact&quot;` drops the padding to 16px for dense side rails."
    >
      <Grid columns={3}>
        <KpiCard label="Revenue" value="$9.8M" loading />
        <KpiCard
          label="Patients"
          value="342"
          icon={<Users />}
          delta={{ value: 12, direction: "up" }}
          supportingText="vs last month"
          onClick={() => {}}
        />
        <KpiCard label="Patients" value="342" density="compact" supportingText="compact density" />
      </Grid>
    </DocBlock>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

const CARD_PROPS: PropRow[] = [
  { name: "label",          type: "ReactNode",              def: "—",         desc: "Metric name. Rendered 12px uppercase; wraps rather than truncates." },
  { name: "value",          type: "ReactNode",              def: "—",         desc: "The figure. Rendered 24px bold, tabular numbers." },
  { name: "icon",           type: "ReactNode",              def: "—",         desc: "Lucide icon in a tinted tile beside the label." },
  { name: "delta",          type: "KpiCardDelta",           def: "—",         desc: "Change vs an earlier period → trend variant. Shown as a pill." },
  { name: "supportingText", type: "ReactNode",              def: "—",         desc: "One 14px line under the value, e.g. 'vs last month'." },
  { name: "goal",           type: "KpiCardGoal",            def: "—",         desc: "Progress towards a target → goal variant." },
  { name: "sparkline",      type: "number[]",               def: "—",         desc: "Small trend line beside the value (trend variant only)." },
  { name: "loading",        type: "boolean",                def: "false",     desc: "Skeleton placeholders while data loads." },
  { name: "onClick",        type: "() => void",             def: "—",         desc: "Makes the whole card a button." },
  { name: "ariaLabel",      type: "string",                 def: "—",         desc: "Accessible name when the card is clickable." },
  { name: "density",        type: "'default' | 'compact'",  def: "'default'", desc: "Compact drops padding from 24px to 16px." },
];

const DELTA_PROPS: PropRow[] = [
  { name: "value",     type: "number",                 def: "—",    desc: "Percentage change. The sign comes from `direction`." },
  { name: "direction", type: "'up' | 'down' | 'flat'", def: "—",    desc: "Which way the metric moved." },
  { name: "positive",  type: "'up' | 'down'",          def: "'up'", desc: "Which direction is good. Sets green vs red." },
  { name: "unit",      type: "string",                 def: "'%'",  desc: "Suffix after the value." },
  { name: "label",     type: "ReactNode",              def: "—",    desc: "Deprecated: use `supportingText`. Ignored (with a dev warning) when both are set." },
];

const GOAL_PROPS: PropRow[] = [
  { name: "label",    type: "ReactNode",                              def: "—",          desc: "Shown at the right of the supporting line, e.g. 'Goal: 90%'." },
  { name: "progress", type: "number",                                 def: "—",          desc: "0–100. Clamped." },
  { name: "status",   type: "'on-track' | 'at-risk' | 'off-track'",   def: "'on-track'", desc: "Bar colour: green, amber or red." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>KpiCard</PropSectionEyebrow>
      <PropsTable rows={CARD_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>KpiCardDelta</PropSectionEyebrow>
        <PropsTable rows={DELTA_PROPS} />
      </div>
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>KpiCardGoal</PropSectionEyebrow>
        <PropsTable rows={GOAL_PROPS} />
      </div>
    </DocBlock>
  );
}

/* ══════ Notes ══════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          { tone: "must",   text: "Never rebuild a metric tile by hand. If KpiCard can't show your metric, propose the change to the design system." },
          { tone: "must",   text: "Set `positive: 'down'` on cost, wait-time and error-rate metrics, or a good result turns red." },
          { tone: "must",   text: "Always give a goal bar a `label` with the figure ('26% captured', 'Goal: 90%'). The bar alone is not enough to read the value." },
          { tone: "should", text: "Use KpiGroup for KPIs that tell one story, Grid for unrelated ones. Keep to 3–5 per row." },
          { tone: "note",   text: "Removed in 0.16: className and style. `delta.label` is deprecated in favour of `supportingText`." },
        ]}
      />
    </DocBlock>
  );
}
