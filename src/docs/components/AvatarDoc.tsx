import { useState } from "react";
import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { Avatar, AvatarGroup } from "../../components/avatar";
import type {
  AvatarShape,
  AvatarSize,
  AvatarStatus,
} from "../../components/avatar";
import {
  DocPage,
  DocBlock,
  RuleList,
  Callout,
  t,
} from "../standards/_shared";

const SIZES: AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];
const STATUSES: AvatarStatus[] = ["online", "away", "busy", "offline"];

const SIZE_HINT: Record<AvatarSize, string> = {
  xs: "20px · dense inline chips",
  sm: "24px · list rows / breadcrumbs",
  md: "32px · default · app-bar identity",
  lg: "40px · profile cards / worklist rows",
  xl: "56px · settings identity / hero moments",
};

const STATUS_HINT: Record<AvatarStatus, string> = {
  online: "brand teal · reachable now",
  away: "amber · idle / stepped away",
  busy: "red · do-not-disturb",
  offline: "neutral · signed out",
};

const SAMPLE_IMG = "https://i.pravatar.cc/128?u=hc1-jane-cooper";
const SAMPLE_IMG_2 = "https://i.pravatar.cc/128?u=hc1-marcus-riley";
const SAMPLE_IMG_3 = "https://i.pravatar.cc/128?u=hc1-priya-patel";
const SAMPLE_IMG_4 = "https://i.pravatar.cc/128?u=hc1-adam-quinn";

