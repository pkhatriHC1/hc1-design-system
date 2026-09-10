# Changelog

All notable changes to `@hc1/design-system` are documented here. This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] — 2026-09-10

**Compiled distribution + three new components + first real consumer migration proven end-to-end (SourceIQ).**

This release is the first that flips distribution from source-only to a compiled `dist/`. It also lands the first three components requested by the SourceIQ migration (Progress, Separator, ScrollArea) and documents every consumer-side gotcha we hit while validating the migration in a real product.

### Added

- **New components** — `Progress`, `Separator`, `ScrollArea`. Each wraps its Radix primitive (`@radix-ui/react-progress`, `-separator`, `-scroll-area`) and consumes HC1 tokens via `--hc-*` CSS vars. Follow the standard `cva` + Tailwind v4 pattern; API is deliberately close to shadcn's shape so consumers migrating from stock shadcn versions of these components rename imports only.
- **`tsup` build pipeline** — DS now ships compiled `dist/` with `.js`, `.cjs`, `.d.ts`, `.d.cts`, source maps, and a flat `styles.css`. Configured via `tsup.config.ts`.
- **`prepare` script** — auto-runs `npm run build` on `npm install`, so consumers installing via git URL (or `file:` in a monorepo) always get a working `dist/` with zero manual steps.
- **New peer dependencies** — `@radix-ui/react-progress`, `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`. Consumers must install these alongside the existing Radix peers.
- **README rewrite** — architecture-at-a-glance diagram, explicit "Built on shadcn/ui" section, ten documented architecture decisions (why compiled, why compound components, why options-array Select, why no dark mode yet, etc.), and a Consumer setup section covering the two must-do steps consumers keep hitting.

### Changed

- **Distribution model** — was source-only, now ships compiled `dist/`. `main`, `module`, `types`, and every `exports` conditional in `package.json` point at `./dist/*`. `files` narrowed to `["dist", "README.md", "CHANGELOG.md"]`.
- **Consumers no longer type-check DS internals.** This eliminates the *"Two different types with this name exist"* class of error entirely — DS's `.d.ts` files reference `react` and defer to the consumer's own `@types/react`, so version drift stops mattering.
- **`@types/react` bumped to `^19.0.0`** in `devDependencies` (matches React 19 API surface).
- **Peer `react` / `react-dom` widened to `>=18`** — React 18 and 19 both work; consumer's version wins.

### Consumer-side setup requirements (documented in README §Consumer setup)

Two setup steps every consuming app must perform. Both are one-time.

1. **Vite `resolve.dedupe: ["react", "react-dom", "react/jsx-runtime"]`** — **REQUIRED**. Without this, symlinked or `file:` dep setups produce two React instances (DS's copy + consumer's copy), and the runtime throws *"Invalid hook call"* the moment any DS hook fires. This is the single most common failure we saw during SourceIQ validation.
2. **npm `overrides` for `@types/react` / `@types/react-dom`** — **RECOMMENDED**. Defense-in-depth against a transitive dep pulling in a different `@types/react` and re-introducing type conflicts.

### Verified end-to-end

- **DS fresh build from clean state** — `rm -rf dist node_modules && npm install` → `prepare` script auto-runs tsup → `dist/` regenerated. ✅
- **DS typecheck** — `tsc --noEmit` clean, zero errors. ✅
- **DS `dist/` shape** — every `package.json` export points to a real file; CSS chain `styles.css → tokens/css/variables.css → theme.css + shadcn-bridge.css` intact. ✅
- **New components exportable from `dist/index.d.ts`** — `Progress`, `Separator`, `ScrollArea` and all their type exports present. ✅
- **SourceIQ builds cleanly consuming compiled DS** — `eslint . && tsc -b && vite build` exit 0, no workarounds needed (no symlink hacks, no npm overrides other than the recommended defensive ones). ✅
- **Playground still deploys** — GitHub Pages workflow success, live URL HTTP 200, 53 doc sections render, no overlay regressions, no JS errors. ✅
- **SourceIQ Data Upload page migrated end-to-end** — Alert, Badge, Button, Input, Tabs all swapped to `@hc1/design-system`; app builds, renders with HC1 palette, no console errors. Documented in `sourceiq-hc1com/docs/DESIGN_SYSTEM_MIGRATION.md`.

