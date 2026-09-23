import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { AtSign, User } from "lucide-react";
import {
  Form,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormSwitch,
  FormRadioGroup,
  FormSection,
  FormActions,
} from "../../patterns/form";
import { Button } from "../../components/button";
import { Radio } from "../../components/radio";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

type ProfileValues = {
  fullName: string;
  email: string;
  bio: string;
  role: string;
  visibility: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  terms: boolean;
};

export function FormsDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <ArchitectureBlock />
      <SugarBlock />
      <LiveFormBlock />
      <HeadlessBlock />
      <LayoutBlock />
      <PropsBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Pattern · Form"
      title="Form — react-hook-form adapter for HC1 primitives"
      lead="Form is the plug-and-play forms layer at @hc1/design-system/patterns. It's a thin adapter over react-hook-form: consumers use `useForm` for state, then drop `<FormInput>` / `<FormTextarea>` / `<FormSelect>` / `<FormCheckbox>` / `<FormSwitch>` / `<FormRadioGroup>` in place of the raw primitives. The sugar wrappers forward RHF's field into the primitive's controlled props and map `fieldState.error` to whatever error surface the primitive exposes — so validation styling, aria-invalid, and helper-slot swapping just work."
    />
  );
}

/* ══════ Architecture ═══════════════════════════════════════════════ */

function ArchitectureBlock() {
  return (
    <DocBlock
      title="How it fits together"
      lead="Three pieces, and only one of them ever ships product-specific decisions. RHF owns state + validation. The sugar wrappers own the RHF ↔ primitive bridge. The primitives (Input / Textarea / Select / Checkbox / Switch / RadioGroup) own the visual + interaction layer."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: t.space.inline.lg,
        }}
      >
        <Layer
          title="react-hook-form"
          role="State + validation"
          detail="useForm() gives you `form.control`, `form.handleSubmit`, and per-field error state. RHF is an OPTIONAL peer dep — consumers who don't reach for <Form> don't pay for it."
        />
        <Layer
          title="patterns/form"
          role="RHF ↔ primitive bridge"
          detail="Form, FormField, Form* sugar. Forwards field bindings, maps error.message → primitive's errorMessage, preserves RHF generics so `name` autocompletes against the schema."
        />
        <Layer
          title="components/*"
          role="Visual + interaction"
          detail="Input / Textarea / Select / Checkbox / Switch / RadioGroup. Same primitives you'd use standalone — the sugar just wires RHF's field into their controlled props."
        />
      </div>
    </DocBlock>
  );
}

function Layer({ title, role, detail }: { title: string; role: string; detail: string }) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.subtle,
        padding: t.space.inline.lg,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
      }}
    >
      <div>
        <div
          style={{
            ...t.type.caption,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 700,
            color: t.color.text.tertiary,
          }}
        >
          {role}
        </div>
        <div
          style={{
            ...t.type.bodyS,
            fontWeight: 700,
            color: t.color.text.primary,
            fontFamily: t.font.mono,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{detail}</div>
    </div>
  );
}

/* ══════ Sugar wrappers ═════════════════════════════════════════════ */

function SugarBlock() {
  return (
    <DocBlock
      title="Sugar wrappers"
      lead="One wrapper per primitive that carries state. Each takes `control` + `name` plus every prop from the underlying primitive; the wrapper forwards RHF's `field` and maps errors."
    >
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
            gridTemplateColumns: "180px 1fr 1.5fr",
            background: t.color.background.subtle,
            padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
            borderBottom: `1px solid ${t.color.border.subtle}`,
          }}
        >
          <HeaderCell>Wrapper</HeaderCell>
          <HeaderCell>Wraps</HeaderCell>
          <HeaderCell>Error surface</HeaderCell>
        </div>
        {SUGAR_TABLE.map((row, i) => (
          <div
            key={row.wrapper}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 1.5fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === SUGAR_TABLE.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
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
              {row.wrapper}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary }}>
              {row.wraps}
            </code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.error}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

