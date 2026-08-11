# HC1 Architecture

The technical handbook for `@hc1/design-system`. Read this before you make a change to the package. Written for the engineer contributing code — not for the designer choosing a colour, not for the product engineer picking a component.

## 1. Purpose

This document explains *how* HC1 is built. Its companion, `FOUNDATION.md`, explains *why*. Keep them separate: the "why" changes rarely (design philosophy, product principles) while the "how" is a concrete map of the code as it exists today. A rule that changes because we picked a different bundler belongs here. A rule that changes because our view of clinical software shifted belongs there.

**Document relationships:**

| File | Audience | Question it answers | Change cadence |
|---|---|---|---|
| `README.md` | Anyone consuming the package | How do I install it and what does it export? | Whenever the public API changes |
| `FOUNDATION.md` | Everyone in the org | *Why* does HC1 exist, and what does it stand for? | Rarely — only on principle shifts |
| **`ARCHITECTURE.md`** (this file) | Contributors to the DS | *How* is HC1 built, layered, and evolved? | Whenever the code layout or infrastructure shifts |
| `CONTRIBUTING.md` *(future)* | First-time contributors | Step-by-step: how do I add a component? | Whenever the process changes |

A new engineer should be productive after reading `README.md`, `FOUNDATION.md`, and this file — nothing else. If you find yourself needing to explain the same concept in two of these files, one of them is wrong.

---

## 2. Repository Structure

```
hc1-design-system/
├── package.json          Exports map, peer deps (react, react-dom), runtime dep (lucide-react)
├── tsconfig.json         strict: true, target ES2022, jsx: react-jsx, moduleResolution: bundler
├── README.md             Public-facing installation + usage
├── FOUNDATION.md         The design constitution
├── ARCHITECTURE.md       This file
├── CHANGELOG.md          Semver history
├── node_modules/         Own install — no symlinks to consumer projects
└── src/
    ├── index.ts          Root public entry — components + `tokens` namespace
    ├── playground.ts     Subpath entry for the doc app
    ├── DesignSystemPlayground.tsx
    ├── components/       The 22 shipped primitives (PUBLIC)
    ├── tokens/           Three-layer token system (PUBLIC via /tokens + /styles)
    ├── hooks/            Cross-component hooks (INTERNAL)
    ├── layouts/          Playground chrome — Shell, Sidebar, PageHeader (INTERNAL)
    ├── utils/            Playground helpers (INTERNAL)
    ├── foundations/      Playground content — foundation doc pages (INTERNAL)
    ├── patterns/         Playground content — pattern doc pages (INTERNAL)
    ├── docs/             Playground content — component doc pages + registry (INTERNAL)
    └── types/            Ambient type declarations (INTERNAL)
```

### Responsibilities

- **`src/components/`** — The shipped surface. One folder per component (`button/`, `dialog/`, etc.). Each folder is self-contained and consumes only tokens + optionally other components. This is the ONLY folder that a product should ever transitively import from.

- **`src/tokens/`** — The three-tier token system (`primitives/`, `aliases/`, `components/`), the CSS bridge (`css/variables.css`), and shared token types. Consumers reach it two ways: via the `tokens` namespace on the root export, or via the `@hc1/design-system/tokens` subpath.

- **`src/hooks/`** — Internal hooks used by playground/docs (`useActiveSection`). Not exported publicly. A hook is only promoted to public export when a shipping product proves it needs the hook AND the hook is truly generic. Do not promote a hook because it "might be useful."

- **`src/layouts/`** — The playground's own shell (`Shell`, `Sidebar`, `SidebarLink`, `PageHeader`, `SectionHeader`, `ComingSoonCard`). These render the doc site — not products. Products never import from here.

- **`src/utils/`** — Playground utilities (`scrollToSection`, `categories`, doc types). Same rule as `layouts/`: not public, not for products.

- **`src/foundations/` and `src/patterns/`** — Content for the doc site. Foundation pages document tokens (colours, spacing, motion); pattern pages document compositions. Neither ships any runtime primitive; they are page components.

- **`src/docs/`** — Component doc pages (`ButtonDoc.tsx`, `DialogDoc.tsx`, etc.) and the `registry.ts` that wires them into the playground sidebar. Every shipped component has exactly one doc file here.

- **`src/types/`** — Ambient type declarations that don't belong to any single file (e.g. `env.d.ts` for `import.meta.env`).

- **`src/index.ts` and `src/playground.ts`** — The two public entry files. Their `import.d.ts` shape is the contract to consumers. Any change here is a semver-relevant change.

### What is deliberately NOT in this repo

- No `dist/` folder — see §4 (source-only distribution).
- No `scripts/` — no code-gen, no build pipeline. If it needs to be scripted, it is a smell.
- No `tests/` folder as a first-class discipline — see §11 (testing strategy).
- No product-specific folders. `clinicaliq/`, `sourceiq/`, `hercare/` would violate the whole point.

---

## 3. Architectural Layers

Six layers, strictly ordered. **Higher layers may depend on lower layers only. Never the reverse. Never skipping.**

```
  Applications              ← ClinicalIQ, SourceIQ, HerCare screens
       ↓
  Business Components       ← product-owned (WorklistTable, EvidenceBox, TRSGauge)
       ↓
  HC1 Components            ← src/components/ — Button, Dialog, Table, …
       ↓
  Component Tokens          ← src/tokens/components/ — button.paddingX, card.radius
       ↓
  Semantic Tokens           ← src/tokens/aliases/ — text.primary, bg.default
       ↓
  Primitive Tokens          ← src/tokens/primitives/ — neutral[500], spacing[16]
```

