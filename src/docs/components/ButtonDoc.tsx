import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/button";
import type { ButtonVariant, ButtonSize } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

/* ══════ Canonical + legacy vocabulary ═════════════════════════════════
 * Sourced directly from src/components/button/Button.types.ts. Legacy
 * variants + sizes are intentionally still public for v0.11 back-compat
 * — we document them so consumers migrating from the old API can find
 * their old prop, but we mark them deprecated with a migration hint.
 * ─────────────────────────────────────────────────────────────────── */

const CANONICAL_VARIANTS: ButtonVariant[] = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
];

const LEGACY_VARIANTS: ButtonVariant[] = [
  "primary",
  "danger",
  "danger-outline",
  "success",
  "cta",
  "icon",
];

const TEXT_SIZES: ButtonSize[] = ["xs", "sm", "default", "lg"];
const ICON_SIZES: ButtonSize[] = ["icon-xs", "icon-sm", "icon", "icon-lg"];
const LEGACY_SIZES: ButtonSize[] = ["md", "xl"];

const VARIANT_HINT: Record<ButtonVariant, string> = {
  default:         "Brand teal fill · white ink · the main action on a screen",
  outline:         "White pill · subtle border · secondary action next to a primary",
  secondary:       "Muted-neutral fill · quiet supporting action",
  ghost:           "Transparent at rest · brand-tinted hover · low-emphasis actions",
  destructive:     "Subtle red wash + red ink · delete / remove / cancel-only",
  link:            "Underline-on-hover · reads as a link but sits in a button slot",
  /* legacy */
  primary:         "Deprecated alias — renders as default (brand fill)",
  danger:          "Deprecated alias — renders as destructive",
  "danger-outline":"Deprecated alias — renders as outline (red accents dropped in 0.12)",
  success:         "Deprecated alias — renders as outline (green accents dropped in 0.12)",
  cta:             "Deprecated alias — renders as default (amber CTA styling dropped)",
  icon:            "Deprecated — use variant='ghost' size='icon' instead",
};

const SIZE_HINT: Record<ButtonSize, string> = {
  xs:        "24px · h-6 · dense toolbars / chip actions",
  sm:        "32px · h-8 · table row actions / compact forms",
  default:   "36px · h-9 · the everyday button",
  lg:        "40px · h-10 · hero CTAs / mobile touch targets",
  "icon-xs": "24 × 24 · icon-only counterpart to xs",
  "icon-sm": "32 × 32 · icon-only counterpart to sm",
  icon:      "36 × 36 · icon-only counterpart to default",
  "icon-lg": "40 × 40 · icon-only counterpart to lg",
  /* legacy */
  md:        "Deprecated alias — renders as default (36px)",
  xl:        "Deprecated alias — renders as lg (40px)",
};

