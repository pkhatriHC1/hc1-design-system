# HC1 Brand Audit

**Report only.** No colors changed, no ramps interpolated, no tokens rewritten, no components migrated.

**Purpose:** Determine which colors currently in circulation across the HC1 ecosystem should become the canonical HC1 platform palette, and which should be left in products or retired.

**Audience:** Design lead + engineering lead. This report should be reviewed and signed off before any palette change is made to `@hc1/design-system`.

---

## 1. Executive summary

The HC1 Design System (`@hc1/design-system` at `/HC1/hc1-design-system/`) currently ships a **Material-family placeholder palette** (`brand-500 = #009688`, Material teal). The palette was seeded during initial scaffolding and does not match the actual HC1 platform brand.

The **canonical HC1 platform brand** already exists — it lives in ClinicalIQ's root `tokens.json` (marked `$version: "3.0.0-draft"`). This file:

- Documents design reasoning per color family.
- Contrast-verifies every anchor against WCAG AA.
- Explains the primary blend (`#0D7782` was derived in HSL space from ClinicalIQ's old `#1C6882` blue-steel + SourceIQ's old `#00A79D` green-teal).
- Ships a full semantic layer (action / cta / ai / severity / feedback).

**Recommendation:** Adopt ClinicalIQ's `tokens.json` v3.0 primitives + semantic layer as the canonical HC1 palette. Retire HC1's current Material placeholders. This is a significant palette rewrite in `@hc1/design-system`; because we are pre-1.0, no semver contract is broken.

**Blocking questions for design/PM (see §8):**
- Confirm `#0D7782` as the platform primary anchor.
- Confirm the severity-color model (5 tiers: critical / high / medium / low / normal — each with text + bg + border) as platform-owned, not product-owned.
- Confirm HerCare's pink accent (`#C2185B`) is product-owned (HerCare module) and does NOT lift into HC1.

---

## 2. Methodology

- **Read every color file** across the three products: HC1's `colors.ts` + `variables.css`, ClinicalIQ's root `tokens.json` + 3 prototype `const C` maps, SourceIQ's tailwind config + `tokens.json` (nested design-system seed) + docs/design-system.md.
- **Grep every hex literal** in each product's source, count usage per color, rank by frequency. High-usage colors are the *de facto* palette; low-usage colors are candidates for cleanup.
- **Cross-reference documentation.** SourceIQ's nested `docs/design-system.md` documents the historical brand blend explicitly (§7 crosswalk). ClinicalIQ's `tokens.json` documents design intent per color family. HC1's `colors.ts` header notes claim `#009688` is "HC1 teal" but this is contradicted by every other source.

**What this audit does NOT do:**
- Does NOT interpolate ramp steps.
- Does NOT propose new color values.
- Does NOT rewrite any file.
- Does NOT migrate any component.
- Does NOT resolve contrast violations discovered during the audit (flagged only).

---

## 3. State of the world per product

### 3.1 HC1 Design System — current

**Location:** `/HC1/hc1-design-system/src/tokens/primitives/colors.ts` + `.../variables.css`

**Palette (500-step anchors):**

| Role | Value | Provenance |
|---|---|---|
| `brand-500` | `#009688` | Material Design Teal 500 (verbatim) |
| `accent-500` | `#F7941D` | Unknown / possibly HC1-original |
| `neutral-500` | `#647880` | Cool-green-tinted custom ramp |
| `green-500` | `#2A9647` | Custom |
| `yellow-500` | `#DE8112` | Custom |
| `red-500` | `#D62828` | Custom |
| `blue-500` | `#2263DB` | Custom |

**Evidence that this is placeholder:**

- `brand-50 → brand-950` (`#E0F2F1 → ... → #00251C`) is **verbatim Material Design's Teal palette** — recognizable to anyone who's used Material UI.
- The docstring at top of `colors.ts` states *"brand — #009688 (HC1 teal, anchored at 500)"* — but this contradicts every other source in the ecosystem, including ClinicalIQ's canonical `tokens.json` and the historical-blend documentation inside SourceIQ.
- **Zero consumers**: after Wave 1 of the ClinicalIQ migration completed, no product code reads these colors at runtime. The palette exists only in the playground.