const SUGAR_TABLE = [
  { wrapper: "FormInput",      wraps: "Input",       error: "fieldState.error.message → Input.errorMessage" },
  { wrapper: "FormTextarea",   wraps: "Textarea",    error: "fieldState.error.message → Textarea.errorMessage" },
  { wrapper: "FormSelect",     wraps: "Select",      error: "fieldState.error.message → Select.errorMessage" },
  { wrapper: "FormCheckbox",   wraps: "Checkbox",    error: "!!fieldState.error → Checkbox.invalid (no inline text)" },
  { wrapper: "FormSwitch",     wraps: "Switch",      error: "!!fieldState.error → Switch.invalid (no inline text)" },
  { wrapper: "FormRadioGroup", wraps: "RadioGroup",  error: "fieldState.error.message → RadioGroup.errorMessage" },
];

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

/* ══════ Live form ══════════════════════════════════════════════════ */

function LiveFormBlock() {
  const form = useForm<ProfileValues>({
    defaultValues: {
      fullName: "Jane Cooper",
      email: "",
      bio: "",
      role: "clinician",
      visibility: "team",
      emailNotifications: true,
      weeklyDigest: false,
      terms: false,
    },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    // eslint-disable-next-line no-console
    console.log("submit", values);
  });

  return (
    <DocBlock
      title="Live example"
      lead="A real form composing every sugar wrapper. Try tabbing through — errors show on blur, submit logs the values object to the console."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
        }}
      >
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormSection title="Account" description="Basic information about you.">
              <FormInput
                control={form.control}
                name="fullName"
                label="Full name"
                required
                placeholder="Jane Cooper"
                leadingIcon={<User />}
              />
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                required
                placeholder="you@company.com"
                leadingIcon={<AtSign />}
                type="email"
              />
              <FormTextarea
                control={form.control}
                name="bio"
                label="Bio"
                placeholder="A short description shown on your profile card."
                minRows={3}
                autoResize
                maxLength={200}
                showCounter
              />
              <FormSelect
                control={form.control}
                name="role"
                label="Role"
                options={[
                  { label: "Clinician", value: "clinician" },
                  { label: "Analyst", value: "analyst" },
                  { label: "Administrator", value: "administrator" },
                ]}
              />
            </FormSection>

            <FormSection title="Sharing" description="Who can see this profile.">
              <FormRadioGroup
                control={form.control}
                name="visibility"
                label="Visibility"
                orientation="vertical"
              >
                <Radio value="team">Team only</Radio>
                <Radio value="org">Everyone in the organization</Radio>
                <Radio value="public">Public</Radio>
              </FormRadioGroup>
            </FormSection>

            <FormSection title="Notifications">
              <FormSwitch
                control={form.control}
                name="emailNotifications"
              >
                Email notifications
              </FormSwitch>
              <FormSwitch control={form.control} name="weeklyDigest">
                Weekly digest
              </FormSwitch>
              <FormCheckbox control={form.control} name="terms">
                I accept the terms and conditions
              </FormCheckbox>
            </FormSection>

            <FormActions>
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit">Save profile</Button>
            </FormActions>
          </form>
        </Form>
      </div>
    </DocBlock>
  );
}

/* ══════ Headless FormField ═════════════════════════════════════════ */

function HeadlessBlock() {
  return (
    <DocBlock
      title="Headless FormField"
      lead="Reach for the raw FormField render-prop when no sugar wrapper covers your control — third-party inputs, custom canvases, a bespoke slider. Preserves RHF generics so `name` still autocompletes against the schema."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          padding: t.space.inline.xl,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: t.font.mono,
            fontSize: 12,
            lineHeight: 1.6,
            color: t.color.text.primary,
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
          {HEADLESS_CODE}
        </pre>
      </div>
    </DocBlock>
  );
}

const HEADLESS_CODE = `<FormField
  control={form.control}
  name="dosageMg"
  render={({ field, fieldState }) => (
    <BespokeSlider
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      hasError={!!fieldState.error}
      errorText={fieldState.error?.message}
    />
  )}
/>`;

/* ══════ Layout helpers ═════════════════════════════════════════════ */

