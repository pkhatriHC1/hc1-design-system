import { useState } from "react";
import type { ReactNode } from "react";
import { Wizard } from "../../patterns";
import type { WizardStep } from "../../patterns";
import { Input } from "../../components/input";
import { Switch } from "../../components/switch";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

const STEPS: WizardStep[] = [
  { id: "account", label: "Account",  description: "Basic info" },
  { id: "profile", label: "Profile",  description: "Bio + preferences" },
  { id: "review",  label: "Review",   description: "Confirm details" },
];

export function WizardDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <LiveBlock />
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
      eyebrow="Pattern · Wizard"
      title="Wizard — multi-step form flow"
      lead="Wizard renders a numbered step indicator + wraps the current step's content + drops in Back/Next/Finish buttons. Consumer owns the currentStep index and per-step content. Steps auto-mark as done (checkmark) once the user moves past them; done steps are clickable to jump back, future steps aren't (linear flow)."
    />
  );
}

/* ══════ Live ══════════════════════════════════════════════════════ */

function LiveBlock() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);

  const canAdvance =
    step === 0 ? name.length > 0 && email.length > 0 : true;

  return (
    <DocBlock title="Live example" lead="Fill in step 1, then advance. Notice the checkmarks appearing on completed steps — done steps are clickable to jump back.">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
        }}
      >
        <Wizard
          steps={STEPS}
          currentStep={step}
          onStepChange={setStep}
          onBack={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
          onFinish={() => alert("Onboarding complete")}
          canAdvance={canAdvance}
        >
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
              <Switch checked={notifications} onCheckedChange={setNotifications}>Email notifications</Switch>
              <Switch checked={digest} onCheckedChange={setDigest}>Weekly digest</Switch>
            </div>
          )}
          {step === 2 && (
            <div
              style={{
                border: `1px solid ${t.color.border.subtle}`,
                borderRadius: t.radius.control,
                background: t.color.background.subtle,
                padding: t.space.inline.lg,
                fontFamily: t.font.mono,
                fontSize: 13,
                color: t.color.text.primary,
              }}
            >
              <div>Name: {name}</div>
              <div>Email: {email}</div>
              <div>Notifications: {String(notifications)}</div>
              <div>Digest: {String(digest)}</div>
            </div>
          )}
        </Wizard>
      </div>
    </DocBlock>
  );
}

/* ══════ States ═══════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock
      title="canAdvance gates the Next button"
      lead="Pass `canAdvance={false}` to disable Next / Finish — useful when the step's form is incomplete or has validation errors."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
        }}
      >
        <Wizard
          steps={STEPS}
          currentStep={1}
          onBack={() => {}}
          onNext={() => {}}
          canAdvance={false}
        >
          <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>
            Step 2 content — Next disabled because the form has validation errors.
          </div>
        </Wizard>
      </div>
    </DocBlock>
  );
}

/* ══════ Props ══════════════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "steps",         type: "WizardStep[]",             def: "—",           desc: "Step definitions ({ id, label, description? }) in visit order." },
  { name: "currentStep",   type: "number",                   def: "—",           desc: "0-based index of the visible step." },
  { name: "onStepChange",  type: "(index: number) => void",  def: "—",           desc: "Fires when the user clicks a completed step. Suppressed for future steps (linear flow)." },
  { name: "onBack",        type: "() => void",               def: "—",           desc: "Back handler. Renders a Back button, disabled on the first step." },
  { name: "onNext",        type: "() => void",               def: "—",           desc: "Next handler. Renders Next on every step except the last." },
  { name: "onFinish",      type: "() => void",               def: "—",           desc: "Finish handler. Renders Finish on the last step in place of Next." },
  { name: "canAdvance",    type: "boolean",                  def: "true",        desc: "Gate the Next / Finish button — for form validation." },
  { name: "backLabel",     type: "string",                   def: "'Back'",      desc: "Label on the Back button." },
  { name: "nextLabel",     type: "string",                   def: "'Continue'",  desc: "Label on the Next button." },
  { name: "finishLabel",   type: "string",                   def: "'Finish'",    desc: "Label on the Finish button." },
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
          gridTemplateColumns: "160px 1.4fr 120px 2fr",
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
            gridTemplateColumns: "160px 1.4fr 120px 2fr",
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
          { tone: "must",   text: "Consumer owns state per step — validate + persist the current step's inputs before advancing. Wizard doesn't remember form data across steps." },
          { tone: "should", text: "Reach for canAdvance to gate Next when the step is incomplete. The user gets immediate visual feedback that the button is disabled and knows they have work to do on the current step." },
          { tone: "should", text: "Keep step count under 5. Users glazing over is a real thing; if you have 6+ steps, consider whether some can be inlined or moved to a settings page." },
          { tone: "note",   text: "Completed steps are clickable to jump back (progress isn't lost). Future steps aren't — the DS keeps the flow linear so users don't skip validation." },
        ]}
      />

      <Callout tone="info" title="Pair with react-hook-form">
        Wizard doesn&apos;t know about forms — it&apos;s a shell. Wrap the step contents in a <code>Form</code> pattern (react-hook-form) and use <code>form.trigger()</code> to validate the current step&apos;s fields before firing <code>onNext</code>.
      </Callout>
    </DocBlock>
  );
}