**Verdict:** Placeholder. Was appropriate scaffolding for the initial DS build; is not the real brand.

---

### 3.2 ClinicalIQ

**Three overlapping sources of truth:**

#### 3.2.1 Root `tokens.json` (v3.0-draft) — the *design intent*

The most complete and best-documented palette in the ecosystem. Marked `$version: "3.0.0-draft"`. Includes both a legacy flat mirror and a proper `primitives / semantics` two-tier structure.

**Primitive scales (500-step anchors, with design notes):**

| Family | 500 anchor | Note from the file |
|---|---|---|
| `teal` | `#0D7782` | "Primary brand + action anchor. 500 preserves the existing #0D7782 identity for continuity." |
| `violet` | `#6C4DD1` | "Secondary brand — reserved for AI moments. Hue distinct from primary so 'AI-speaking' reads at a glance." |
| `amber` | `#B75E0B` | "500 is DARKER than the previous bright `#F58126` to meet white-on-fill contrast (≥4.5:1)." |
| `red` | `#B00A2F` | "Critical severity. Follows medical UI convention." |
| `green` | `#2E7028` | "500 adjusted from previous `#388032` to `#2E7028` to clear WCAG AA (previous failed at ~4.1:1)." |
| `yellow` | `#B78810` | "Medium severity — background fills only. Text on yellow uses amber.700." |
| `grey` | `#767C84` | "Cool-neutral (~215° hue at low L, near-0 chroma at high L). Chosen to unify with teal and read clinical rather than consumer-warm." |

**Semantic layer** (partial excerpt — see file for the full list):

- `action.default = #0D7782` (primary action)
- `cta.default = #B75E0B` (execute / irreversible — amber)
- `ai.gradient = violet → violet-hover → teal-300` (AI-reserved gradient)
- `severity.critical / high / medium / low / normal` — each with `text + bg + border`
- `feedback.success / info / warning / danger` — event-scoped (different from state-scoped `severity`)
- `focus-ring.color = #0D7782`
- `chart.categorical` — six fixed colors, canonical order

**Verdict:** This is the actual HC1 platform brand, documented as such. No other file in the ecosystem is this considered.

#### 3.2.2 Prototype inline `const C` maps — the *shipped visual*

Every prototype (`anemia-management.jsx`, `hercare-copilot.jsx`, `clinicaliq-starter.jsx`) declares an identical inline color map at the top of the file. This is what users actually see in production today.

```js
const C = {
  grey:      { 100:"#FFFFFF", 200:"#F7F7F7", 300:"#E7E7E7", 400:"#CFD1D1",
               500:"#A8ADAD", 600:"#737E7F", 700:"#545D5E", 800:"#273233" },
  primary:   { 100:"#ECF4F5", 200:"#CFE4E6", 300:"#9EC9CD", 400:"#56A0A8",
               500:"#0D7782", 600:"#0B626B" },
  secondary: { 100:"#E1F3F5", 200:"#CFEBEE", 300:"#AFDCE1", 400:"#75CAD3",
               500:"#3CA6B0", 600:"#1D828C" },
  orange:    { 100:"#FFEFE0", 400:"#F58126" },
  yellow:    { 100:"#FFECC1", 400:"#FFC432" },
  error:     { 100:"#F4DFE4", 400:"#B00A2F" },
  success:   { 100:"#D7E7D6", 400:"#388032" },
  red:       { 100:"#EFB0AB", 400:"#C6473C" },
};
// HerCare additionally declares:
//   hc:      { 100:"#FDF0F7", 400:"#C2185B", 500:"#880E4F" }   ← HerCare pink
// Starter additionally declares:
//   amber:   { text:"#92600A" }
```

**Deviations from tokens.json v3.0:**