### Layer contracts

| Layer | May consume | May NOT consume |
|---|---|---|
| Applications | Business Components, HC1 Components, Semantic Tokens (rare) | Primitive Tokens (never), Component Tokens (never) |
| Business Components | HC1 Components, Semantic Tokens | Primitive Tokens (never) |
| HC1 Components | Component Tokens, Semantic Tokens (for cross-component values), other HC1 Components | Business Components (ever), Primitive Tokens (never), Applications |
| Component Tokens | Semantic Tokens | Primitive Tokens (never), other component tokens (avoid circular refs) |
| Semantic Tokens | Primitive Tokens | Component Tokens (never), other semantics (avoid chains) |
| Primitive Tokens | Nothing | Anything |

### Forbidden dependencies (review blockers)

1. **HC1 Component imports Business Component.** Would make the DS depend on a product. Kills reusability across products.
2. **Any layer imports a Primitive Token directly (other than an alias file).** Would tie the layer to a raw value and defeat the whole aliasing purpose. Enforced by convention today; a lint rule can enforce it mechanically once we run out of will.
3. **A Semantic Token imports a Component Token.** Inverts the dependency direction. Semantics are the vocabulary; components consume that vocabulary. Reversing this creates a loop.
4. **A Component Token imports another Component Token.** One accidental exception exists — some components legitimately share sizing (Switch reuses Checkbox row heights so mixed forms stack flush). When you do this, use a direct reference, document the coupling in the component-token file's comment header, and get a review from someone who has read this document.
5. **Skipping layers.** A component reaching directly for a primitive because "it's just one colour" collapses the whole abstraction. When you feel the urge, the correct fix is to add a semantic alias or a component token, then consume that.

### Why the strict ordering matters

The DS survives brand pivots, dark mode, density modes, and product growth **because** the layers can evolve independently. If Applications imported Primitives directly, a brand change would require touching every screen in every product. Because they don't, a brand change is a token-file edit; every layer above it inherits the new values on the next reload. Every "quick shortcut" that bypasses a layer permanently forfeits that property.

---

## 4. Public API

### The contract

Consumers import from exactly one of these paths. Everything else is internal and not covered by semver.

| Import path | Contents | Backed by |
|---|---|---|
| `@hc1/design-system` | All 22 components + `tokens` namespace | `src/index.ts` |
| `@hc1/design-system/tokens` | `primitives`, `aliases`, component tokens, token types | `src/tokens/index.ts` |
| `@hc1/design-system/styles` | The CSS variables bridge (`--hc-*` custom properties) | `src/tokens/css/variables.css` |
| `@hc1/design-system/playground` | The dev-mode documentation app | `src/playground.ts` |
| `@hc1/design-system/package.json` | Package metadata | `package.json` |

Enforced by the `exports` field in `package.json`. Any other path — `@hc1/design-system/hooks`, `@hc1/design-system/components/button/Button`, `@hc1/design-system/layouts` — is a broken import at consume time, by design.

### Distribution model

**Source-only.** The `main` / `module` / `exports` targets point at `.ts` / `.tsx` files, not at a compiled `dist/`. Consumers' bundlers (Vite today, Next.js / Webpack tomorrow) compile the TypeScript + JSX themselves. Chosen because:

- Every current and planned consumer already runs a TS-capable bundler; a `dist/` step would duplicate their work.
- Source maps stay honest — every stack trace points at the actual `.tsx` file.
- Iteration speed is bounded only by the consumer's HMR, not by a rebuild-the-DS step.
- One less pipeline to maintain during the pre-1.0 stabilization window.

**When to reconsider:** the moment we have a consumer that cannot compile TypeScript (a plain-JS CDN embed, a legacy Webpack 4 setup without loaders), we add a `dist/` alongside — we do not migrate away from source-only.

### Deep imports are forbidden

`import { Shell } from "@hc1/design-system/layouts"` — blocked by the `exports` map. Do not attempt to add a workaround. If a consumer legitimately needs something that is currently internal, the correct path is:

1. Open a proposal (issue / PR).
2. Confirm at least two products need it.
3. Promote the file into the public surface (add to `src/index.ts` OR add a new subpath entry in `package.json`).
4. Ship a minor version.

Consumers must never reach past the `exports` map. Bundlers that resolve outside the map (via `paths`, `alias`, or `@fs/`) at consume time are cheating; do not encourage that in ClinicalIQ or SourceIQ configs.

---

## 5. Internal Architecture

These are implementation details. Consumers do not import them, do not depend on them, do not observe them. They exist because certain concerns — overlays, focus, positioning — are hard to get right once and impossible to get right if every component reinvents them.

### Overlay infrastructure

Dialog, Drawer, Popover, Tooltip each mount a floating surface. To keep them consistent:

- **Portal.** `createPortal(node, document.body)` in every case so the surface escapes `overflow: hidden` ancestors and z-index gymnastics.
- **Scroll lock.** Dialog, Drawer, and modal-mode Popover each maintain a module-scoped counter (`lockBodyScroll` / `unlockBodyScroll`). Multiple stacked overlays cooperate: last close wins, restores original overflow. Counters are duplicated per file (not centralized) so nested overlays don't accidentally share state — a deliberate simplification, revisited if a real bug appears.
- **Focus trap.** Same `getFocusable(container)` selector list used across Dialog, Drawer, and modal Popover. `Tab` / `Shift+Tab` wrap within the surface.
- **Focus restoration.** On close, focus returns to the element that opened the overlay. Deferred with `setTimeout(..., 0)` so the browser's own blur doesn't fight us.
- **Escape to close.** `document.addEventListener("keydown", ...)` while open; `event.stopPropagation()` so a Dialog above doesn't also close a nested Popover.