export function ButtonDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <VariantsBlock />
      <SizesBlock />
      <StatesBlock />
      <IconsBlock />
      <CompositionBlock />
      <A11yBlock />
      <DoDontBlock />
      <PlaygroundBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Button"
      lead="Button is the reference action primitive. Every screen expresses commitment, navigation, and cancellation through it. The 0.12 rebuild ships shadcn/SourceIQ-verbatim variants, sizes, and states so any consumer migrating from a local shadcn Button can drop this one in without renaming a single prop. Legacy HC1 v0.11 names remain accepted as deprecated aliases so existing products keep building while they migrate."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part below maps 1:1 to a prop, a state, or a slot on the component. Icons are children — leftIcon / rightIcon are legacy props kept for v0.11 back-compat."
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
        <Button variant="default" size="default">
          <Sparkles />
          IQ Assistant
          <ChevronDown />
        </Button>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="frame"        desc="Border + background + padding. Height comes from the size prop." />
        <Part name="leading icon" desc="First child. 16 × 16 by default; cascades from the size variant." />
        <Part name="label"        desc="Middle child. Text or any inline node — Button doesn't truncate." />
        <Part name="trailing icon" desc="Last child. Same cascade as leading. Use ChevronDown for menu triggers." />
        <Part name="focus ring"   desc="3-token brand ring on :focus-visible. Never suppressed." />
        <Part name="press feedback" desc="1px translate-y on :active, unless aria-haspopup is set." />
        <Part name="loading spinner" desc="Legacy prop — renders alongside the label. Prefer disabled + a Loader2 child." />
        <Part name="data-slot"    desc="Emits data-slot='button' + data-variant + data-size for test / ambient CSS hooks." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code style={{ fontWeight: 600, color: t.color.text.primary, fontFamily: t.font.mono, fontSize: 13 }}>
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Variants ═════════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Six canonical variants, all drawn from shadcn/SourceIQ vocabulary. Legacy HC1 v0.11 names still render, mapped to the closest canonical, so existing consumers don't break."
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
        {CANONICAL_VARIANTS.map(v => (
          <div
            key={v}
            style={{
              display: "grid",
              gridTemplateColumns: "140px minmax(180px, 240px) 1fr",
              gap: t.space.inline.lg,
              alignItems: "center",
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontWeight: 700, color: t.color.action.primary }}>
              {v}
            </code>
            <div>
              <Button variant={v}>
                {v === "link" ? "Read the changelog" : "Confirm"}
              </Button>
            </div>
            <span style={{ ...t.type.caption, color: t.color.text.secondary }}>
              {VARIANT_HINT[v]}
            </span>
          </div>
        ))}
      </div>

      <Callout tone="warning" title="Deprecated aliases">
        The six variants below still work — the DS routes them to the closest canonical name. New code should use the shadcn vocabulary above. `variant="icon"` in particular should become `variant="ghost" size="icon"`; that's the modern way to render an icon-only button.
      </Callout>

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
        {LEGACY_VARIANTS.map(v => (
          <div
            key={v}
            style={{
              display: "grid",
              gridTemplateColumns: "140px minmax(180px, 240px) 1fr",
              gap: t.space.inline.lg,
              alignItems: "center",
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontWeight: 700, color: t.color.text.tertiary }}>
              {v}
            </code>
            <div>
              {v === "icon" ? (
                <Button variant={v}><Search /></Button>
              ) : (
                <Button variant={v}>{v === "cta" ? "Publish" : "Confirm"}</Button>
              )}
            </div>
            <span style={{ ...t.type.caption, color: t.color.text.secondary }}>
              {VARIANT_HINT[v]}
            </span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Sizes ══════════════════════════════════════════════════════ */

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Four text sizes and four icon-only sizes. Heights match Input exactly so a size='sm' Button + size='sm' Input on the same row align pixel-for-pixel."
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
        <SectionHeading>Text sizes</SectionHeading>
        {TEXT_SIZES.map(s => (
          <SizeRow key={s} size={s}>
            <Button size={s}>Confirm</Button>
          </SizeRow>
        ))}
      </div>

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
        <SectionHeading>Icon sizes</SectionHeading>
        {ICON_SIZES.map(s => (
          <SizeRow key={s} size={s}>
            <Button size={s} variant="outline" aria-label="Search"><Search /></Button>
          </SizeRow>
        ))}
      </div>

      <Callout tone="warning" title="Deprecated size aliases">
        `size="md"` renders as `default` and `size="xl"` renders as `lg`. Both are kept only for v0.11 consumers — new code should use the canonical names.
      </Callout>

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
        {LEGACY_SIZES.map(s => (
          <SizeRow key={s} size={s} legacy>
            <Button size={s}>Confirm</Button>
          </SizeRow>
        ))}
      </div>
    </DocBlock>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...t.type.caption,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontWeight: 700,
        color: t.color.text.tertiary,
        marginBottom: t.space.stack.xs,
      }}
    >
      {children}
    </div>
  );
}