- `grey.200 = #F7F7F7` vs v3 grey.050 = `#F4F6F8` — different value, different ramp position naming.
- `grey.800 = #273233` vs v3 grey.800 = `#21252B` — slightly different (very close, imperceptible).
- `orange.400 = #F58126` vs v3 amber.500 = `#B75E0B` (the "brighter" old orange, before contrast-adjustment noted in v3).
- `success.400 = #388032` vs v3 green.500 = `#2E7028` (the pre-contrast-adjustment green flagged in v3).
- `secondary` is teal-cyan `#3CA6B0` in prototypes vs v3 violet `#6C4DD1`. **This is a role conflict** — prototypes use "secondary" as a supporting teal; v3 uses "secondary" as violet reserved for AI. Both cannot be right.

**Verdict:** The prototypes' inline palette is the *pre-v3 seed*, not the design intent. It's what SourceIQ's nested `hc1-design-system/tokens.json` also contains — the original v1 seed shared between products before v3 was drafted. Prototypes have not been re-rendered to consume v3 values.

#### 3.2.3 CLAUDE.md brand notes

CLAUDE.md at ClinicalIQ root establishes `tokens.json` as canonical:
> "If tokens.json and this file ever disagree — `tokens.json` wins."

This confirms tokens.json v3.0 as intended source of truth.

---

### 3.3 SourceIQ

**Two overlapping sources:**

#### 3.3.1 Nested `src/hc1-design-system/tokens.json` — historical seed

An **older copy of the pre-v3 seed** — identical to ClinicalIQ's prototype `const C` shape:

```json
"primary":   { "500": "#0D7782", "600": "#0B626B" },
"secondary": { "500": "#3CA6B0", "600": "#1D828C" },
// same greys, oranges, errors, successes as ClinicalIQ prototypes
```

Verdict: Historical artifact. Copied from the July 30 hc1-design-system stub before it was replaced. Not actively consumed by SourceIQ product code.

#### 3.3.2 Actual hex usage — the *shipped visual* in SourceIQ

Top-15 most-used hex literals in `sourceIQ/src` (raw grep):

| Rank | Hex | Uses | Classification |
|---|---|---|---|
| 1 | `#0B4F5C` | 1,096 | SourceIQ's dark-teal brand (pre-migration) |
| 2 | `#00A79D` | 746 | SourceIQ's original green-teal brand (pre-migration) |
| 3 | `#009688` | 671 | Material teal — likely from Material components + coincidentally HC1's current brand-500 placeholder |
| 4 | `#F7941D` | 415 | Orange — matches HC1's current `accent-500` (unclear which seeded which) |
| 5 | `#E07A3B` | 58 | Dark orange (variation) |
| 6 | `#1B2A4A` | 52 | Navy (nav chrome?) |
| 7 | `#4a3c7d` | 31 | Muted violet |
| 8 | `#00796B` | 29 | Material teal 700 |
| 9 | `#5B5FC7` | 25 | Blue-violet |
| 10 | `#EF4444` | 22 | Tailwind red-500 |
| 11 | `#007a6e` | 21 | Custom dark teal |
| 12 | `#00897B` | 17 | Material teal 600 |
| 13 | `#F59E0B` | 15 | Tailwind amber-500 |
| 14 | `#e5e7eb` | 15 | Tailwind gray-200 |
| 15 | `#1565C0` | 14 | Material blue 800 |

**Interpretation:**
- SourceIQ's product code is **still on its pre-migration palette** (`#0B4F5C` + `#00A79D`).
- The nested `hc1-design-system/tokens.json` was documented as the migration target but the migration never happened.
- SourceIQ pulls values from at least three sources: its own brand (`#0B4F5C`, `#00A79D`, `#E07A3B`), Material UI components (`#009688`, `#00796B`, `#00897B`, `#1565C0`), and Tailwind defaults (`#EF4444`, `#F59E0B`, `#e5e7eb`).

#### 3.3.3 Historical blend documented in SourceIQ

`sourceIQ/src/hc1-design-system/docs/design-system.md` §7 explicitly documents the primary-blend:

