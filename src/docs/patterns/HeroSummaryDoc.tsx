import { CircleDollarSign, Sparkles } from "lucide-react";
import { HeroSummary } from "../../patterns";
import { Button } from "../../components/button";
import { DocPage, DocBlock, RuleList, t } from "../standards/_shared";
import { PropsTable, type PropRow } from "./_props";

export function HeroSummaryDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Pattern · HeroSummary"
        title="HeroSummary — the one headline banner on a page"
        lead="A full-width banner for the single most important figure on a page: total potential savings, or what the AI agents found. At most one per page, placed directly under the PageHeader (in PageTemplate's `widgets` slot)."
      />

      <DocBlock
        title="Standard"
        lead="Solid dark teal (brand-800). Use this for any headline figure that is not AI-generated."
      >
        <HeroSummary
          icon={<CircleDollarSign />}
          label="Total potential savings"
          value="1,287,112"
          supportingText="11 initiatives · 9 vendors"
        />
      </DocBlock>

      <DocBlock
        title="AI"
        lead="Set `ai` when the banner reports on AI agents or AI findings. It switches to the teal → amber AI gradient. White text passes WCAG AA across the whole gradient."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.lg }}>
          <HeroSummary
            ai
            icon={<Sparkles />}
            label="AI Agent Insights"
            value="10 active insights"
            supportingText="Ambient agents continuously monitoring your supply chain"
            action={<Button variant="outline">View initiatives</Button>}
          />
        </div>
      </DocBlock>

      <DocBlock title="Props">
        <PropsTable rows={PROPS} />
      </DocBlock>

      <DocBlock title="Notes">
        <RuleList
          rules={[
            { tone: "must",   text: "One HeroSummary per page at most. If everything is a headline, nothing is." },
            { tone: "must",   text: "Use `ai` only when AI content sits behind the banner. The gradient is the AI signal; don't use it for decoration." },
            { tone: "should", text: "Keep the action to a single outline Button. Secondary actions belong on the page, not in the banner." },
            { tone: "note",   text: "There is no className or colour prop. Every product's banner looks the same." },
          ]}
        />
      </DocBlock>
    </DocPage>
  );
}

const PROPS: PropRow[] = [
  { name: "label",          type: "ReactNode", def: "—",     desc: "Small 14px line above the value." },
  { name: "value",          type: "ReactNode", def: "—",     desc: "The headline figure or statement, 32px bold." },
  { name: "supportingText", type: "ReactNode", def: "—",     desc: "One 14px line under the value." },
  { name: "icon",           type: "ReactNode", def: "—",     desc: "Lucide icon in a translucent tile on the left." },
  { name: "action",         type: "ReactNode", def: "—",     desc: "One Button on the right." },
  { name: "ai",             type: "boolean",   def: "false", desc: "AI surface → teal → amber AI gradient." },
];
