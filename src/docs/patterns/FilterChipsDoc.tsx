import { useState } from "react";
import { DollarSign, FileText, TrendingUp } from "lucide-react";
import { FilterChips } from "../../patterns";
import { DocPage, DocBlock, RuleList } from "../standards/_shared";
import { PropsTable, type PropRow } from "./_props";

export function FilterChipsDoc() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DocPage>
      <DocBlock
        eyebrow="Pattern · FilterChips"
        title="FilterChips — one-click filters with a summary"
        lead="A row of toggle chips that filter the content below. Each chip can show an icon and a meta line (count, total). Click to filter; click again, or Clear, to remove the filter."
      />
      <DocBlock title="Example">
        <FilterChips
          ariaLabel="Initiative category"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "cw", label: "Contract Watchdog", meta: "6 · 1,422,696", icon: <FileText /> },
            { value: "pv", label: "Price Variance", meta: "5 · 184,416", icon: <DollarSign /> },
            { value: "mi", label: "Market Intelligence", meta: "2 · 96,000", icon: <TrendingUp /> },
          ]}
        />
      </DocBlock>
      <DocBlock title="Props"><PropsTable rows={PROPS} /></DocBlock>
      <DocBlock title="Notes">
        <RuleList rules={[
          { tone: "must", text: "Use FilterChips only for filters. For summary figures that don't filter, use KpiCard / KpiGroup." },
          { tone: "should", text: "Keep to 2–6 chips. For more options, or several filters at once, use FilterBar." },
        ]} />
      </DocBlock>
    </DocPage>
  );
}

const PROPS: PropRow[] = [
  { name: "options", type: "{ value; label; meta?; icon? }[]", def: "—", desc: "The chips, in display order." },
  { name: "value", type: "string | null", def: "—", desc: "Selected chip, or null for no filter." },
  { name: "onValueChange", type: "(value | null) => void", def: "—", desc: "Called with the chip's value, or null when cleared." },
  { name: "ariaLabel", type: "string", def: "—", desc: "Accessible name for the group." },
  { name: "showClear", type: "boolean", def: "true", desc: "Shows a Clear action while a filter is active." },
];