> "The two products had genuinely different primaries: ClinicalIQ's blue-steel (`#1C6882`, hue 195°, from Puja's Figma tokens) and SourceIQ's green-teal (`#00A79D`, hue 176°, from the Bolt build). Rather than picking a side, the new primary was derived by blending in HSL space — a proper hue/saturation/lightness blend, not a naive RGB average, which would have produced a muddy grey."

Migration crosswalk in the same doc:

| SourceIQ old | HC1 canonical |
|---|---|
| teal `#00A79D` | `primary-500` `#0D7782` |
| navy `#0B4F5C` | `primary-600` `#0B626B` |

**This closes the loop.** `#0D7782` is not accidental — it was *designed* as the blended platform primary.

---

## 4. Side-by-side comparison

Anchors only. Full ramps in each source file.

| Role | HC1 current (`variables.css`) | ClinicalIQ v3 (`tokens.json`) | ClinicalIQ prototypes (inline `C`) | SourceIQ actual usage |
|---|---|---|---|---|
| **Primary brand 500** | `#009688` (Material teal) | `#0D7782` (blended) | `#0D7782` | `#0B4F5C` + `#00A79D` (pre-migration) |
| **Primary brand 600** | `#00897B` | `#086068` | `#0B626B` | — |
| **Secondary — teal-cyan** | — | — | `#3CA6B0` (labelled "secondary") | — |
| **Secondary — violet (AI)** | — | `#6C4DD1` (v3 "secondary" = AI violet) | — | `#5B5FC7`, `#4a3c7d` (drift) |
| **Accent orange 500** | `#F7941D` | `#B75E0B` (contrast-adjusted amber) | `#F58126` (bright, un-adjusted) | `#F7941D` (matches HC1) |
| **Neutral 800 (text)** | `#1E2C31` (cool-green) | `#21252B` (v3, cool-blue) | `#273233` (prototypes) | uses Material greys |
| **Red 500 (error)** | `#D62828` | `#B00A2F` | `#B00A2F` (error) / `#C6473C` (red) | `#EF4444` (Tailwind default) |
| **Green 500 (success)** | `#2A9647` | `#2E7028` (contrast-adjusted) | `#388032` (un-adjusted) | `#22C55E` (Tailwind default) |
| **Yellow 500** | `#DE8112` | `#B78810` (background-only, per v3 note) | `#FFC432` | `#F59E0B` (Tailwind) |
| **Blue (info)** | `#2263DB` | *(none — info uses primary teal)* | *(none)* | `#1565C0`, `#3B82F6` |

**Observations:**

- **The v3 palette and the prototype palette agree on the primary** (`#0D7782`) but disagree on nearly everything else. v3 is the WCAG-adjusted, thought-through version; prototypes are the pre-adjustment seed.
- **HC1's current palette matches nothing.** Its brand is Material, its accent is orange, its neutrals are cool-green. None of the three products consume any of these values.
- **SourceIQ's usage matches nothing canonical.** It's a mixture of its own old brand, Material component defaults, and Tailwind defaults — the classic "no design system" state.
- **Secondary is inconsistent.** v3 uses "secondary" to mean AI-violet. Prototypes use "secondary" to mean a supporting teal-cyan. This is a genuine naming collision that must be resolved.

---

## 5. Classification

Every hex in the ecosystem, sorted into one of five buckets.

### 5.1 True product / platform branding (belongs in HC1)

| Color | Role | Value | Source |
|---|---|---|---|
| **Primary teal** | The single platform brand — buttons, links, focus rings, primary actions | `#0D7782` | Documented as canonical in ClinicalIQ v3, matches prototypes, matches SourceIQ crosswalk target |
| **Primary ramp** | 025 / 050 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 | Values from ClinicalIQ v3 `teal` scale | v3 tokens.json |
| **CTA amber** (execute / irreversible) | `#B75E0B` | Contrast-adjusted in v3 with explicit note explaining the shift from `#F58126` |
| **AI violet** | Reserved for AI moments (gradient, panels) | `#6C4DD1` | v3 tokens.json, explicitly documented as "reserved for AI moments" |

