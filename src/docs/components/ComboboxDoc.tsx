import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Building2, MapPin, Users } from "lucide-react";
import { Combobox } from "../../components/combobox";
import type {
  ComboboxOption,
  ComboboxSize,
} from "../../components/combobox";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

const SIZES: ComboboxSize[] = ["xs", "sm", "md", "lg", "xl"];

const SIZE_HINT: Record<ComboboxSize, string> = {
  xs: "20px · dense inline filters",
  sm: "32px · table toolbar",
  md: "32px · default · form fields",
  lg: "48px · dashboard filters",
  xl: "64px · hero search",
};

const CLINICIANS: ComboboxOption[] = [
  { label: "Dr. Jane Cooper", value: "jane-cooper", description: "Cardiology · Senior consultant" },
  { label: "Dr. Marcus Riley", value: "marcus-riley", description: "Oncology · Attending" },
  { label: "Dr. Priya Patel", value: "priya-patel", description: "Radiology · Fellow" },
  { label: "Dr. Adam Quinn", value: "adam-quinn", description: "Emergency · Resident" },
  { label: "Dr. Sam Reeves", value: "sam-reeves", description: "Cardiology · Attending" },
  { label: "Dr. Nia Okoro", value: "nia-okoro", description: "Radiology · Senior consultant" },
  { label: "Dr. Kai Chen", value: "kai-chen", description: "Oncology · Fellow", disabled: true },
];

const HOSPITALS: ComboboxOption[] = [
  { label: "Boston Medical Center", value: "bmc", icon: <Building2 /> },
  { label: "Massachusetts General", value: "mgh", icon: <Building2 /> },
  { label: "Cambridge Health Alliance", value: "cha", icon: <Building2 /> },
  { label: "Beth Israel Deaconess", value: "bidmc", icon: <Building2 /> },
];

const CITIES: ComboboxOption[] = Array.from({ length: 30 }).map((_, i) => ({
  label: `City ${i + 1}`,
  value: `city-${i + 1}`,
  description: `${1_000_000 - i * 27_000} population`,
}));

export function ComboboxDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <SizesBlock />
      <FeaturesBlock />
      <ValidationBlock />
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
      eyebrow="Purpose"
      title="The canonical HC1 Combobox"
      lead="Combobox is Select with search. Reach for it when the option list gets long enough that scrolling breaks (roughly 8+ items) or when the consumer wants type-to-filter on a form field. The API mirrors Select — same size ladder, same label / helper / error slots, same option shape — so migrating an over-full Select is a one-line prop change."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [value, setValue] = useState<string | undefined>("marcus-riley");
  return (
    <DocBlock
      title="Anatomy"
      lead="Trigger button + portalled popup. The popup has a search input header, a scrolling option list, and an empty-state row. Selected option's label shows in the trigger; keyboard opens the popup and focuses search."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "min(360px, 100%)" }}>
          <Combobox
            options={CLINICIANS}
            value={value}
            onChange={setValue}
            label="Assign clinician"
            placeholder="Search clinicians…"
            searchPlaceholder="Type to filter…"
            leadingIcon={<Users />}
            helperText="Search matches on name + specialty."
          />
        </div>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="label"          desc="Above the trigger. `aria-labelledby` wires the trigger to it." />
        <Part name="trigger"        desc="Button showing the selected label or the placeholder. Opens the popup on click / Enter / Space / ArrowDown." />
        <Part name="leadingIcon"    desc="Inside the trigger before the value. Purely decorative." />
        <Part name="search input"   desc="Auto-focused when the popup opens. Keystrokes filter the list; ArrowUp/Down navigate." />
        <Part name="option list"    desc="Filtered rows. Each row: icon (optional) + label + description (optional). Selected row shows a Check on the right." />
        <Part name="empty state"    desc="Rendered when no options match. Consumer provides the copy via `emptyMessage`." />
        <Part name="helper / error" desc="Same slot as Input — helper is suppressed while error/warning/success message is present." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code
        style={{
          fontWeight: 600,
          color: t.color.text.primary,
          fontFamily: t.font.mono,
          fontSize: 13,
        }}
      >
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Sizes ══════════════════════════════════════════════════════ */

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Five sizes matching Input / Select / Button. Same ladder means a Combobox filter row can sit flush with a Button or two."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          flexDirection: "column",
          gap: t.space.stack.md,
        }}
      >
        {SIZES.map((s) => (
          <div
            key={s}
            style={{
              display: "grid",
              gridTemplateColumns: "40px minmax(220px, 1fr) minmax(180px, 240px)",
              gap: t.space.inline.lg,
              alignItems: "center",
            }}
          >
            <code
              style={{
                fontFamily: t.font.mono,
                fontWeight: 700,
                color: t.color.action.primary,
              }}
            >
              {s}
            </code>
            <Combobox
              size={s}
              options={HOSPITALS}
              placeholder="Select hospital…"
              searchPlaceholder="Filter…"
              leadingIcon={<MapPin />}
            />
            <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{SIZE_HINT[s]}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Features ═══════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Descriptions, icons, and disabled options make the picker read as a real product menu, not just a bare list of strings."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FeatureTile
          title="With descriptions"
          hint="Second line under the label. Secondary text — search matches both."
          demo={
            <Combobox
              options={CLINICIANS}
              defaultValue="jane-cooper"
              placeholder="Select clinician…"
            />
          }
        />
        <FeatureTile
          title="With per-option icons"
          hint="Set `icon` on the option for a leading glyph in the row."
          demo={
            <Combobox
              options={HOSPITALS}
              defaultValue="mgh"
              placeholder="Select hospital…"
            />
          }
        />
        <FeatureTile
          title="Disabled option"
          hint="`disabled: true` on an option — visible, unselectable, skipped by keyboard."
          demo={
            <Combobox
              options={CLINICIANS}
              placeholder="Search clinicians…"
              searchPlaceholder="Type kai to see disabled row…"
            />
          }
        />
        <FeatureTile
          title="Scrolling list"
          hint="Long option lists scroll inside the popup. Max height is 280px."
          demo={
            <Combobox
              options={CITIES}
              placeholder="Select city…"
              searchPlaceholder="Filter cities…"
            />
          }
        />
      </div>
    </DocBlock>
  );
}

function FeatureTile({
  title,
  hint,
  demo,
}: {
  title: string;
  hint: string;
  demo: ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        padding: t.space.inline.lg,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.md,
      }}
    >
      <div>{demo}</div>
      <div>
        <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{title}</div>
        <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{hint}</div>
      </div>
    </div>
  );
}