function SizeRow({ size, legacy, children }: { size: ButtonSize; legacy?: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "96px minmax(120px, 200px) 1fr",
        gap: t.space.inline.lg,
        alignItems: "center",
      }}
    >
      <code style={{ fontFamily: t.font.mono, fontWeight: 700, color: legacy ? t.color.text.tertiary : t.color.action.primary }}>
        {size}
      </code>
      <div>{children}</div>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>
        {SIZE_HINT[size]}
      </span>
    </div>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="States" lead="Every interactive state exists and the focus ring is never suppressed. Loading and disabled are visually distinct so users don't confuse 'busy' with 'off'.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile
          name="Default"
          note="Rest state. Brand fill on the default variant."
          content={<Button>Confirm</Button>}
        />
        <StateTile
          name="Hover"
          note="Hover the frame — background steps one shade darker."
          content={<Button>Confirm</Button>}
        />
        <StateTile
          name="Focus"
          note="Tab in to reveal the 3-token brand ring."
          content={<Button>Confirm</Button>}
        />
        <StateTile
          name="Active"
          note="Press feedback: 1px translate-y unless aria-haspopup is set."
          content={<Button>Confirm</Button>}
        />
        <StateTile
          name="Disabled"
          note="Muted opacity, not focusable, no press feedback."
          content={<Button disabled>Confirm</Button>}
        />
        <StateTile
          name="Loading"
          note="aria-busy=true. Button stays focusable; clicks are intercepted."
          content={<Button loading>Confirm</Button>}
        />
        <StateTile
          name="aria-invalid"
          note="Form-error styling: destructive border + ring. Set on the button, not the DS."
          content={<Button aria-invalid>Save</Button>}
        />
        <StateTile
          name="fullWidth"
          note="Legacy prop — same result as className='w-full'."
          content={<Button fullWidth>Continue</Button>}
        />
      </div>
    </DocBlock>
  );
}

function StateTile({ name, note, content }: { name: string; note: string; content: ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        padding: t.space.inline.lg,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
      }}
    >
      <div
        style={{
          ...t.type.caption,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: t.color.text.tertiary,
        }}
      >
        {name}
      </div>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60 }}>
        {content}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

/* ══════ Icons ═══════════════════════════════════════════════════════ */

function IconsBlock() {
  return (
    <DocBlock
      title="With icons"
      lead="Icons are children. Place them before the label for a leading icon, after for a trailing icon, or on their own for an icon-only button. The frame auto-adjusts padding via has-data-[icon=inline-start] / has-data-[icon=inline-end] selectors so you don't set padding manually."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FeatureTile
          title="Leading icon"
          code={`<Button><Plus />Add patient</Button>`}
          content={<Button><Plus />Add patient</Button>}
        />
        <FeatureTile
          title="Trailing icon"
          code={`<Button>Next<ArrowRight /></Button>`}
          content={<Button>Next<ArrowRight /></Button>}
        />
        <FeatureTile
          title="Icon-only (default)"
          code={`<Button size="icon" variant="ghost" aria-label="Copy"><Copy /></Button>`}
          content={<Button size="icon" variant="ghost" aria-label="Copy"><Copy /></Button>}
        />
        <FeatureTile
          title="Destructive icon"
          code={`<Button size="icon" variant="ghost" aria-label="Delete"><Trash2 /></Button>`}
          content={<Button size="icon" variant="ghost" aria-label="Delete"><Trash2 /></Button>}
        />
        <FeatureTile
          title="Menu trigger"
          code={`<Button variant="outline">Actions<ChevronDown /></Button>`}
          content={<Button variant="outline">Actions<ChevronDown /></Button>}
        />
        <FeatureTile
          title="Download CTA"
          code={`<Button variant="default"><Download />Export CSV</Button>`}
          content={<Button variant="default"><Download />Export CSV</Button>}
        />
        <FeatureTile
          title="Success state"
          code={`<Button variant="outline"><Check />Saved</Button>`}
          content={<Button variant="outline"><Check />Saved</Button>}
        />
        <FeatureTile
          title="Loading legacy prop"
          code={`<Button loading>Publishing…</Button>`}
          content={<Button loading>Publishing…</Button>}
        />
      </div>

      <Callout tone="note" title="Icon sizing cascade">
        Any child {"<svg>"} without an explicit <code>size-*</code> class inherits from the parent size — 12px on <code>size=&quot;xs&quot;</code>, 16px on the rest. If you want a bigger icon inside a small button, pass <code>className=&quot;size-4&quot;</code> on the icon.
      </Callout>
    </DocBlock>
  );
}