**Consumer contract:** none of the above is observable. Consumers get "the panel opens and closes and focus does the right thing." Do not export any of these helpers.

### Positioning infrastructure

Tooltip and Popover both float against a trigger. Both use the same shape:

- `computePosition(triggerRect, panelRect, arrowSize, offset, placement)` — pure function per component today. When Combobox / Dropdown / Menu ship, the plan is to extract a shared `_positioning` module. Do not extract prematurely — the two current copies are close enough to see the abstraction but the abstraction is not yet paid for.
- Runs in `useLayoutEffect` on open and on scroll/resize while open.
- Content mounts `visibility: hidden` until first measurement to avoid the 0,0 flash.
- Clamps to viewport with 8px `VIEWPORT_PADDING`.
- Arrow position is inline-styled per placement, clamped inside the panel.

**Divergence between Tooltip and Popover:** placement preference (`auto` picks top-first for Tooltip, bottom-first for Popover), focus (Tooltip is never focused, Popover always gains focus on open). Positioning geometry is identical.

### Field infrastructure

Input, Textarea, Select share a wrapper pattern:

- `<div.hc-input-field>` → `<label>` + `<div.hc-input>` (frame) + footer (helper / message / counter).
- The frame is the `focus-within` container that paints the 2px brand ring on the outside — no layout shift.
- Native `<input>` / `<textarea>` / `<select>` at the heart — IME composition, autofill, form submission, spellcheck, native validation all inherited free.
- Validation cascade: `errorMessage > warningMessage > successMessage > validation` prop.

**Why the wrapper:** the frame lets us paint focus, error borders, hover states without affecting layout. Native inputs alone can't compose all of these without collision.

### Selection infrastructure

Checkbox, Radio, Switch share:

- Row heights `28 / 36 / 44` for `sm / md / lg` sizes. Mixed forms stack flush.
- Same state palette (empty, filled, hover, focus, disabled, invalid, required, loading).
- Same click-anywhere-on-the-row-toggles pattern — the whole row is a `<label>`.
- Same native `<input type="checkbox">` / `<input type="radio">` at the heart, absolutely positioned + opacity 0 over the visible control, so pointer + focus land on the real element.

Radio is the only one that groups (`RadioGroup`); Checkbox and Switch are always singular.

### Focus management

One brand ring across the whole system: 2px outline in `--hc-focus-ring` colour, 2px `outline-offset`, painted via `:focus-visible` (never plain `:focus`). Same ring on Button, Input, Card, Checkbox, Radio, Switch, Dialog, Drawer, Tabs, Breadcrumb, Popover. If you find yourself painting a different focus style, stop — the visual family loses coherence.

### Validation

Fields (Input, Textarea, Select) share the validation model documented above. Native `aria-invalid` + `role="alert"` on the error message so assistive tech announces the moment the state flips. Warning and success use `role="status"` (polite, not assertive).

### Motion

- Duration primitives: `150ms` (`fast`), `250ms` (`base`), `350ms` (`slow`). Nothing in HC1 animates longer than 350ms.
- Easing primitives: `standard` for two-sided moves, `entrance` for coming-in, `exit` for going-out, `linear` for spinners.
- Every `transition` respects `prefers-reduced-motion: reduce` — collapses to 0ms but preserves the state change.

### Positioning z-index tiers

Documented in `variables.css`, referenced by name never number:

- `--hc-z-tooltip` = 50
- `--hc-z-popover` = 40
- `--hc-z-modal-scrim` = 60
- `--hc-z-modal` = 70

Do not invent new z-index values. If you need a new tier, add it here and use it by name.

**Rule for all of the above:** these are implementation details, not public API. Consumers must never depend on them by import, by CSS class name, by z-index value, or by focus-order behaviour beyond what the component documents.

---

## 6. Token Architecture

Three tiers, one direction of dependency, one bridge into CSS.

```
  Primitive Tokens           src/tokens/primitives/
        ↓
  Semantic Tokens            src/tokens/aliases/
        ↓
  Component Tokens           src/tokens/components/
        ↓
  Components                 src/components/
```

### Primitives (`src/tokens/primitives/`)

Raw source-of-truth values. `neutral[500]` is a hex string, `spacing[16]` is `"16px"`. One file per category (`colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts`, `elevation.ts`, `motion.ts`, `opacity.ts`, `breakpoints.ts`, `z-index.ts`). All `as const`.

**Consumers never import primitives directly** — only the alias layer may. This is the rule that lets us swap a brand palette (or add a dark mode) with zero component changes. Enforce by inspection at review; a component file that imports from `tokens/primitives/*` is a review blocker.

### Aliases (`src/tokens/aliases/`)

Semantic role names. `text.primary`, `bg.default`, `border.strong`, `spacing.stack.md`, `radius.control`, `motion.hoverIn`. Every alias references a primitive, never another alias (avoid resolution chains — one hop is enough).

**Consumers of aliases:** cross-component values, most component-token files, and rarely a product screen that needs a shared value (e.g., a custom card wants the same `border.subtle` as everything else).

### Component Tokens (`src/tokens/components/`)

One file per HC1 component (`button.ts`, `card.ts`, `dialog.ts`, …). Each declares a values-only object: `{ paddingX: {...}, radius: ..., text: {...} }`. Every value references an alias — never a primitive.

**When to add a component token vs use an alias directly:**