/* ══════ Validation ═════════════════════════════════════════════════ */

function ValidationBlock() {
  return (
    <DocBlock
      title="Validation"
      lead="Same validation model as Input. errorMessage / warningMessage / successMessage take over the helper slot and auto-imply the visual state."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <div>
          <Combobox
            options={HOSPITALS}
            placeholder="Select hospital…"
            label="Home hospital"
            required
            errorMessage="Select a hospital to continue."
          />
        </div>
        <div>
          <Combobox
            options={HOSPITALS}
            defaultValue="cha"
            label="Home hospital"
            warningMessage="This hospital is outside your primary region."
          />
        </div>
        <div>
          <Combobox
            options={HOSPITALS}
            defaultValue="mgh"
            label="Home hospital"
            successMessage="Credentials verified for this facility."
          />
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Async ═════════════════════════════════════════════════════ */

function AsyncBlock() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<ComboboxOption[]>(CLINICIANS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setOptions(CLINICIANS);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      const q = query.toLowerCase();
      setOptions(
        CLINICIANS.filter(
          (o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q),
        ),
      );
      setLoading(false);
    }, 400);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <DocBlock
      title="Async search"
      lead="Pass `onSearch` to defer filtering to an API. The DS skips its built-in client filter and renders whatever options you feed back on the next render. `loading` shows a spinner in the search header."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          gap: t.space.inline.xl,
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "min(360px, 100%)" }}>
          <Combobox
            options={options}
            onSearch={setQuery}
            loading={loading}
            label="Assign clinician"
            placeholder="Search clinicians…"
            searchPlaceholder="Type to search the API…"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.stack.xs,
            fontSize: 12,
            fontFamily: t.font.mono,
            color: t.color.text.secondary,
          }}
        >
          <div>query: "{query}"</div>
          <div>matches: {options.length}</div>
          <div>loading: {String(loading)}</div>
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [size, setSize] = useState<ComboboxSize>("md");
  const [state, setState] = useState<"none" | "error" | "warning" | "success">("none");
  const [required, setRequired] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [hasLeading, setHasLeading] = useState(true);

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered combobox in real time.">
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
            minHeight: 180,
          }}
        >
          <div style={{ width: "min(420px, 100%)" }}>
            <Combobox
              size={size}
              options={CLINICIANS}
              label="Assign clinician"
              placeholder="Search clinicians…"
              searchPlaceholder="Type to filter…"
              leadingIcon={hasLeading ? <Users /> : undefined}
              required={required}
              disabled={disabled}
              errorMessage={state === "error" ? "Select a clinician to continue." : undefined}
              warningMessage={state === "warning" ? "Their calendar is busy today." : undefined}
              successMessage={state === "success" ? "Assignment confirmed." : undefined}
              helperText="Search matches on name + specialty."
            />
          </div>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="size" value={size} options={SIZES} onChange={(v) => setSize(v as ComboboxSize)} />
          <SelectControl
            label="state"
            value={state}
            options={["none", "error", "warning", "success"]}
            onChange={(v) => setState(v as typeof state)}
          />
          <ToggleControl label="required" value={required} onChange={setRequired} />
          <ToggleControl label="disabled" value={disabled} onChange={setDisabled} />
          <ToggleControl label="leadingIcon" value={hasLeading} onChange={setHasLeading} />
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
  { name: "options",           type: "ComboboxOption[]",                                    def: "—",       desc: "The option set. `{ label, value, description?, icon?, disabled?, group? }`." },
  { name: "value",             type: "string",                                              def: "—",       desc: "Controlled selected value." },
  { name: "defaultValue",      type: "string",                                              def: "—",       desc: "Uncontrolled initial selected value." },
  { name: "onChange",          type: "(value: string, option: ComboboxOption) => void",     def: "—",       desc: "Fires when selection changes. Second arg is the full option object." },
  { name: "onSearch",          type: "(query: string) => void",                             def: "—",       desc: "Server-side search — when provided, the DS skips built-in filtering and renders whatever `options` come back." },
  { name: "filter",            type: "(option, query) => boolean",                          def: "label+desc substring", desc: "Override the built-in filter. Ignored when `onSearch` is set." },
  { name: "placeholder",       type: "string",                                              def: "'Select…'", desc: "Trigger placeholder when nothing is selected." },
  { name: "searchPlaceholder", type: "string",                                              def: "'Search…'", desc: "Placeholder inside the search input at the top of the popup." },
  { name: "emptyMessage",      type: "ReactNode",                                           def: "'No results'", desc: "Row shown when no option matches the query." },
  { name: "size",              type: "'xs'|'sm'|'md'|'lg'|'xl'",                            def: "'md'",     desc: "Trigger size — matches Input / Button / Select." },
  { name: "label",             type: "ReactNode",                                           def: "—",       desc: "Visible label; linked to the trigger via aria-labelledby." },
  { name: "required",          type: "boolean",                                             def: "false",   desc: "Renders a required marker on the label." },
  { name: "optional",          type: "boolean",                                             def: "false",   desc: "Renders an '(Optional)' marker. Ignored when required." },
  { name: "helperText",        type: "ReactNode",                                           def: "—",       desc: "Guidance under the trigger. Suppressed while a validation message is present." },
  { name: "errorMessage",      type: "ReactNode",                                           def: "—",       desc: "Sets state='error' + aria-invalid + role='alert' on the message." },
  { name: "warningMessage",    type: "ReactNode",                                           def: "—",       desc: "Sets state='warning'. Overrides success." },
  { name: "successMessage",    type: "ReactNode",                                           def: "—",       desc: "Sets state='success'. For confirmation messages that need to stick." },
  { name: "validation",        type: "'error'|'warning'|'success'",                         def: "—",       desc: "Explicit state without a message. Any message prop overrides this." },
  { name: "leadingIcon",       type: "ReactNode",                                           def: "—",       desc: "Icon inside the trigger before the value." },
  { name: "loading",           type: "boolean",                                             def: "false",   desc: "Spinner in the search header — for async lookups." },
  { name: "disabled",          type: "boolean",                                             def: "false",   desc: "Trigger doesn't open and shows the muted surface." },
  { name: "fullWidth",         type: "boolean",                                             def: "true",    desc: "Grow the trigger to fill its parent." },
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
              borderBottom:
                i === PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
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
            text: "Use Combobox instead of Select once the list crosses ~8 options. Scrolling a Select breaks the visible-at-a-glance contract Select promises.",
          },
          {
            tone: "must",
            text: "Every option needs a stable `value`. Combobox uses value equality to detect selection; if two options have the same value the second one wins in the render.",
          },
          {
            tone: "should",
            text: "For server-side search, debounce your API call inside the `onSearch` handler — the DS fires on every keystroke.",
          },
          {
            tone: "should",
            text: "Provide `description` when the label alone is ambiguous (three Dr. Coopers on the same team). The DS filters on label + description, so the description becomes a searchable disambiguator.",
          },
          {
            tone: "note",
            text: "Keyboard: type-to-search in the popup input, ArrowUp/Down navigates (disabled options skipped), Home/End jump to first/last, Enter selects the highlighted row, Escape closes and refocuses the trigger. aria-activedescendant tracks the highlighted row for screen readers.",
          },
        ]}
      />

      <Callout tone="info" title="Combobox vs. Select vs. DropdownMenu">
        Select — up to ~8 static options, no search needed, single-value picker. Combobox — long or dynamic option list, search needed. DropdownMenu — a list of ACTIONS (not values); the user is not picking a value, they're triggering something.
      </Callout>
    </DocBlock>
  );
}
