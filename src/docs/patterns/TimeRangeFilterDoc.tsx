import { useState } from "react";
import { TimeRangeFilter } from "../../patterns";
import { PageHeader } from "../../components/page-header";
import { Calendar } from "../../components/calendar";
import { DatePicker } from "../../components/date-picker";
import type { DateRange } from "../../components/calendar";
import { DocPage, DocBlock, RuleList } from "../standards/_shared";
import { PropsTable, PropSectionEyebrow, type PropRow } from "./_props";

const OPTIONS = [
  { value: "30d", label: "30 Days" },
  { value: "6m", label: "6 Months" },
  { value: "12m", label: "12 Months" },
  { value: "ct", label: "Contract Term" },
];

export function TimeRangeFilterDoc() {
  const [value, setValue] = useState("12m");
  const [custom, setCustom] = useState<DateRange | undefined>();
  const [single, setSingle] = useState<Date | undefined>();
  return (
    <DocPage>
      <DocBlock
        eyebrow="Pattern · TimeRangeFilter"
        title="TimeRangeFilter — the dashboard time-range switcher"
        lead="Preset ranges as segmented pills, plus an optional Custom pill that opens a two-month range calendar straight away. After Apply, the Custom pill shows the dates. It always goes in PageHeader's `actions` slot, on the title row."
      />
      <DocBlock title="On the title row" lead="Click Custom, pick a start and end date, then Apply.">
        <PageHeader
          title="Supply Chain Dashboard"
          subtitle="Real-time insights into your lab spending"
          actions={
            <TimeRangeFilter
              options={OPTIONS}
              value={value}
              onValueChange={setValue}
              customRange={custom}
              onCustomRangeChange={setCustom}
            />
          }
        />
      </DocBlock>
      <DocBlock title="DatePicker — single date fields" lead="For a date in a form, use DatePicker: a 36px field that opens the calendar. Never use a native date input.">
        <div style={{ maxWidth: 320 }}>
          <DatePicker label="Next report date" value={single} onChange={setSingle} />
        </div>
      </DocBlock>
      <DocBlock title="Calendar on its own" lead="The underlying calendar, for custom layouts inside a Popover.">
        <Calendar mode="single" selected={single} onSelect={setSingle} />
      </DocBlock>
      <DocBlock title="Props">
        <PropSectionEyebrow>TimeRangeFilter</PropSectionEyebrow>
        <PropsTable rows={PROPS} />
      </DocBlock>
      <DocBlock title="Notes">
        <RuleList
          rules={[
            { tone: "must", text: "Put the filter in PageHeader `actions`. Don't place it as a separate row under the header." },
            { tone: "must", text: "Never build a date range from two native date inputs. Use the Custom pill." },
            { tone: "should", text: "Keep to 3–5 presets. Name them by length ('30 Days'), not by date." },
            { tone: "note", text: "Future dates are disabled by default; pass `maxDate` to change that." },
          ]}
        />
      </DocBlock>
    </DocPage>
  );
}

const PROPS: PropRow[] = [
  { name: "options", type: "{ value; label }[]", def: "—", desc: "Preset ranges, in display order." },
  { name: "value", type: "string", def: "—", desc: "Selected preset value, or \"custom\"." },
  { name: "onValueChange", type: "(value) => void", def: "—", desc: "Called when a preset is picked, and with \"custom\" after Apply." },
  { name: "customRange", type: "DateRange", def: "—", desc: "The applied custom range, shown on the Custom pill." },
  { name: "onCustomRangeChange", type: "(range) => void", def: "—", desc: "Enables the Custom pill. Called on Apply." },
  { name: "customLabel", type: "string", def: "'Custom'", desc: "Label of the Custom pill before a range is applied." },
  { name: "maxDate", type: "Date", def: "today", desc: "Latest selectable date." },
  { name: "ariaLabel", type: "string", def: "'Time range'", desc: "Accessible name for the group." },
];