- Use the alias in the component code if the value is shared with the rest of the system and moves together with it (e.g., `spacing.stack.md` — a common gap).
- Add a component token if the value is component-specific and should be tweakable in isolation (e.g., `button.paddingX.md` — Button's padding, orthogonal to everything else).

Component tokens are also where component-shared coupling is expressed intentionally. Example: `switch.ts` imports `checkbox.ts` to reuse row heights, so a mixed form of Switch + Checkbox always stacks flush. When you do this, document the coupling at the top of the file so a future contributor doesn't accidentally decouple them.

### The CSS bridge (`src/tokens/css/variables.css`)

Every token that a component's CSS might need appears here as a `--hc-*` custom property. `variables.css` is imported once at consumer app entry via `import "@hc1/design-system/styles"`. That defines every variable at `:root`.

**Why CSS variables in addition to TS exports:**

- Runtime theming — change a `<html>` class → shift the whole system without a rebuild.
- Non-JS consumers — plain CSS, arbitrary Tailwind values, DevTools inspection.
- Debugging — a designer can twiddle a value in DevTools and see the effect instantly.

**Why TS exports in addition to CSS variables:**

- Recharts, canvas, and any library that needs a literal string.
- Type-safe access with autocomplete.
- Runtime calculations (interpolated colours, computed spacing).

The two forms are kept synchronized by convention: adding a new token means both an entry in the primitive/alias file *and* a matching CSS variable in `variables.css`. This synchronization is not currently automated. If it drifts, ship the automation as a codegen step from `tokens/*` into `variables.css`.

### Why every component never consumes primitives directly

If `Button.tsx` wrote `background: neutral[900]`, a brand shift to a warmer neutral would require touching every component that referenced `neutral[900]`. Because `Button.tsx` writes `background: var(--hc-button-fg-primary)` (which resolves to `text.primary` which resolves to `neutral[900]`), a brand shift is a single edit in `aliases/color.ts`, and Button — and every other component — moves with it, unchanged.

This is the whole point of the token architecture. Any component that skips the layers loses this property for the entire system, because now the brand shift is a partial fix, and product regressions ensue.

---

## 7. Component Architecture

### Preferred file layout

Every component in `src/components/<name>/` follows the same four-file convention:

```
src/components/button/
├── Button.tsx        Runtime component (default export or named)
├── Button.types.ts   Public prop types + sub-component types
├── Button.css        Colocated styles, all values via var(--hc-*)
└── index.ts          Barrel — re-exports the public API of this component
```

**Why exactly this shape:**

- **`.tsx` alone would grow past 500 lines** for compound components and become unreadable. Splitting types off is the smallest useful decomposition.
- **`.types.ts` allows other files to import prop types** without importing the runtime (helpful for docs and adjacent components).
- **`.css` colocated with the component** so tokens and rules live where the developer expects them. No cross-file style diving.
- **`index.ts` as a barrel** means downstream imports point at `./button` (the folder), never at a specific file, which lets the internal file layout evolve without breaking anything.

Do not deviate. A component with `Button.tsx` and a scattered `styles/button.module.css` and a `types.ts` at the wrong level is not permissible — reformat before merging.

### Compound components

Multi-part primitives (Dialog, Drawer, Popover, Tooltip, Tabs, Breadcrumb, Textarea, Table) expose a root component with attached static sub-components:

```tsx
<Dialog>
  <Dialog.Trigger>{...}</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>...</Dialog.Title>
    <Dialog.Description>...</Dialog.Description>
    <Dialog.Close>Close</Dialog.Close>
  </Dialog.Content>
</Dialog>
```

Sub-components are attached as namespaced statics (`Dialog.Trigger = DialogTrigger`), not exported as separate top-level names. The pattern makes the composition self-documenting at the call site and prevents accidental cross-use (`Dialog.Trigger` outside a `Dialog` is a compile-time misuse).

**Every compound API is minimal.** Ship the smallest set of sub-components that compose the primitive; add more only when a real consumer proves a gap. `Popover` ships four sub-components (Trigger, Content, Arrow, Close) — not eight. `Breadcrumb` ships five (List, Item, Link, Separator, Current) — not ten.

### Shorthand + composition

Where the same DOM can be produced two ways, the component ships both:

- **Shorthand prop** for the common data-driven case: `<Breadcrumb items={[...]} />`.
- **Composed children** for the flexible case: `<Breadcrumb><Breadcrumb.List>...</Breadcrumb.List></Breadcrumb>`.

Both render the same DOM. Composed children win when both are supplied. This is Card, EmptyState, Alert, Textarea, and Breadcrumb's pattern today. Adopt it for any new component whose "common case" is 90% of usage — otherwise the compound API alone is fine.

### Composition over configuration

**Bad:** `<Card variant="withHeader" hasFooter={true} sidebar={true} />`.

**Good:** `<Card><Card.Header>...</Card.Header><Card.Body>...</Card.Body><Card.Footer>...</Card.Footer></Card>`.

The configuration approach breeds a matrix of allowed/forbidden prop combinations that the component has to validate at runtime. The composition approach lets the consumer arrange the pieces they need; the primitive stays flat. Every time you catch yourself adding a boolean prop to switch on a piece of DOM, ask: *would a sub-component be cleaner?*

Config props remain acceptable for **behaviour** (a Button has a `variant`, an Input has a `size`, a Dialog has `modal`). Config props are the wrong tool for **structure**. If the prop toggles the presence of a DOM element, it should be a sub-component instead.

### `forwardRef` and refs

Every component that renders a single primary DOM element exposes a ref to that element via `forwardRef`. Compound roots (`Dialog`, `Popover`) don't need a ref to the root. Wrappers used as trigger children (`Dialog.Trigger`'s child, `Popover.Trigger`'s child) MUST be `forwardRef` components — the trigger uses `cloneElement` to attach event handlers and ARIA, which silently fails on non-`forwardRef` function components. Document this in the doc file whenever it applies.

---

## 8. Accessibility Architecture

### Native HTML first

Every interactive component wraps a native element:

- Button → `<button>`
- Input → `<input>`
- Textarea → `<textarea>`
- Select → `<select>` (or `<button>` + Popover for custom)
- Checkbox / Radio / Switch → `<input type="checkbox" | radio">`
- Dialog Trigger / Popover Trigger → `<button>` (via `cloneElement` on a real child)
- Breadcrumb Link → `<a href>` (swaps to `<span aria-disabled>` when disabled)

Consequences: form submission, browser autofill, keyboard behaviour, focus management, and screen-reader announcement come for free. Reimplementing any of these on a `<div>` is a review blocker.

### ARIA only when necessary

- Never `role="button"` on a real `<button>`.
- Never `aria-label` when the visible text is already the label.
- Do use `role="dialog"`, `role="alert"`, `role="status"`, `role="switch"`, `role="tooltip"` where the DOM does not natively express the widget.
- Do use `aria-modal="true"` on modal Dialogs and modal Popovers.
- Do use `aria-current="page"` on the current Breadcrumb crumb.
- Do use `aria-describedby` composed from any live description, helper, or error ids on form fields.

Over-ARIA is worse than under-ARIA because it lies to assistive tech.

### Visible focus

`:focus-visible` — never plain `:focus`. 2px outline in the brand ring colour with 2px `outline-offset`. Consistent across every focusable component in the system. If a new component paints a different focus style, the visual family breaks — reject.

### Keyboard support

- Tab / Shift+Tab move focus.
- Enter / Space activate buttons and checkboxes.
- Arrow keys navigate composite widgets (Radio groups, Tabs, Menus, Toolbars).
- Escape closes Dialog / Drawer / Popover / Tooltip.
- Home / End jump within composite widgets where appropriate.
- No keyboard shortcut that shadows a browser default (`Cmd+F`, `Cmd+R`, `Ctrl+A` inside text) unless the shadowing is standard for the widget.

Every component's doc file has a Keyboard section that lists exactly which keys do what. If the section is empty, the component is not shipped.

### Reduced motion

Every `@keyframes` and every `transition` respects `@media (prefers-reduced-motion: reduce)`. The rule: collapse the timing to 0 (or a very small `1ms` for CSS engines that need a non-zero) but keep the state change visible. Do NOT hide the animation entirely — the user still needs to see that something opened, closed, or updated.

### Accessibility verification

Each component's doc page renders every state. The playground probe (see §11) asserts:

- ARIA roles present.
- Focus visibly moves when tabbed.
- Keyboard interactions work.
- Loading has `aria-busy`.
- Disabled has native `disabled` (or `aria-disabled`).
- Error messages carry `role="alert"`.

If any assertion fails, the component doesn't ship. Accessibility is not a follow-up PR.

---

## 9. Styling Architecture

### CSS custom properties are the runtime interface

Every visual value that a component's CSS reads is a `var(--hc-*)`. Never a literal.

```css
/* correct */
.hc-button {
  background: var(--hc-button-bg-primary);
  padding: var(--hc-button-pad-y-md) var(--hc-button-pad-x-md);
  border-radius: var(--hc-radius-control);
}

/* forbidden */
.hc-button {
  background: #0D7782;
  padding: 8px 16px;
  border-radius: 8px;
}
```

`variables.css` defines every custom property at `:root`. Consumers import that file once at app entry.

### Component CSS conventions

- One `.css` file per component, colocated (`src/components/button/Button.css`).
- Class names are BEM-flavoured with an `hc-` prefix: `.hc-button`, `.hc-button--primary`, `.hc-button__icon`. The prefix keeps HC1 out of the consumer's CSS namespace.
- `data-*` attributes for state hooks that tests may want to assert (`data-state="open"`, `data-side="top"`). Never rely on class names for tests; classes are visual-implementation details.
- No `@apply`, no CSS-in-JS, no CSS Modules. Plain CSS files, plain class names.

### Design tokens

Consumed via `var(--hc-*)` as above. See §6 for the layering.

### Motion tokens

Duration + easing are primitives (`150ms`, `250ms`, `350ms`; `standard`, `entrance`, `exit`, `linear`) surfaced as CSS variables (`--hc-duration-fast`, `--hc-easing-standard`, etc.). Every transition:

```css
.hc-panel {
  transition:
    opacity var(--hc-duration-base) var(--hc-easing-entrance),
    transform var(--hc-duration-base) var(--hc-easing-entrance);
}
```

Do not inline a `250ms` string. Do not invent a new duration.

### Typography

- Sizes: 12, 14, 16, 18, 20, 24, 32. No 11 / 13 / 15. Even-numbered only.
- Weights: 400, 500, 600, 700. No 300 / 350 / 550 / 800.
- Line-height: 1.4–1.5 body, 1.2–1.3 titles.
- Numbers use `font-variant-numeric: tabular-nums` (or the `tabular-nums-hc1` utility).

Consumed via `var(--hc-typography-*)` families. The primitive typography file (`tokens/primitives/typography.ts`) declares complete text styles as tuples of size + weight + line-height + tracking; components consume the tuple, not the individual axes.

### Spacing

Every margin, padding, and gap: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`. Off-scale values in a PR are a review blocker.

### Radius

Six named radii: `none (0)`, `chip (4)`, `control (8)`, `surface (12)`, `hero (16)`, `circular (9999)`. Do not invent a new value; round to the nearest existing one. If you truly need a new tier, add it to the primitive file first and use the name.

### Elevation

Five elevation tiers: `flat`, `card`, `popover`, `modal`, `overlay`. Each maps to a specific shadow spec. Components reference the tier by name, never the shadow spec directly.

### Why hardcoded values are forbidden

A single `#0D7782` in a component file forfeits the entire ability to repaint the brand from one place. A single `padding: 15px` forfeits the ability to shift the spacing rhythm globally. A single `250ms` inline forfeits the ability to tune the motion system.

Any "temporary" hardcoded value that lives past the PR window becomes permanent. Enforce at review; the answer to "just this one value" is always no.

---

## 10. Documentation Architecture

Every HC1 component ships with a single doc file at `src/docs/components/<Name>Doc.tsx`. Every doc file uses the same 10 sections in the same order.

### Required sections

1. **Purpose** — one paragraph. What problem the component solves. Not what it looks like — what it *does*.
2. **Anatomy** — labelled diagram of the DOM shape. Which element is the root, which is the trigger, which is the content.
3. **Accessibility** — ARIA roles, keyboard shortcuts, focus behaviour, non-visual state, contrast notes. If any of these is empty, the component is not shipped.
4. **Playground** — interactive controls for every prop. Real live component, not a screenshot.
5. **Real-world examples** — at least three examples drawn from actual product scenarios. Not "here is a button with the word Button."
6. **Props** — one table per sub-component. Type, default, description. Generated by hand today; a codegen step from `.types.ts` is a future TODO.
7. **Tokens used** — a list of every component token and every semantic alias the component reads. Helps a maintainer trace visual changes back to source.
8. **Migration targets** — named consumers in existing products this component replaces. Which legacy file, which product. Empty for the first release, populated during migration.
9. **Implementation notes** — architectural decisions: portal usage, focus management, reused infrastructure. Useful for a future maintainer chasing a subtle bug.
10. **Component status** — checklist (Design tokens, Accessibility, Documentation, Playground, Examples, Migration guidance, Verification, Zero hardcoded values, Production readiness, Version). Every box checked means the component is complete per §16 of `FOUNDATION.md`.

### Why every component follows the same structure

- **A product engineer previewing a component knows exactly where to look.** Accessibility notes are always at position 3, not scattered.
- **Reviewers can grep for missing sections.** A doc with fewer than 10 sections is incomplete; a script can flag this in CI.
- **The playground sidebar renders section links from the file itself** — so consistent sectioning keeps the sidebar navigable.
- **New contributors have a fill-in-the-blank template.** No blank page.

Template lives at `src/docs/templates/` for copy-paste when starting a new component doc.

### Where docs are wired

`src/docs/registry.ts` — one `SECTIONS` array entry per component, keyed by id (`{ id: "button", label: "Button", category: "components" }`). The playground reads this registry to render the sidebar and the routing.

`src/docs/components/index.ts` — barrel that exports every component doc file so the registry can import them by name.

Adding a doc means: create the `.tsx` file, add to the barrel, add the SECTIONS entry. Three edits. Miss any one and the component is invisible in the playground.

---

## 11. Testing Strategy

HC1 does not have a traditional unit-test suite. It has three verification layers that catch different classes of bugs.

### Layer 1 — Type checking

```
npm run typecheck
```

Runs `tsc --noEmit` against every file in `src/`. Must exit 0 before merge. `strict: true` is enforced; no `any` without a comment, no `@ts-expect-error` without a linked bug.

**What this catches:** wrong prop types, missing return types, type drift between components and their `.types.ts` files, incorrect token references.

**What this misses:** anything that only shows up at runtime — DOM shape, event handlers, motion, focus, ARIA.

### Layer 2 — Build verification

```
# In the consumer project (ClinicalIQ):
npx vite build
```

Compiles the DS as part of a consumer's build. Must succeed cleanly (warnings acceptable, errors not).

**What this catches:** broken imports, missing files, circular deps, resolution errors that TS misses because it doesn't emit.

**What this misses:** everything the type checker misses.

### Layer 3 — Playground verification (headless probe)

For any material component change, spin the dev server (port 5180 for ClinicalIQ) and hit the component's playground URL (`http://localhost:5180/design-system#<component-id>`) with a headless Playwright script. Assert:

- The section renders.
- Every documented state paints (find the `data-state` selectors).
- Every ARIA attribute is present where the doc claims it is.
- Focus visibly moves on `Tab`.
- Interactive controls actually toggle state.
- Zero console errors.

**Why probe the playground instead of writing unit tests per component:** the playground IS the source of truth for how each component should render. If the playground doesn't reflect reality, the doc is lying and the component is broken. The probe verifies both at once. Unit tests would test a fixture, which drifts.

**Cadence:** one probe per component per major change. Not per commit — that would slow iteration. The probe lives as a script per component under `src/docs/components/_probes/` (this convention is aspirational — see also §14).

### Layer 4 — Accessibility verification

Bundled into the playground probe. Assert ARIA roles, `aria-busy`, `aria-invalid`, `role="alert"`, keyboard interactions, focus management. Same script; different assertions.

No separate axe-core run today because our components consume native HTML for the vast majority of ARIA; a global axe pass yields low signal. If ClinicalIQ or SourceIQ needs an audit-friendly signal, run axe over the built application, not over the DS in isolation.

### Layer 5 — Manual review

For visual changes, load the playground in a real browser and eyeball. Contrast, spacing rhythm, motion feel. This layer is not automated and is not going away.

### Future: visual regression

Percy / Chromatic / Argos / Playwright snapshots — one of these will land once the DS is stable enough that snapshots hold across weeks. Not before 1.0; snapshots taken during the pre-1.0 API churn would generate more noise than signal.

### What we do NOT do

- No Jest unit tests per component. The tree of "test-a-render, assert-DOM" tests duplicates what the playground probe already does.
- No component-level Storybook — we have a purpose-built playground.
- No visual regression today (see above).
- No enzyme, no react-testing-library as first-class. If a specific component has a computed helper that warrants a pure unit test (a positioning function, a validation cascade), write a small `.test.ts` colocated. Do not build a suite.

---

## 12. Versioning Strategy

### 0.x — pre-adoption

The DS is currently at **0.9.0**. Any 0.9.x → 0.9.y bump may break the public API. Consumers pin exact versions during this window.

**We stay on 0.x until all four gates clear:**

1. ClinicalIQ is fully migrated onto `@hc1/design-system`.
2. SourceIQ is fully migrated onto `@hc1/design-system`.
3. The legacy design systems inside both products are removed.
4. The public API has survived at least one round of adoption without a breaking change.

**Why:** semver is a promise to consumers. Making that promise before real adoption tests the API means either (a) we break the promise and shake consumer trust, or (b) we ship the wrong shape and become locked into it. Neither is acceptable. Wait until the API has been exercised.

### 1.0 — first stable release

Cut when all four gates above are clear. Ship a `CHANGELOG.md` entry summarizing what was tested during pre-1.0 and what the semver contract is going forward. At this point the exports map, the token layer names, and every public prop become semver-relevant.

### Post-1.0 — semver strictly

- **Patch** (`1.0.1`) — bug fix, doc update, internal refactor, no observable change to consumers. If a consumer running `npm install` and rebuilding gets a different visual output, this is not a patch.
- **Minor** (`1.1.0`) — additive change: new component, new prop with a sensible default, new token, new subpath entry. Existing consumers keep working with no changes.
- **Major** (`2.0.0`) — breaking change: removed component, removed prop, renamed prop, changed prop type, moved subpath, removed token, changed token value in a way that shifts pixel output.

### Special cases

- **Token value changes.** A hex change or a spacing jump that visually shifts a shipped screen is a major. A colour tweak that changes only invisible-in-practice values (a rarely used tint) may be a minor with a CHANGELOG note. When in doubt, treat as major.
- **Adding a required prop.** Effectively removes the ability to render the component without the prop — major.
- **Changing default prop value.** Major, because it may shift visual output. If the intent is truly to shift the default (e.g., because the old default was wrong), name it in the changelog explicitly.
- **CSS class name changes.** `.hc-button--primary` renamed to `.hc-btn--primary` is major, because consumers may have specificity-hooked into it. Even though we tell them not to.
- **CSS variable rename or removal.** Major.

### Release process

Every merged PR that touches `src/` updates `CHANGELOG.md` in the same commit. When enough entries accumulate:

1. Update the `[Unreleased]` heading to a real version.
2. Bump `package.json`.
3. Tag the commit.
4. Announce to consuming teams (once we have a real distribution channel — for now, direct comms).

### Why HC1 stays on 0.9.0

The four gates above are non-negotiable. 1.0.0 is not a marketing milestone; it is the moment consumers are entitled to trust semver. Until then the version signals "still in flux."

---

## 13. Migration Architecture

### Products consume HC1

Each product (ClinicalIQ, SourceIQ, HerCare) sets up its bundler to resolve `@hc1/design-system` to the shared package. In the current monorepo layout, this is a path alias to `../hc1-design-system/src`. Once we publish to a registry, it becomes a real dependency in `package.json`.

**One consumer contract, wherever the package lives.** Consumers write `import { Button } from "@hc1/design-system"` regardless of whether HC1 is a sibling folder, a local install, or an npm package. The whole point of the alias is to make that transition invisible.

### Products never fork HC1

If a product needs a variant of Button that HC1 doesn't ship:

1. Ask: does another HC1 product also need this? If not, wrap the existing Button locally inside the product (a `PublishButton` composed of `<Button variant="cta">` + a Dialog). Do NOT copy Button into the product to modify.
2. If two products need it, propose the change upstream. Ship in the DS. Adopt from both products.

**The wrong move** is: copy `Button.tsx` into the product, modify locally, ship. Within a month, the local Button and the HC1 Button have drifted. No one knows which is canonical. Bug fixes land in one, not the other. Design tweaks apply to some screens, not others. The design system dies.

Enforcement: each product's `CLAUDE.md` (and code review) explicitly forbids re-implementing any of the 22 shipped primitives. The alias path `@hc1/design-system/*` is the only sanctioned import.

### Business components stay inside products

A `WorklistTable` that shows patient columns is a ClinicalIQ business component. It lives inside `ClinicalIQ/src/clinicaliq/` (or wherever the product organizes its domain code), composed on top of the HC1 `<Table>`. HC1 never absorbs a business component. If two products need the same business component, revisit whether the shared shape is actually a *pattern* (which does belong in HC1) or a *coincidence* (which does not).

### Generic components belong in HC1

If a control, surface, or scaffold that at least two products need is missing, add it. The bar for entry is: (1) reusable, (2) not composable from existing pieces, (3) needed by at least two products, (4) not domain-specific. All four must be yes.

### Migration cadence

Products migrate incrementally, one screen at a time, one component at a time. There is no big-bang adoption. During migration:

- Legacy components are tagged `@deprecated` in place.
- A manifest at the product root (e.g. `ClinicalIQ/LEGACY_ARCHIVE.md`) tracks every legacy file and its HC1 replacement.
- Migration PRs touch product screens only, never the DS.

### When HC1 breaks

A breaking change forces every consuming product to migrate before the DS ships the new version. If the migration cost is too high, the change is not actually breaking — it is a new opt-in prop or a new component alongside the old one. We do not push breaking changes upstream and expect products to catch up async. Post-1.0, breaking changes are batched into major releases with a migration guide.

---

## 14. Future Evolution

The DS will grow. Growth is bounded by four rules.

### 1. Reuse existing infrastructure

Overlay, positioning, field, selection, focus — these are shared. When you build the next primitive that needs one of them, reuse; do not re-implement. Example: when `Dropdown Menu` ships, it will compose `Popover` (already positioning + portal + dismissal) plus a menu-specific keyboard model. It will NOT copy Popover's positioning code.

If the infrastructure needs to grow to accommodate the new component, grow the infrastructure — carefully, with all existing consumers considered. Do not fork it.

### 2. Never duplicate implementation

Two components with 80% shared code is a broken abstraction. The right move is to identify the shared 80% (usually an infrastructure module, sometimes a compound base component), extract it, and have both components consume it. This is exactly how Tooltip's positioning engine will become the shared `_positioning` module when the next floating primitive ships.

### 3. Extract shared behaviour deliberately

Do not extract prematurely. The rule of three: build the third similar thing before extracting. The first two implementations show you what "similar" actually means; the abstraction only pays off from the third onward. Extracting after the second implementation locks you into an abstraction that the third case breaks.

### 4. Keep public APIs stable

Adding is fine (see §12 minor). Removing, renaming, or changing shape is expensive — every consumer has to migrate. Do it only when the existing API is actively wrong, not because a new one seems nicer.

When you must break: batch multiple breaking changes into a single major release with a written migration guide. Do not sprinkle breaking changes across minor releases and blow up consumers with churn.

### 5. Build only when multiple products need a capability

Repeat from §14 of `FOUNDATION.md`, but bears repeating here: the entry bar is *two shipping consumers need this*. Not one. Not "would be nice." Speculative primitives are the leading cause of design-system bloat. If you can wait for the second consumer, wait.

---

## 15. Engineering Rules

Non-negotiable. Each rule is a review blocker. If you find yourself arguing against a rule in a PR, argue against it in a separate PR that also updates this document. Do not silently violate.

1. **No hardcoded values.** Every visual value goes through the token layer. No raw hex, no off-scale pixel, no unnamed duration. Grep for `#[0-9a-fA-F]{3,8}` in any `.tsx` or `.css` you author — should return zero hits inside `src/components/`.

2. **No deep imports.** Consumers import only from `@hc1/design-system`, `@hc1/design-system/tokens`, `@hc1/design-system/styles`, `@hc1/design-system/playground`. Inside the DS, use relative paths (`../tokens`, `../utils`) never `@hc1/design-system/*` self-imports.

3. **No duplicated primitives.** Before adding a new component, exhaust composition of existing ones. Before adding a new alias, check if one already means what you need. Duplicates are how the system drifts out of alignment with itself.

4. **No domain-specific components.** No file inside `src/components/` may reference a patient, order, specimen, lab, or any other domain noun. Domain concerns belong to products.

5. **Accessibility required.** Every component ships with keyboard support, ARIA roles, visible focus, contrast passing WCAG AA, reduced-motion respect. Missing any of these means the component is not shipped.

6. **Type safety required.** `npm run typecheck` exits 0 with `strict: true`. No `any` without a comment explaining why. No `@ts-expect-error` without a linked bug. No `// @ts-nocheck` ever.

7. **Playground required.** Every shipped component has a `<Name>Doc.tsx` file with 10 sections, registered in `src/docs/registry.ts`, reachable at `#<component-id>`. If it isn't in the playground, it isn't shipped.

8. **Documentation required.** Section 10's ten sections are mandatory. A doc missing sections is incomplete. A component change without a doc update is incomplete.

9. **Verification required.** `npm run typecheck` clean AND a consumer's `vite build` clean AND, for any material component change, a headless playground probe pass. All three; not one; not two.

10. **Compose, don't configure.** When you're about to add a boolean prop that toggles the presence of a DOM element, add a sub-component instead. When you're about to add `variant="withHeader"`, add `Component.Header`.

11. **`.tsx` + `.types.ts` + `.css` + `index.ts`.** Every component uses the four-file convention. Do not invent your own layout.

12. **`forwardRef` for trigger children.** Any wrapper used as a child of `Dialog.Trigger`, `Drawer.Trigger`, `Popover.Trigger`, or `Tooltip.Trigger` MUST be a `forwardRef` that spreads props to a real DOM element. Silent bug otherwise.

13. **Update the CHANGELOG in the same PR as the code change.** Not later. Not "before release." Same commit. If your PR touches `src/`, it touches `CHANGELOG.md`.

14. **Native HTML first.** A button is a `<button>`. A link is an `<a href>`. A form field is a native input. Never `<div onClick>` for interactive elements.

15. **No product forks of the DS.** The alias `@hc1/design-system/*` is the only sanctioned way to consume. Copying files into a product to modify locally is banned by the CLAUDE.md of every consuming product.

---

*Kept intentionally short. If this document doubles in length, it has become documentation-of-documentation and we've lost the thread — trim, do not expand. Anything not required to reason about the architecture belongs in a scoped README inside the folder it describes.*