**Not brand:** the teal-cyan `#3CA6B0` that prototypes call "secondary" — it's used as a supporting shade, not a signature. Reclassify as a shade or drop.

### 5.2 Semantic status colors (belongs in HC1)

| Tier | Text | Bg | Border | Source |
|---|---|---|---|---|
| **critical** | `#B00A2F` | `#F9D9DE` | `#F0AEB8` | v3 tokens.json — medical UI convention |
| **high** | `#703906` | `#FBD79E` | `#F7B95E` | v3 |
| **medium** | `#703906` | `#FDF0C9` | `#FBDC85` | v3 |
| **low** | `#565C66` | `#DBDEE3` | `#C1C5CC` | v3 |
| **normal** | `#2E7028` | `#DDF0D9` | `#BFDFB9` | v3 (contrast-adjusted from `#388032`) |

Also from v3: `feedback.success / info / warning / danger` — event-scoped rather than state-scoped. Same underlying palette, different semantic role. Adopt both.

### 5.3 Neutral UI colors (belongs in HC1)

- **Grey ramp**: 12-step scale from v3 (000/025/050/100/200/300/400/500/600/700/800/900). Cool-neutral bluish (~215° hue). Documented rationale in v3: "chosen to unify with teal primary and read clinical rather than consumer-warm."
- **White**: `#FFFFFF`
- **Black**: `#000000` (edge cases only, per v3 pattern)

### 5.4 Placeholders (should be retired from HC1)

Everything currently in `hc1-design-system/src/tokens/primitives/colors.ts`:

- `brand` scale (Material Teal `#009688`).
- `accent` scale (`#F7941D`) — unclear provenance; retire in favor of v3's amber-family.
- `neutral` scale (cool-green tint).
- `green`, `yellow`, `red`, `blue` scales (all Material-adjacent, none consumed by any product).

The 11-step 50→950 ramp structure that HC1 uses can be **kept as an architectural pattern** (11 steps is a good density) but with values swapped for v3's 025→900 ramps interpolated / mapped to fill.

### 5.5 Domain-specific (does NOT belong in HC1)

- **HerCare pink** (`hc: {100: #FDF0F7, 400: #C2185B, 500: #880E4F}`) — HerCare module accent, used to distinguish OB context. Stays inside HerCare product code (per FOUNDATION.md §5: "no product-brand accent colours" in HC1).
- **SourceIQ pre-migration brand** (`#0B4F5C`, `#00A79D`) — retire during SourceIQ's own token migration (crosswalk documented above).
- **Material component colors** SourceIQ pulls in (`#009688`, `#00796B`, `#1565C0` etc.) — will disappear when SourceIQ migrates off Material and onto HC1 primitives.
- **Tailwind default colors** SourceIQ pulls in (`#EF4444`, `#F59E0B`, `#e5e7eb`) — same story: replaced by HC1 primitives during migration.

---

## 6. Recommendation

### 6.1 Canonical HC1 palette

**Adopt ClinicalIQ's `tokens.json` v3.0-draft as the HC1 platform primitive + semantic palette, verbatim.**

- Copy every `primitives.color.*` scale (grey, teal, violet, amber, red, green, yellow) into `hc1-design-system/src/tokens/primitives/colors.ts`, replacing the Material-family scaffolding.
- Copy every `semantics.color.*` alias (action, cta, ai, severity, feedback, bg, border, fg) into `hc1-design-system/src/tokens/aliases/color.ts`, replacing the current alias scheme.
- Update `hc1-design-system/src/tokens/css/variables.css` to mirror.

**Do NOT interpolate or invent new steps.** v3's teal ramp goes 025 / 050 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 (10 steps). HC1's current ramp goes 50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 / 950 (11 steps). **The 025 tint and the 950 shade are genuinely different needs.** Recommend:

- **Adopt v3's 025 tint at each family.** It's designed and documented; do not skip.
- **Recommend dropping the 950 shade** (currently in HC1 only, used nowhere). Justify to design if they prefer to keep — happy path is 10 steps not 11.