function LayoutBlock() {
  return (
    <DocBlock
      title="Layout helpers"
      lead="Two pure-layout components for stacking fields. Zero RHF awareness — they only care about spacing and the action row."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <div
          style={{
            border: `1px solid ${t.color.border.subtle}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
            padding: t.space.inline.lg,
          }}
        >
          <div
            style={{
              ...t.type.bodyS,
              fontWeight: 600,
              color: t.color.text.primary,
              marginBottom: t.space.stack.xs,
            }}
          >
            FormSection
          </div>
          <div
            style={{
              ...t.type.caption,
              color: t.color.text.secondary,
              marginBottom: t.space.stack.md,
            }}
          >
            Titled group with optional description above a stacked content region. Use to group related fields on a settings page.
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: t.font.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: t.color.text.primary,
              whiteSpace: "pre",
              overflowX: "auto",
              padding: t.space.inline.md,
              background: t.color.background.subtle,
              borderRadius: t.radius.control,
            }}
          >
{`<FormSection
  title="Account"
  description="Basic information."
>
  <FormInput … />
  <FormInput … />
</FormSection>`}
          </pre>
        </div>

        <div
          style={{
            border: `1px solid ${t.color.border.subtle}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
            padding: t.space.inline.lg,
          }}
        >
          <div
            style={{
              ...t.type.bodyS,
              fontWeight: 600,
              color: t.color.text.primary,
              marginBottom: t.space.stack.xs,
            }}
          >
            FormActions
          </div>
          <div
            style={{
              ...t.type.caption,
              color: t.color.text.secondary,
              marginBottom: t.space.stack.md,
            }}
          >
            Right-aligned action row with a top divider. `align='between'` for Back/Continue wizards, `align='left'` for narrow drawers.
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: t.font.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: t.color.text.primary,
              whiteSpace: "pre",
              overflowX: "auto",
              padding: t.space.inline.md,
              background: t.color.background.subtle,
              borderRadius: t.radius.control,
            }}
          >
{`<FormActions align="right">
  <Button variant="outline">
    Cancel
  </Button>
  <Button type="submit">
    Save
  </Button>
</FormActions>`}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Props ═════════════════════════════════════════════════════ */

function PropsBlock() {
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
            gridTemplateColumns: "180px 1.6fr 2fr",
            background: t.color.background.subtle,
            padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
            borderBottom: `1px solid ${t.color.border.subtle}`,
          }}
        >
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>
        {SUGAR_COMMON_PROPS.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1.6fr 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === SUGAR_COMMON_PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
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
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
          </div>
        ))}
      </div>
      <Callout tone="note" title="Everything else is passed through">
        All the underlying primitive's props are still available on the sugar wrapper (except the value/onChange/onBlur/name that RHF owns and the errorMessage/invalid that fieldState maps to). Type, autoComplete, leadingIcon, placeholder — pass them like you would on the standalone primitive.
      </Callout>
    </DocBlock>
  );
}

const SUGAR_COMMON_PROPS = [
  { name: "control",      type: "Control<TFieldValues>",        desc: "The RHF control object from `useForm().control`. Preserves generics so `name` autocompletes." },
  { name: "name",         type: "FieldPath<TFieldValues>",      desc: "Dot-notation path into the form schema. Type-checked against TFieldValues." },
  { name: "defaultValue", type: "PathValue<TFieldValues, TName>", desc: "Initial value passed to useController. Only applied on mount." },
];

/* ══════ Notes ═════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Notes">
      <RuleList
        rules={[
          {
            tone: "must",
            text: "Consumers must install `react-hook-form` themselves — it's declared as an OPTIONAL peer dep. Import it from your app, not from @hc1/design-system.",
          },
          {
            tone: "must",
            text: "Wrap fields in `<Form {...form}>` even if you never call `useFormContext` — some sugar wrappers rely on the FormProvider context for advanced RHF features like isSubmitting propagation.",
          },
          {
            tone: "should",
            text: "Set rules via `useForm({ resolver: zodResolver(schema) })` or the equivalent Yup / Valibot adapter — schema-driven validation reads cleaner than per-field rules and produces localizable messages.",
          },
          {
            tone: "should",
            text: "Prefer `mode: 'onBlur'` for most forms. `onChange` mode fires validation on every keystroke, which reads as nagging; `onBlur` fires after the user leaves the field, which reads as helpful.",
          },
          {
            tone: "note",
            text: "For controls the sugar doesn't cover (custom slider, third-party map picker), reach for the headless `<FormField>` render prop. It's the same primitive the sugar wrappers use under the hood.",
          },
        ]}
      />
    </DocBlock>
  );
}