### Known follow-ups (surfaced by the SourceIQ migration; not blocking)

- **`Tabs.List` line-underline style** — HC1's Tabs doesn't render a shadcn-style line underline. Design decision needed: add a `variant="line"` prop to `Tabs.List` or accept the visual change.
- **`Select` migration is a real refactor** for cases with `SelectGroup` / `SelectSeparator` / custom `SelectValue` rendering. Simple flat selects are one-liners; grouped selects need per-usage care.
- **`Sidebar`, `Chart`, `MultiFileDropZone`** — sourceIQ uses these locally; not yet in DS. Sidebar is tightly coupled to AppShell layout and needs design definition before DS adoption. Chart + MultiFileDropZone stay per-product.

### Not changed

- Token architecture (primitives → aliases → component tokens) — preserved.
- Every existing component API — preserved. This is an additive release.
- Semver contract for the 20 pre-existing components — unchanged.

---

## [0.9.1] — 2026-08-06

**Brand alignment — official HC1 platform palette replaces the scaffolding palette.**

The Material-family placeholder palette that shipped in 0.9.0 was seeded during initial DS scaffolding and never represented the actual HC1 platform brand. This release replaces it with the approved HC1 palette, sourced verbatim from ClinicalIQ's `tokens.json` v3.0-draft. Every value has a documented rationale — see `BRAND_AUDIT.md`.

**No component, API, or architecture changes.** Only token values change. Components inherit the new palette automatically through the alias layer.

### Changed — primitives

Every color scale replaced with approved HC1 values. Anchor at 500 in every family. The 950 slot is preserved in the ramp structure but holds the same value as 900 as a placeholder — v3 does not currently define a 950 shade.

| Family | Anchor (was → now) | Note |
|---|---|---|
| brand | `#009688` → `#0D7782` | Platform primary. Blended in HSL from ClinicalIQ's `#1C6882` + SourceIQ's `#00A79D`. |
| accent | `#F7941D` → `#B75E0B` | Amber. Contrast-adjusted to carry white text at ≥4.5:1. Bright shades (300/400) remain for identity uses. |
| **violet (NEW)** | — → `#6C4DD1` | Reserved for AI moments only. Consumed exclusively via `ai.*` alias. |
| neutral | `#647880` → `#767C84` | Cool-neutral bluish grey (~215° hue). Reads clinical rather than consumer-warm. |
| green | `#2A9647` → `#2E7028` | Success. Contrast-adjusted from `#388032` for WCAG AA (previous failed at ~4.1:1). |
| yellow | `#DE8112` → `#B78810` (bg-only) | Medium-severity surface tint only. v3 defines steps 50–400; darker slots placeholder to 400. Text on yellow uses accent-700. |
| red | `#D62828` → `#B00A2F` | Critical severity + danger. Medical UI convention. |
| blue | unchanged | Retained as supporting utility. Not a semantic role. |

### Added — new semantic aliases

- `cta.*` — dedicated execute/irreversible action alias (amber). Retained on `action.accent*` for backward compatibility with existing docs.
- `ai.*` — AI-moment reserved surface + gradient. Includes `gradientFrom/via/to` for the AI header gradient.
- `severity.*` — five-tier medical severity (critical / high / medium / low / normal), each with `text + bg + bgSubtle + border`. Distinct from `status` (event-scoped feedback) — deliberately kept separate.
- `background.page`, `background.scrim` — v3 page background and overlay scrim tints.
- `text.onSolid` — text on any solid brand/action fill (white).

### Changed — semantic values