function FeatureTile({ title, code, content }: { title: string; code: string; content: ReactNode }) {
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
      <div style={{ minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {content}
      </div>
      <div>
        <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
          {title}
        </div>
        <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono, wordBreak: "break-word" }}>
          {code}
        </code>
      </div>
    </div>
  );
}

/* ══════ Composition (asChild) ═══════════════════════════════════════ */

function CompositionBlock() {
  return (
    <DocBlock
      title="Composition · asChild"
      lead="When you need a link that looks like a button, pass asChild and put a single child anchor / Link inside. Button hands its className, ref, and data-attrs to the child via Radix Slot — no HTML nesting anti-pattern, no styling drift."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FeatureTile
          title="With anchor"
          code={`<Button asChild>\n  <a href="/patients">Open worklist</a>\n</Button>`}
          content={
            <Button asChild>
              <a href="#worklist" onClick={e => e.preventDefault()}>Open worklist</a>
            </Button>
          }
        />
        <FeatureTile
          title="With router Link"
          code={`<Button asChild variant="outline">\n  <Link to="/settings">Settings</Link>\n</Button>`}
          content={
            <Button asChild variant="outline">
              <a href="#settings" onClick={e => e.preventDefault()}>Settings</a>
            </Button>
          }
        />
        <FeatureTile
          title="Ghost icon link"
          code={`<Button asChild variant="ghost" size="icon" aria-label="Docs">\n  <a href="/docs"><ArrowRight /></a>\n</Button>`}
          content={
            <Button asChild variant="ghost" size="icon" aria-label="Docs">
              <a href="#docs" onClick={e => e.preventDefault()}><ArrowRight /></a>
            </Button>
          }
        />
      </div>

      <Callout tone="info" title="Composition rules">
        (1) The child must be a single React element — Slot cannot merge multiple. (2) The child element decides its own semantics; asChild is CSS + refs, not accessibility. Put <code>aria-label</code> on the anchor if the child is icon-only. (3) Don&apos;t set <code>type=&quot;button&quot;</code> on the wrapping {"<Button>"} when asChild is on — the DS already skips emitting it in that path.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Accessibility ══════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "Icon-only buttons must carry aria-label. Without it, screen readers announce nothing — the SVG is decorative from AT's point of view." },
          { tone: "must", text: "The focus ring uses :focus-visible so keyboard users see it but mouse users don't. Never override this — remove focus:outline-none anywhere in the app that shadows a Button." },
          { tone: "must", text: "loading=true sets aria-busy=true on the frame. The button stays focusable so users don't lose focus mid-flow; the DS suppresses click activation." },
          { tone: "must", text: "disabled removes the button from the tab order and disables pointer events. Prefer disabled over hiding — visible-but-disabled communicates the affordance exists." },
          { tone: "must", text: "aria-invalid=true renders the destructive ring + border. Use it when a form validation fails to draw the user's eye to the submit button." },
          { tone: "must", text: "Press feedback is suppressed on aria-haspopup=true buttons (menu triggers, popover triggers) so the label doesn't jump when the popover opens." },
          { tone: "should", text: "Native type attribute defaults to 'button' when not composed via asChild — so a Button inside a <form> doesn't submit accidentally. Pass type='submit' explicitly on the submit action." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Do / Don't ═══════════════════════════════════════════════════ */

function DoDontBlock() {
  return (
    <DocBlock title="Do & Don't">
      <DoDontGrid
        dos={[
          { title: "One primary per view",              description: "A screen should have exactly one variant='default' button — the answer to 'what am I here to do?'. Everything else is outline / ghost / link." },
          { title: "Icon child + aria-label for icon-only", description: "size='icon' variants render just the SVG. Screen readers need the label — put it on the button or the anchor if asChild." },
          { title: "asChild for links that look like buttons", description: "Never wrap an <a> in a <button>. Use asChild and put the anchor as the single child." },
          { title: "size='sm' next to size='sm' Input",       description: "Heights are authored to match — controls on the same row align. Same for xs/sm/default/lg." },
          { title: "Use destructive for destructive verbs", description: "Delete, Remove, Discard. Not for 'Cancel' — Cancel is outline or ghost." },
        ]}
        donts={[
          { title: "className='bg-red-500' to invent a color", description: "Variants encode intent. If none of the six fit, the missing intent is the bug — talk to design before adding a class override." },
          { title: "loading + disabled for the same button",  description: "loading already suppresses clicks and sets aria-busy. Adding disabled removes focus + affordance." },
          { title: "Icon in a size='xs' button without size class", description: "The default 12px cascade may under-hit the 24px height. If you want visual weight, pass className='size-3.5' on the icon." },
          { title: "Nest an <a> inside a <button>",           description: "Invalid HTML + double keyboard focus. asChild is the whole point of the Slot pattern." },
          { title: "variant='primary' in new code",           description: "Use variant='default'. Legacy alias works today but the codemod is coming — don't spread it." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ═══════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]         = useState<ButtonVariant>("default");
  const [size, setSize]               = useState<ButtonSize>("default");
  const [label, setLabel]             = useState("Confirm");
  const [disabled, setDisabled]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [fullWidth, setFullWidth]     = useState(false);
  const [asChild, setAsChild]         = useState(false);
  const [hasLeading, setHasLeading]   = useState(false);
  const [hasTrailing, setHasTrailing] = useState(false);

  const isIconSize = size === "icon" || size === "icon-xs" || size === "icon-sm" || size === "icon-lg";
  const effectiveLabel = isIconSize ? "" : label;

  const content: ReactNode = (
    <>
      {hasLeading && <Plus />}
      {effectiveLabel || (isIconSize ? <Search /> : null)}
      {hasTrailing && !isIconSize && <ArrowRight />}
    </>
  );

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered button in real time.">
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {/* Preview */}
        <div
          style={{
            padding: t.space.section.sm,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            minHeight: 160,
          }}
        >
          <div style={{ width: fullWidth ? "min(480px, 100%)" : undefined }}>
            {asChild ? (
              <Button
                variant={variant}
                size={size}
                disabled={disabled}
                loading={loading}
                fullWidth={fullWidth}
                asChild
                aria-label={isIconSize ? "Search" : undefined}
              >
                <a href="#playground" onClick={e => e.preventDefault()}>
                  {content}
                </a>
              </Button>
            ) : (
              <Button
                variant={variant}
                size={size}
                disabled={disabled}
                loading={loading}
                fullWidth={fullWidth}
                aria-label={isIconSize ? "Search" : undefined}
              >
                {content}
              </Button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="variant" value={variant} options={[...CANONICAL_VARIANTS, ...LEGACY_VARIANTS]} onChange={v => setVariant(v as ButtonVariant)} />
          <SelectControl label="size" value={size} options={[...TEXT_SIZES, ...ICON_SIZES, ...LEGACY_SIZES]} onChange={v => setSize(v as ButtonSize)} />
          <TextControl label="children" value={label} onChange={setLabel} disabled={isIconSize} />

          <ToggleControl label="disabled"     value={disabled}    onChange={setDisabled} />
          <ToggleControl label="loading"      value={loading}     onChange={setLoading} />
          <ToggleControl label="fullWidth"    value={fullWidth}   onChange={setFullWidth} />
          <ToggleControl label="asChild"      value={asChild}     onChange={setAsChild} />
          <ToggleControl label="leadingIcon"  value={hasLeading}  onChange={setHasLeading} disabled={isIconSize} />
          <ToggleControl label="trailingIcon" value={hasTrailing} onChange={setHasTrailing} disabled={isIconSize} />
        </div>

        {/* Generated code */}
        <div
          style={{
            padding: t.space.inline.xl,
            borderTop: `1px solid ${t.color.border.subtle}`,
            background: t.color.background.inverse,
          }}
        >
          <div
            style={{
              ...t.type.caption,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              marginBottom: t.space.stack.sm,
            }}
          >
            Rendered code
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: t.font.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: t.color.text.inverse,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
{renderCode({
  variant, size, label: effectiveLabel, disabled, loading,
  fullWidth, asChild, hasLeading, hasTrailing, isIconSize,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: ButtonVariant;
  size: ButtonSize;
  label: string;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  asChild: boolean;
  hasLeading: boolean;
  hasTrailing: boolean;
  isIconSize: boolean;
}) {
  const attrs: string[] = [];
  if (s.variant !== "default") attrs.push(`variant="${s.variant}"`);
  if (s.size !== "default")    attrs.push(`size="${s.size}"`);
  if (s.disabled)              attrs.push("disabled");
  if (s.loading)               attrs.push("loading");
  if (s.fullWidth)             attrs.push("fullWidth");
  if (s.asChild)               attrs.push("asChild");
  if (s.isIconSize)            attrs.push(`aria-label="Search"`);

  const children: string[] = [];
  if (s.hasLeading && !s.isIconSize)  children.push("<Plus />");
  if (s.isIconSize)                    children.push("<Search />");
  else if (s.label)                    children.push(escapeAttr(s.label));
  if (s.hasTrailing && !s.isIconSize) children.push("<ArrowRight />");

  const inner = children.join("");
  const multiline = attrs.length > 3;
  const attrStr = attrs.length ? (multiline ? "\n  " + attrs.join("\n  ") + "\n" : " " + attrs.join(" ")) : "";

  if (s.asChild) {
    return `<Button${attrStr}>\n  <a href="/somewhere">${inner || "Label"}</a>\n</Button>`;
  }
  return `<Button${attrStr}>${inner || "Label"}</Button>`;
}

function escapeAttr(v: string) {
  return v.replace(/"/g, "\\\"");
}

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
        onChange={e => onChange(e.target.value)}
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
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TextControl({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
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
      />
    </label>
  );
}

function ToggleControl({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
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
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
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
  { name: "variant",     type: "'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' + 6 legacy aliases", def: "'default'", desc: "Visual variant. Legacy names ('primary', 'danger', 'danger-outline', 'success', 'cta', 'icon') route to the closest canonical." },
  { name: "size",        type: "'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' + 'md' | 'xl'", def: "'default'", desc: "Height ladder. Text sizes carry a label; icon-* sizes render a square icon-only button. 'md' → default, 'xl' → lg." },
  { name: "asChild",     type: "boolean", def: "false", desc: "Render as a Radix Slot instead of <button>. The single child element receives the button classes + ref — use for <a> / router <Link>." },
  { name: "loading",     type: "boolean", def: "false", desc: "Legacy — sets aria-busy=true and applies a cursor-progress + opacity treatment. Prefer disabled + a <Loader2 /> child in new code." },
  { name: "fullWidth",   type: "boolean", def: "false", desc: "Legacy — same as className='w-full'. Kept because v0.11 consumers depend on it." },
  { name: "leftIcon",    type: "ReactNode", def: "—", desc: "Legacy slot for the leading icon. Prefer placing the icon as the first child instead." },
  { name: "rightIcon",   type: "ReactNode", def: "—", desc: "Legacy slot for the trailing icon. Prefer placing the icon as the last child instead." },
  { name: "iconOnly",    type: "boolean", def: "false", desc: "Legacy — forces the square size variant. Prefer size='icon' (or icon-xs / icon-sm / icon-lg) in new code." },
  { name: "type",        type: "'button' | 'submit' | 'reset'", def: "'button' (when not asChild)", desc: "Native button type. Defaults to 'button' when not composed via asChild so a Button inside a <form> won't submit accidentally." },
  { name: "disabled",    type: "boolean", def: "false", desc: "Native disabled attribute. Muted opacity, not focusable, no pointer events, no press feedback." },
  { name: "aria-invalid", type: "boolean", def: "false", desc: "Renders the destructive border + ring. Use to draw attention to a Submit button after a form validation failure." },
  { name: "aria-label",  type: "string", def: "—", desc: "Required when the button has no visible label (icon-only). Read by screen readers." },
  { name: "className",   type: "string", def: "—", desc: "Merged after DS classes via tailwind-merge. Use for one-off spacing, not colors — colors belong in variants." },
  { name: "onClick",     type: "(e: MouseEvent) => void", def: "—", desc: "Native click handler. Suppressed while loading=true and while disabled=true." },
  { name: "children",    type: "ReactNode", def: "—", desc: "Label + optional icons. Multiple children are laid out with automatic gap and icon-side padding via data-slot descendant selectors." },
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
        <div style={{ display: "grid", gridTemplateColumns: "160px 1.4fr 140px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "160px 1.4fr 140px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>
              {row.name}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>
              {row.type}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
              {row.def}
            </code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
              {row.desc}
            </span>
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

/* ══════ Tokens used ═══════════════════════════════════════════════ */

function TokensUsedBlock() {
  const tokens: { role: string; alias: string }[] = [
    { role: "Primary fill",       alias: "--hc-color-action-primary (brand-500) · hover: -hover (brand-600) · active: -active (brand-700)" },
    { role: "Primary ink",        alias: "--hc-color-text-on-solid (white) · hex fallback #fff for consumers without token CSS" },
    { role: "Outline surface",    alias: "--hc-color-bg-surface / border-default · hover: --hc-color-brand-50 / brand-100" },
    { role: "Secondary surface",  alias: "--hc-color-bg-subtle / border-subtle · hover: --hc-color-brand-50 / brand-100" },
    { role: "Ghost hover",        alias: "--hc-color-brand-50 · active: --hc-color-brand-100" },
    { role: "Destructive",        alias: "--hc-color-severity-critical-bg / -border / -text (subtle red wash + red ink)" },
    { role: "Link",               alias: "--hc-color-text-link · hover: --hc-color-text-link-hover" },
    { role: "Focus ring",         alias: "--hc-color-border-focus (brand-500) at 3-ring width, 50% opacity outer" },
    { role: "aria-invalid",       alias: "border-destructive + destructive/20 3-ring" },
    { role: "Radius",             alias: "radius-md (default / lg) · min(radius-md, 8px) for xs / sm" },
    { role: "Motion",             alias: "transition-all standard easing · press feedback = translate-y-px on :active" },
    { role: "Typography",         alias: "font-medium · text-sm (xs uses text-xs)" },
    { role: "Spacing",            alias: "gap-1 / gap-1.5 · px-2 / px-2.5 · icon-side padding via has-data-[icon=*] selectors" },
  ];

  return (
    <DocBlock title="Tokens used">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {tokens.map((row, i) => (
          <div
            key={row.role}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === tokens.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <span style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
              {row.role}
            </span>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>
              {row.alias}
            </code>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Implementation notes ══════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Implementation notes">
      <RuleList
        rules={[
          { tone: "note", text: "Button uses cva + Tailwind v4 arbitrary color classes (bg-[color:var(--hc-color-action-primary)]) rather than shadcn's semantic tokens (bg-primary). Reading from the HC1 alias layer directly means a consumer's :root override of --primary can't drift the DS button — the 0.12 rebuild fixed the SourceIQ '--secondary hijacked to teal' bug." },
          { tone: "note", text: "The default variant's arbitrary color classes carry hex fallbacks (bg-[color:var(--hc-color-action-primary,#0D7782)] text-[color:var(--hc-color-text-on-solid,#fff)]) so consumers who forget to import @hc1/design-system/styles still render brand teal + white ink at WCAG-AA contrast (~5.25:1)." },
          { tone: "note", text: "asChild uses Radix Slot to merge the button's className + ref into a single child element. Multiple children are not supported — if you need to wrap two elements, wrap them in one fragment element (Slot cannot walk a fragment)." },
          { tone: "note", text: "Legacy variant / size aliases route via a small map at the top of Button.tsx (LEGACY_VARIANT_MAP / LEGACY_SIZE_MAP). They add zero runtime cost — the resolver runs once per render." },
          { tone: "note", text: "The frame emits data-slot='button', data-variant, and data-size. Tests can assert on these; product CSS can use them for one-off ambient overrides without competing with the DS." },
        ]}
      />

      <Callout tone="info" title="Migration from v0.11">
        Rename `variant="primary"` → `variant="default"`, `variant="danger"` → `variant="destructive"`, `size="md"` → `size="default"`, `size="xl"` → `size="lg"`. Replace `iconOnly` + `size="md"` with `size="icon"`. Replace `leftIcon` / `rightIcon` props with icon children in the button. The legacy props keep working today — a codemod for the full migration is on the 0.13 milestone.
      </Callout>
    </DocBlock>
  );
}