**No new colors invented in this migration.** Every value is copied verbatim from v3.

### 6.2 Semantic naming corrections

Two naming conflicts must be resolved before adoption:

1. **"Secondary" name collision.** Prototypes use `secondary` for a supporting teal-cyan `#3CA6B0`. v3 uses `secondary` for AI violet `#6C4DD1`. Options:
   - **(a)** Keep v3's convention: `secondary` = AI violet. The teal-cyan becomes either a shade of the primary teal ramp or is dropped.
   - **(b)** Rename v3's `secondary` to `ai` at the primitive level (semantic layer already uses `ai.*`). Free up `secondary` for a supporting teal.
   
   **Recommendation: (a).** The teal-cyan in prototypes does not appear to carry a strong signature meaning; it can be sourced from the primary teal ramp (probably `teal.300` or `teal.400`). AI violet has a clearer identity.

2. **"Orange" vs "amber" vs "CTA".** Prototypes use `orange.400 = #F58126` broadly. v3 uses `amber.500 = #B75E0B` for CTA (contrast-adjusted) and reserves the brighter `#F58126` shade as `amber.300` (identity-only, no text on top). The rename is deliberate: the bright shade is decorative-only, the dark shade is functional.
   
   **Recommendation:** adopt v3's naming (`amber`, not `orange`). Bright `#F58126` becomes `amber.300` and stops appearing on backgrounds that need to carry white text.

### 6.3 Sequencing

1. **This audit** — reviewed + signed off by design/PM.
2. **HC1 palette rewrite PR** — copy v3 into HC1 primitives + aliases + variables.css. Ship as HC1 `0.9.1`. The playground visual shifts (Material teal → HC1 teal, accent orange → amber, cool-green neutrals → cool-blue neutrals). This is the *only* PR that shifts HC1's visual output.
3. **ClinicalIQ Wave 2 (Buttons)** — resumes. Every prototype's inline `const C.primary[500]` → `<Button variant="primary">` produces the correct color because HC1 now agrees. Every `C.error[400]` → `<Badge severity="critical">` produces `#B00A2F` correctly.
4. **SourceIQ migration** — a separate PR series, uses the documented crosswalk in `sourceIQ/src/hc1-design-system/docs/design-system.md` §7 to swap its pre-migration colors for HC1 tokens.

### 6.4 What NOT to do

- Do not adopt HC1's current Material palette as canonical — it's placeholder, and every downstream product would visually shift on migration.
- Do not merge HerCare pink into HC1 — it's product-scoped, will bloat the platform palette with a module-specific accent, and violates FOUNDATION.md §8.
- Do not blend HC1 + Material + ClinicalIQ into a "committee palette" — there is a clear intended brand (`tokens.json` v3.0). Pick it.
- Do not ship a "compatibility shim" that aliases HC1's Material vars to ClinicalIQ's real values. Two token sources = drift. Rewrite HC1 once, cleanly.

---

## 7. Reasoning summary — decision by decision