- `background.surface`: was `neutral-50`, now `white` (v3: surface is white, page grey sits behind).
- `status.info`: fg/bg/border now use primary teal (v3 semantic: info uses brand, not blue).
- `status.warning`: fg now uses `accent-700` (yellow is bg-only, per v3).
- `status.success` / `status.error`: fg now uses 500-step (v3 anchor), previously used 700-step.

### Docs

- `ColorsDoc.tsx` notes updated to reflect new anchors and reasoning.
- `PopoverDoc.tsx` color-picker swatches updated from Material values to HC1 palette.
- `FOUNDATION.md`, `ARCHITECTURE.md`, `README.md` — no references to Material anchors remained after v0.9.0 wording; no rewrites needed.
- `BRAND_AUDIT.md` — reference document for the palette. Retained.

### Fixed
- 4 hardcoded Material hex values inside DS doc files eliminated (`#009688`, `#F7941D`, `#00796B`, `#2263DB` as sample swatch).

### Not changed
- Token architecture (primitives → aliases → component tokens → components) — preserved.
- Public API — every existing alias name preserved. Only values changed, plus additive aliases.
- Ramp structure — HC1's 50/100/…/950 slots preserved. v3's 025 ultra-tint is not adopted (would require a public API change).
- Blue scale — retained as supporting utility (chart series, data-viz). Not promoted to a semantic role.
- HerCare pink — remains product-scoped (does NOT lift into HC1 per FOUNDATION.md §8).
- Every component file, every component API — unchanged.

### Verified
- `npm run typecheck` — clean.
- Consumer `vite build` (ClinicalIQ) — clean, 135.44 KB CSS / 1533 KB JS.
- Zero Material hex anchors remain in `src/` (grep-verified).
- Playground `/design-system` route serves.

---

## [0.9.0] — 2026-08-06

Pre-1.0 stabilization release. The package is feature-complete for its initial surface but has not yet been validated by a real product migration. **1.0.0 is deliberately withheld** until:

- ClinicalIQ is fully migrated onto the package.
- SourceIQ is fully migrated onto the package.
- The legacy design systems inside both products are removed.
- The public API has survived at least one round of production adoption without breaking changes.

Any 0.9.x → 0.9.y change may break the public surface. Once the four gates above are cleared, we cut 1.0.0 and lock semver.

### Added
- **22 components** — Alert, Badge, Breadcrumb, Button, Card, Checkbox, Dialog, Drawer, EmptyState, Input, Pagination, Popover, Radio, Select, Skeleton, Switch, Table, Tabs, Textarea, Toast, Tooltip.
- **Three-layer token system** — primitives, semantic aliases, component tokens. Available as TypeScript exports and as CSS custom properties via `./styles`.
- **Playground app** — the interactive documentation site, available at `@hc1/design-system/playground`.
- **FOUNDATION.md** — engineering and design constitution for the HC1 platform.

### Fixed
- `src/components/button/Button.tsx` — added a `vite/client` types reference so `import.meta.env` typechecks without adding vite as a dependency.
- `src/docs/components/DialogDoc.tsx`, `DrawerDoc.tsx` — narrowed `ReactNode` return types to satisfy the story-render helper's `ReactElement` parameter.
- `src/docs/foundations/MotionDoc.tsx`, `SpacingDoc.tsx` — retyped the token-entries tuples so `Object.entries` output aligns with the token map key/value types.
- `src/tokens/components/{emptyState,radio,skeleton,switch}.ts` — replaced references to the non-existent `radius.full` with `radius.circular` (same runtime value, `9999px`; the alias key had been renamed and four call sites drifted).

### Package
- Source-only distribution. Consumers' bundlers compile the TypeScript + JSX directly.
- Explicit `exports` map — root, `./tokens`, `./styles`, `./playground`. Everything else is internal.
- Peer dependencies on `react` and `react-dom` (>=18). Only runtime dependency is `lucide-react`.
- `npm run typecheck` passes cleanly with `strict: true`.
