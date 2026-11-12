import { useState } from "react";
import { StepChecklist } from "../../patterns";
import { Progress } from "../../components/progress";
import { DocPage, DocBlock, RuleList } from "../standards/_shared";
import { PropsTable, type PropRow } from "./_props";

const START = [
  { id: "1", label: "Action plan generated", done: true, meta: "Oct 20, 2026" },
  { id: "2", label: "Battle card reviewed", done: true, meta: "Oct 21, 2026" },
  { id: "3", label: "Email sent to vendor", done: false },
  { id: "4", label: "Negotiation underway", done: false },
];

export function StepChecklistDoc() {
  const [steps, setSteps] = useState(START);
  const done = steps.filter(s => s.done).length;
  return (
    <DocPage>
      <DocBlock
        eyebrow="Pattern · StepChecklist"
        title="StepChecklist — process steps marked done"
        lead="A list of steps with a completion tick or an empty circle. Not a form control: click a step to mark it done or undo it. Done steps stay readable (no strike-through). Pair with Progress for the overall percentage."
      />
      <DocBlock title="Example">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
          <Progress value={Math.round((done / steps.length) * 100)} size="sm" aria-label="Progress" />
          <StepChecklist
            ariaLabel="Vendor progress"
            steps={steps}
            onToggle={id => setSteps(s => s.map(x => x.id === id ? { ...x, done: !x.done, meta: !x.done ? "Today" : undefined } : x))}
            onRemove={id => setSteps(s => s.filter(x => x.id !== id))}
          />
        </div>
      </DocBlock>
      <DocBlock title="Props"><PropsTable rows={PROPS} /></DocBlock>
      <DocBlock title="Notes">
        <RuleList rules={[
          { tone: "must", text: "Use StepChecklist for progress through a process. Use Checkbox only for form choices the user submits." },
          { tone: "should", text: "Show the completion date as meta on done steps." },
        ]} />
      </DocBlock>
    </DocPage>
  );
}

const PROPS: PropRow[] = [
  { name: "steps", type: "{ id; label; done; meta? }[]", def: "—", desc: "The steps, in order." },
  { name: "onToggle", type: "(id) => void", def: "—", desc: "Makes steps clickable to mark done / undo." },
  { name: "onRemove", type: "(id) => void", def: "—", desc: "Adds a remove action per step, with a confirm." },
  { name: "ariaLabel", type: "string", def: "—", desc: "Accessible name for the list." },
];