export function AvatarDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <SizesBlock />
      <FallbackBlock />
      <StatusBlock />
      <GroupBlock />
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
      title="The canonical HC1 Avatar"
      lead="Avatar is the identity chip used everywhere a person, team, or resource needs a compact visual representation — worklist rows, comment threads, presence indicators, workspace switchers. The image-with-graceful-fallback cascade (initials → custom icon → empty) is handled by the primitive so consumer code stays terse: pass `name` and the DS derives everything you need."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part maps 1:1 to a prop or slot. The Radix Avatar under the hood swaps image → fallback only after the image fails (or after `delayMs` if it's slow to load), so users never see a flash of initials before the photo lands."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          gap: t.space.inline.xl,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Avatar size="xl" src={SAMPLE_IMG} name="Jane Cooper" status="online" />
        <Avatar size="xl" name="Marcus Riley" />
        <Avatar size="xl" shape="square" name="Cardiology Team" />
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="frame"    desc="Round (default) or square container. Size prop drives width + height + font-size." />
        <Part name="image"    desc="`src` — rendered inside the frame with object-fit: cover. Falls back on error." />
        <Part name="fallback" desc="`children` override, then `name`-derived initials, then empty. Radix waits for image error or delayMs." />
        <Part name="status"   desc="Optional presence dot, painted at the bottom-right with a ring against the surface." />
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
      lead="Five sizes aligned to the Button + Input ladder. An Avatar next to a same-size control sits pixel-flush on the same row."
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
              gridTemplateColumns: "80px 80px 1fr",
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
            <Avatar size={s} src={SAMPLE_IMG} name="Jane Cooper" />
            <span style={{ ...t.type.caption, color: t.color.text.secondary }}>
              {SIZE_HINT[s]}
            </span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Fallback ═══════════════════════════════════════════════════ */

function FallbackBlock() {
  return (
    <DocBlock
      title="Fallback cascade"
      lead="No image? The DS falls back to auto-derived initials from `name`, then to a `children` override (usually a lucide icon), then to an empty chip. Priority: children > initials > empty."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FallbackTile
          title="Image + name"
          code={`<Avatar src="/api/users/jane" name="Jane Cooper" />`}
          avatar={<Avatar size="lg" src={SAMPLE_IMG} name="Jane Cooper" />}
        />
        <FallbackTile
          title="Initials from name"
          code={`<Avatar name="Marcus Riley" />`}
          avatar={<Avatar size="lg" name="Marcus Riley" />}
        />
        <FallbackTile
          title="Single-word name"
          code={`<Avatar name="Prince" />`}
          avatar={<Avatar size="lg" name="Prince" />}
        />
        <FallbackTile
          title="Icon override"
          code={`<Avatar name="Guest">{"<UserRound />"}</Avatar>`}
          avatar={
            <Avatar size="lg" name="Guest">
              <UserRound />
            </Avatar>
          }
        />
        <FallbackTile
          title="Square shape (resource)"
          code={`<Avatar shape="square" name="Cardiology Team" />`}
          avatar={<Avatar size="lg" shape="square" name="Cardiology Team" />}
        />
        <FallbackTile
          title="Broken image → initials"
          code={`<Avatar src="/broken" name="Adam Quinn" />`}
          avatar={<Avatar size="lg" src="/broken-image-path.jpg" name="Adam Quinn" />}
        />
      </div>
    </DocBlock>
  );
}

function FallbackTile({
  title,
  code,
  avatar,
}: {
  title: string;
  code: string;
  avatar: ReactNode;
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
      <div style={{ display: "flex", justifyContent: "center", minHeight: 56 }}>{avatar}</div>
      <div>
        <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{title}</div>
        <code
          style={{
            ...t.type.caption,
            color: t.color.action.primary,
            fontFamily: t.font.mono,
            wordBreak: "break-word",
          }}
        >
          {code}
        </code>
      </div>
    </div>
  );
}

/* ══════ Status ═════════════════════════════════════════════════════ */

function StatusBlock() {
  return (
    <DocBlock
      title="Presence status"
      lead="Optional dot at the bottom-right of the avatar. Four tones — the DS picks the color from the semantic status token; consumers pass intent, not color."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        {STATUSES.map((s) => (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <Avatar size="lg" src={SAMPLE_IMG} name="Jane Cooper" status={s} />
            <div>
              <code
                style={{
                  fontFamily: t.font.mono,
                  fontWeight: 700,
                  color: t.color.action.primary,
                }}
              >
                status="{s}"
              </code>
              <div style={{ ...t.type.caption, color: t.color.text.secondary }}>
                {STATUS_HINT[s]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Group ══════════════════════════════════════════════════════ */

function GroupBlock() {
  return (
    <DocBlock
      title="AvatarGroup"
      lead="Stacked avatar row with automatic `+N` overflow. Use for shared collaborators, assignees, or attendees. The `max` prop caps individual renders; the rest collapse into a neutral chip at the end."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          flexDirection: "column",
          gap: t.space.section.sm,
        }}
      >
        <div>
          <SectionEyebrow>Small — table row assignees</SectionEyebrow>
          <AvatarGroup size="sm">
            <Avatar name="Jane Cooper" src={SAMPLE_IMG} />
            <Avatar name="Marcus Riley" src={SAMPLE_IMG_2} />
            <Avatar name="Priya Patel" />
            <Avatar name="Adam Quinn" src={SAMPLE_IMG_4} />
          </AvatarGroup>
        </div>

        <div>
          <SectionEyebrow>Medium with overflow — max=3</SectionEyebrow>
          <AvatarGroup size="md" max={3}>
            <Avatar name="Jane Cooper" src={SAMPLE_IMG} />
            <Avatar name="Marcus Riley" src={SAMPLE_IMG_2} />
            <Avatar name="Priya Patel" src={SAMPLE_IMG_3} />
            <Avatar name="Adam Quinn" src={SAMPLE_IMG_4} />
            <Avatar name="Sam Reeves" />
            <Avatar name="Nia Okoro" />
          </AvatarGroup>
        </div>

        <div>
          <SectionEyebrow>Large — profile card / detail page</SectionEyebrow>
          <AvatarGroup size="lg" max={4}>
            <Avatar name="Jane Cooper" src={SAMPLE_IMG} />
            <Avatar name="Marcus Riley" src={SAMPLE_IMG_2} />
            <Avatar name="Priya Patel" src={SAMPLE_IMG_3} />
            <Avatar name="Adam Quinn" src={SAMPLE_IMG_4} />
            <Avatar name="Sam Reeves" />
            <Avatar name="Nia Okoro" />
            <Avatar name="Kai Chen" />
          </AvatarGroup>
        </div>
      </div>
    </DocBlock>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...t.type.caption,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontWeight: 700,
        color: t.color.text.tertiary,
        marginBottom: t.space.stack.sm,
      }}
    >
      {children}
    </div>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [size, setSize] = useState<AvatarSize>("md");
  const [shape, setShape] = useState<AvatarShape>("circle");
  const [status, setStatus] = useState<AvatarStatus | "none">("none");
  const [name, setName] = useState("Jane Cooper");
  const [hasImage, setHasImage] = useState(true);

  const resolvedStatus = status === "none" ? undefined : status;

  return (
    <DocBlock
      title="Playground"
      lead="Live component. Every control rebinds the rendered avatar in real time."
    >
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
            minHeight: 120,
          }}
        >
          <Avatar
            size={size}
            shape={shape}
            name={name || undefined}
            src={hasImage ? SAMPLE_IMG : undefined}
            status={resolvedStatus}
          />
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="size" value={size} options={SIZES} onChange={(v) => setSize(v as AvatarSize)} />
          <SelectControl label="shape" value={shape} options={["circle", "square"]} onChange={(v) => setShape(v as AvatarShape)} />
          <SelectControl
            label="status"
            value={status}
            options={["none", ...STATUSES]}
            onChange={(v) => setStatus(v as AvatarStatus | "none")}
          />
          <TextControl label="name" value={name} onChange={setName} />
          <ToggleControl label="hasImage" value={hasImage} onChange={setHasImage} />
        </div>

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
            {renderCode({ size, shape, status: resolvedStatus, name, hasImage })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: AvatarSize;
  shape: AvatarShape;
  status?: AvatarStatus;
  name: string;
  hasImage: boolean;
}) {
  const attrs: string[] = [];
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.shape !== "circle") attrs.push(`shape="${s.shape}"`);
  if (s.hasImage) attrs.push(`src="/api/users/jane.png"`);
  if (s.name) attrs.push(`name="${s.name.replace(/"/g, '\\"')}"`);
  if (s.status) attrs.push(`status="${s.status}"`);
  const multiline = attrs.length > 3;
  if (multiline) return `<Avatar\n  ${attrs.join("\n  ")}\n/>`;
  return `<Avatar${attrs.length ? " " + attrs.join(" ") : ""} />`;
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

function TextControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
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
      />
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

const AVATAR_PROPS: PropRow[] = [
  { name: "src",     type: "string",                              def: "—",       desc: "Image source. Falls back to initials / children / empty on error or slow load." },
  { name: "alt",     type: "string",                              def: "—",       desc: "Accessible name + <img> alt text. Required for non-decorative avatars." },
  { name: "name",    type: "string",                              def: "—",       desc: "Full name used to derive initials (first + last letter). Also used as accessible name if alt is not set." },
  { name: "children", type: "ReactNode",                          def: "—",       desc: "Fallback override — wins over initials. Use for a lucide icon or custom node." },
  { name: "size",    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",    def: "'md'",    desc: "Height ladder — matches Button + Input so avatars align pixel-flush next to controls." },
  { name: "shape",   type: "'circle' | 'square'",                 def: "'circle'", desc: "Circle for people, square for teams / resources." },
  { name: "status",  type: "'online' | 'away' | 'busy' | 'offline'", def: "—",  desc: "Presence dot painted at bottom-right with a ring against the surface." },
  { name: "delayMs", type: "number",                              def: "500",     desc: "Delay before the fallback renders while the image is loading. Prevents a flash of initials." },
];

const GROUP_PROPS: PropRow[] = [
  { name: "size",     type: "AvatarSize",  def: "—",       desc: "Override every child avatar's size in one place." },
  { name: "max",      type: "number",      def: "—",       desc: "Cap on individually rendered avatars. Overflow collapses into a `+N` chip at the end." },
  { name: "children", type: "ReactNode",   def: "—",       desc: "Compose <Avatar> children — DOM order preserved for screen readers." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropSectionEyebrow>Avatar</PropSectionEyebrow>
      <PropsTable rows={AVATAR_PROPS} />
      <div style={{ marginTop: t.space.section.sm }}>
        <PropSectionEyebrow>AvatarGroup</PropSectionEyebrow>
        <PropsTable rows={GROUP_PROPS} />
      </div>
    </DocBlock>
  );
}

function PropSectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...t.type.caption,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontWeight: 700,
        color: t.color.text.tertiary,
        marginBottom: t.space.stack.sm,
      }}
    >
      {children}
    </div>
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
            text: "Set `alt` or `name` on any avatar that carries meaning (represents a person). The DS uses whichever is present as the accessible name; if both are missing the avatar renders as decorative (no role, no aria-label).",
          },
          {
            tone: "must",
            text: "Initials come from the last two space-separated tokens in `name` — first letter of first word + first letter of last word. Non-alpha characters are stripped. Single-word names render one letter.",
          },
          {
            tone: "should",
            text: "Use `shape='square'` only when the avatar represents a resource (team, workspace, document owner). Circles are the visual convention for people; using a square for a person makes the avatar read as a resource.",
          },
          {
            tone: "note",
            text: "The image → fallback cascade is handled by @radix-ui/react-avatar. Fallback appears after the image errors OR after `delayMs` (default 500) if the image is slow to load — this prevents a flash of initials before the photo lands.",
          },
        ]}
      />

      <Callout tone="info" title="Sizing next to Button and Input">
        Each Avatar size matches the same size on Button and Input to the pixel. An `xs` Avatar (20px) sits flush next to an `xs` Button (24px) with the label baseline aligned. Same for sm / md / lg / xl. If they drift, change the primitive, not the consumer stylesheet.
      </Callout>
    </DocBlock>
  );
}