| Decision | Why |
|---|---|
| Canonical primary = `#0D7782` | Only value that appears in all three sources of truth (v3 tokens.json, ClinicalIQ prototypes, SourceIQ migration crosswalk). Designed as an HSL blend of ClinicalIQ's `#1C6882` + SourceIQ's `#00A79D` — the two products' original brands. Not arbitrary. |
| Retire HC1's `#009688` | Verbatim Material Teal 500. Recognizable to any Material UI user, not distinctive to HC1. Zero product consumers today. |
| Adopt v3's contrast-adjusted anchors (amber `#B75E0B`, green `#2E7028`) | v3 explicitly documents the adjustments to clear WCAG AA. Shipping un-adjusted anchors ships accessibility bugs. |
| Adopt v3's severity model verbatim (5 tiers, each with text + bg + border) | It's the most complete status model in the ecosystem. Documented as "never use color alone" per medical UI convention. Applies to every future clinical HC1 product. |
| Adopt v3's `feedback.*` semantic set alongside `severity.*` | v3 distinguishes state-scoped (severity) from event-scoped (feedback). This is a real distinction; ClinicalIQ uses both today. |
| Rename `orange` → `amber` at the primitive level | v3's naming is deliberate — the darker shade is functional (CTA), the bright shade is identity-only. The rename prevents future re-use of the bright shade on backgrounds needing white text. |
| Keep the "secondary" name for AI violet, drop it as the name for teal-cyan | Prototypes' teal-cyan usage carries no consistent signature meaning; can be sourced from the primary teal ramp. AI violet has a stronger, more distinct identity. |
| HerCare pink stays in HerCare | FOUNDATION.md §8: "no product-brand accent colours" in HC1. Modules distinguish by content, not by chrome color. |
| Ramp density: 10 steps (v3), not 11 (HC1 current) | v3's `025` tint is a real design need (subtle backgrounds). HC1's `950` extreme shade has no consumer. Keep the tint, drop the extreme. |
| Ship as HC1 0.9.1 not 1.0.0 | 1.0.0 is gated on all four adoption criteria (see CHANGELOG.md). Palette rewrite unblocks Wave 2 of ClinicalIQ but does not itself clear the 1.0 gates. |

---

## 8. Open questions for design / PM

Answer these before the palette rewrite PR is opened.

1. **Confirm `#0D7782` as the canonical HC1 primary.** All evidence points here; explicit signoff still required because this locks the brand for every future IQ module.

2. **Confirm the AI violet `#6C4DD1` is reserved platform-wide.** v3 documents this as an AI-only color. If design wants AI moments to signal differently, propose the alternative now.

3. **Confirm the severity model.** 5 tiers × 3 subroles (text / bg / border). Any change would ripple through every StatusChip in every product.

4. **Confirm HerCare pink stays HerCare-local.** Per FOUNDATION.md §8, product brand accents don't live in HC1. Named explicitly because HerCare is currently a module inside ClinicalIQ; if HerCare later spins out as its own IQ product, the pink might be a candidate — but not before.

5. **Ramp density: 10 steps or 11.** Recommendation is 10 (drop the `950` extreme, add the `025` tint from v3). If UI research shows a need for the `950` extreme, keep it — will require interpolating a value.

6. **Blue "info" scale.** HC1 currently ships one; v3 does not (info role uses primary teal). Recommendation: **drop the blue scale from HC1** unless a real consumer needs it. Chart-blue can come from the categorical chart palette if needed for data-viz.

7. **Chart categorical palette.** v3 ships a 6-color canonical order (`teal / amber / violet / green / dark-teal / yellow`). Adopt as HC1's chart palette? Answer determines whether HC1 owns the chart-color contract or defers it to products.

---

## 9. Files inspected (no changes made)

- `/HC1/hc1-design-system/src/tokens/primitives/colors.ts`
- `/HC1/hc1-design-system/src/tokens/css/variables.css`
- `/HC1/ClinicalIQ/tokens.json` (v3.0-draft)
- `/HC1/ClinicalIQ/prototypes/anemia-management.jsx` (inline `const C`)
- `/HC1/ClinicalIQ/prototypes/hercare-copilot.jsx` (inline `const C` + HerCare pink)
- `/HC1/ClinicalIQ/prototypes/clinicaliq-starter.jsx` (inline `const C`)
- `/HC1/ClinicalIQ/CLAUDE.md` (brand rules)
- `/HC1/sourceIQ/tailwind.config.js`
- `/HC1/sourceIQ/src/hc1-design-system/tokens.json` (v1 seed)
- `/HC1/sourceIQ/src/hc1-design-system/CLAUDE.md`
- `/HC1/sourceIQ/src/hc1-design-system/docs/design-system.md` (§7 crosswalk)
- Every `.tsx / .ts / .jsx / .css` in `sourceIQ/src` (grep for hex literals)

---

*Report only. No file in any repo was modified during this audit. Palette work begins only after design / PM signoff on §8.*
