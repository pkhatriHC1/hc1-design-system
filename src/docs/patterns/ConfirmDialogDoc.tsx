import { useState } from "react";
import type { ReactNode } from "react";
import { ConfirmDialog } from "../../patterns/confirm-dialog";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

export function ConfirmDialogDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <VariantsBlock />
      <TypedGuardBlock />
      <AsyncBlock />
      <PlaygroundBlock />
      <PropsTableBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · ConfirmDialog"
      title="ConfirmDialog — the canonical confirmation preset"
      lead="ConfirmDialog is Dialog with four affordances baked in: a title / description panel, a destructive tone, a typed-name guard for irreversible actions, and async confirm handling with a loading state. Reach for it whenever a click needs a second thought — delete, publish, discard, sign-out — instead of rebuilding a Dialog + Button + Input triad every time."
    />
  );
}

/* ══════ Variants ═════════════════════════════════════════════════════ */

function VariantsBlock() {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);

  return (
    <DocBlock
      title="Default vs. destructive"
      lead="`variant='destructive'` swaps the Confirm button to the red destructive style so the affordance reads correctly at a glance. Reserve destructive for delete / discard / remove flows; use the default variant for generic confirmations (publish, invite, transfer)."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          gap: t.space.inline.lg,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button variant="default" onClick={() => setDefaultOpen(true)}>
          Publish batch
        </Button>
        <Button variant="destructive" onClick={() => setDestructiveOpen(true)}>
          Delete report
        </Button>

        <ConfirmDialog
          open={defaultOpen}
          onOpenChange={setDefaultOpen}
          title="Publish this batch?"
          description="Publishing makes the batch visible to all consumers of the ClinicalIQ workspace. You can still edit individual records after publishing."
          confirmLabel="Publish"
          onConfirm={() => {
            // eslint-disable-next-line no-console
            console.log("published");
          }}
        />
        <ConfirmDialog
          open={destructiveOpen}
          onOpenChange={setDestructiveOpen}
          title="Delete this report?"
          description="This action is permanent. All linked comments and shares will also be removed."
          confirmLabel="Delete report"
          variant="destructive"
          onConfirm={() => {
            // eslint-disable-next-line no-console
            console.log("deleted");
          }}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Typed guard ═══════════════════════════════════════════════ */

function TypedGuardBlock() {
  const [open, setOpen] = useState(false);

  return (
    <DocBlock
      title="Typed-name guard"
      lead="For irreversible actions — deleting a project, transferring ownership, purging a workspace — pass `typedGuard` and the DS renders an Input under the description. Confirm stays disabled until the user types the exact value. Standard pattern in Vercel / GitHub / AWS consoles."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete workspace
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete the ClinicalIQ workspace?"
          description="All patients, batches, and reports will be deleted immediately. This cannot be undone."
          confirmLabel="Delete workspace"
          variant="destructive"
          typedGuard="clinical-iq"
          onConfirm={() => {
            // eslint-disable-next-line no-console
            console.log("purged");
          }}
        />
      </div>

      <Callout tone="warning" title="Choose the guard string carefully">
        Pick a value the user can copy verbatim from the description or from what they were looking at. "clinical-iq" (the workspace slug they already read on the page) is a good guard. A random UUID is a bad one — users will paste blindly and defeat the whole point of a friction step.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Async ═════════════════════════════════════════════════════ */

function AsyncBlock() {
  const [open, setOpen] = useState(false);

  return (
    <DocBlock
      title="Async confirm"
      lead="`onConfirm` may return a Promise. While it's pending the Confirm button shows loading, Cancel + Escape + overlay-click all suppress so the user can't half-fire, and the dialog closes on resolve. Rejections keep the dialog open — the consumer catches the error and surfaces feedback (toast / inline alert) themselves."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="default" onClick={() => setOpen(true)}>
          Publish with 1.5s delay
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Publish and notify subscribers?"
          description="This will trigger notifications to 42 subscribers of the batch."
          confirmLabel="Publish + notify"
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 1500));
          }}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant] = useState<"default" | "destructive">("destructive");
  const [useGuard, setUseGuard] = useState(true);
  const [useAsync, setUseAsync] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <DocBlock title="Playground" lead="Toggle each affordance and open the dialog to try the combination.">
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: t.space.section.sm,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            minHeight: 140,
          }}
        >
          <Button variant={variant} onClick={() => setOpen(true)}>
            Open ConfirmDialog
          </Button>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title={variant === "destructive" ? "Delete this project?" : "Publish this project?"}
            description={
              variant === "destructive"
                ? "All members will lose access immediately."
                : "The project will be visible to all workspace members."
            }
            confirmLabel={variant === "destructive" ? "Delete" : "Publish"}
            variant={variant}
            typedGuard={useGuard ? "delete-me" : undefined}
            onConfirm={
              useAsync
                ? async () => {
                    await new Promise((r) => setTimeout(r, 1200));
                  }
                : () => {}
            }
          />
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl
            label="variant"
            value={variant}
            options={["default", "destructive"]}
            onChange={(v) => setVariant(v as "default" | "destructive")}
          />
          <ToggleControl label="typedGuard" value={useGuard} onChange={setUseGuard} />
          <ToggleControl label="async onConfirm" value={useAsync} onChange={setUseAsync} />
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Controls (shared) ═══════════════════════════════════════════ */

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36,
          padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control,
          border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default,
          color: t.color.text.primary,
          fontFamily: t.font.sans,
          fontSize: 14,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: t.space.inline.md,
        padding: `${t.space.stack.sm} ${t.space.inline.md}`,
        borderRadius: t.radius.control,
        border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default,
        cursor: "pointer",
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
      {children}
    </span>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "open",            type: "boolean",                              def: "—",           desc: "Controlled open state. Pair with onOpenChange." },
  { name: "onOpenChange",    type: "(open: boolean) => void",              def: "—",           desc: "Fires when the dialog wants to open or close." },
  { name: "title",           type: "ReactNode",                            def: "—",           desc: "Dialog heading — 1–5 words, sentence case." },
  { name: "description",     type: "ReactNode",                            def: "—",           desc: "Paragraph under the title explaining consequences." },
  { name: "confirmLabel",    type: "string",                               def: "'Confirm'",   desc: "Confirm button label." },
  { name: "cancelLabel",     type: "string",                               def: "'Cancel'",    desc: "Cancel button label." },
  { name: "variant",         type: "'default' | 'destructive'",            def: "'default'",   desc: "'destructive' swaps Confirm to the red destructive style." },
  { name: "typedGuard",      type: "string",                               def: "—",           desc: "String the user must type before Confirm unlocks. Use for irreversible actions." },
  { name: "typedGuardLabel", type: "ReactNode",                            def: "auto",        desc: "Label above the typed-guard Input. Defaults to 'Type \"<value>\" to confirm.'" },
  { name: "onConfirm",       type: "() => void | Promise<void>",           def: "—",           desc: "Fires when the user clicks Confirm (and passes the typed guard, if set). May be async." },
  { name: "onCancel",        type: "() => void",                           def: "—",           desc: "Optional cancel handler — fires when the user clicks Cancel." },
  { name: "children",        type: "ReactNode",                            def: "—",           desc: "Extra body content between description and the typed guard / actions." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
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
            gridTemplateColumns: "180px 1.4fr 140px 2fr",
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
        {PROPS.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1.4fr 140px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <code
              style={{
                fontFamily: t.font.mono,
                fontSize: 13,
                color: t.color.action.primary,
                fontWeight: 600,
              }}
            >
              {row.name}
            </code>
            <code
              style={{
                fontFamily: t.font.mono,
                fontSize: 12,
                color: t.color.text.secondary,
                wordBreak: "break-word",
              }}
            >
              {row.type}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
              {row.def}
            </code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
          </div>
        ))}
      </div>
    </DocBlock>
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

/* ══════ Notes ═════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          {
            tone: "must",
            text: "Use `variant='destructive'` only for actions that actually destroy data. Publish, share, invite — those are not destructive. The red tone communicates 'this deletes something'.",
          },
          {
            tone: "must",
            text: "For destructive typed-guard flows, the guard string must appear on the surface behind the dialog (the item name, the workspace slug, whatever the user was looking at). A guard string the user has to invent doesn't add friction — it adds confusion.",
          },
          {
            tone: "should",
            text: "Keep the title to 1–5 words phrased as a question ('Delete this report?'). Keep the description to one sentence describing consequences. Longer copy pushes the actions below the fold.",
          },
          {
            tone: "should",
            text: "Handle rejection in your `onConfirm` — surface the error via Toast or an inline Alert. The dialog stays open on reject so the user has context, but the DS can't render your error text.",
          },
          {
            tone: "note",
            text: "Behind the scenes: while `onConfirm` is pending, the Confirm button sets `loading`, Cancel disables, and Dialog's `closeOnOverlayClick` + `closeOnEscape` are set to false so the dialog can't be dismissed mid-flight.",
          },
        ]}
      />
    </DocBlock>
  );
}
