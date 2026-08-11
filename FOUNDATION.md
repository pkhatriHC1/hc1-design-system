# HC1 Foundation

The engineering and design constitution of HC1. This document does not describe *what* is in the design system — that is component documentation. It describes *how HC1 thinks* and *why the design system is shaped the way it is*. Every principle here is the reason a specific decision downstream was made. If you find yourself about to break one of these rules, either the rule is wrong (change it here first) or the decision is wrong (fix the decision).

Written for engineers and designers who will contribute to `@hc1/design-system` and to any HC1 IQ product that consumes it.

---

## 1. Purpose

HC1 builds clinical software. Clinicians open our products in the middle of a patient encounter, in a browser tab beside Epic, at 2am on a fifteen-inch laptop, in a hospital hallway with a tablet. They are already exhausted, already interrupted, already worried about the next patient. The interface is not a place for us to be interesting. It is a place to reduce, by a measurable amount, the cognitive load between "I have a clinical question" and "I have the answer."

Every IQ product — **ClinicalIQ**, **SourceIQ**, **HerCare**, and every future module — shares the same clinician, the same hospital environment, the same 2am. If two products in the same hospital look and behave differently, that difference costs the clinician time to reconcile. That cost compounds: one confusing badge across ten screens, ten decisions per hour, thousands of hours per year across a network of hospitals.

The HC1 Design System exists so that difference is impossible. One button. One badge. One dialog. One severity chip. One way to signal a critical value. Everywhere, forever. Products differ in domain and workflow — they never differ in the shape of a control.

The commercial version: if every product ships their own primitives, engineering spends its cycles rebuilding what already exists, quality regresses per team, and every clinician on-boarding has to learn each product from scratch. If products share, engineering spends its cycles on domain work, quality is set at the platform level, and once a clinician knows any HC1 product, they know the others.

**HC1 exists so clinicians spend zero mental energy on the interface. Every principle below serves that goal.**

---

## 2. Core Principles

These are not aspirations. Each one is invoked by name in code review to reject or accept a change. If a PR violates one, cite the number.

### 2.1 Consistency over creativity
Novelty is a cost paid by the user. When a component already exists, use it — even if a slightly different shape would fit your specific screen better. A design system that is 90% consistent is worse than one that is 100% consistent; the 10% of exceptions become the thing the eye has to constantly parse.

### 2.2 Composition over configuration
A component should do one thing well and be composable. `<Card>` renders a card. It does not have `variant="withHeader"`, `hasFooter={true}`, `sidebar={true}` — those are separate compositions the consumer arranges. When two use cases diverge by more than one prop, split into two components rather than growing a matrix of configuration.

### 2.3 Accessibility first
Every component is keyboard-operable, screen-reader-announced, and colour-contrast-compliant *before* it is visually refined. Not after. Not "in a future PR." A component that ships without a focus ring, without an ARIA role, without keyboard support, is not shipped — it is a draft. This is a hard gate at review.

### 2.4 Tokens before values
No raw hex, no arbitrary pixel padding, no unnamed duration. Every value in every component traces to a token. If a token does not yet exist for the value you need, add the token first, then use it. This is what makes brand pivots, dark mode, and density modes tractable rather than 3-month rewrites.

### 2.5 Business logic never belongs inside primitives
A `Button` does not know about patients, care plans, or lab values. A `Dialog` does not know about consent workflows. If your primitive contains the word "patient," "order," "specimen," or any other domain noun, it is not a primitive — it is a business component and belongs inside the product, not HC1.

### 2.6 Build only what multiple products need
The bar for entry into HC1 is not "would this be nice to reuse" — it is "do at least two shipping products need this and would they otherwise reinvent it." One-product needs stay in the product. Speculative primitives (built because they *might* be useful someday) are the leading cause of design-system bloat.

### 2.7 Never duplicate components
Two components that do 80% of the same job are worse than one that does the union. Before writing a new component, exhaust the option of composing or extending an existing one. Duplicate primitives are how design systems drift out of alignment with themselves.

---

## 3. Design Philosophy

Clinical software should feel:

- **Clear.** Every element on the screen has one interpretation. Ambiguity in a healthcare interface is a safety issue, not a design issue.
- **Calm.** No animation for the sake of delight. No colour to celebrate. No confetti. The interface should recede so the clinical judgment can happen in front of it.
- **Professional.** This is the tool a physician uses to make a decision about a person's life. It should look and feel like a scalpel, not a consumer app.
- **Predictable.** The same action produces the same visual result every time, on every screen. A "Generate Care Plan" button is the same colour, same variant, same size, in every module.
- **Low cognitive load.** The screen must be scannable in under two seconds. If the clinician has to slow down to parse the layout, we have already failed. Density, hierarchy, and rhythm exist to make scanning trivial.

What clinical software should not feel like: playful, expressive, opinionated, novel, brand-forward, delightful, or "modern." Those words describe consumer software. Our users are not consuming — they are working, at speed, under pressure. Every decision favours their throughput over our aesthetic self-expression.

---

## 4. Architecture

Six layers, strictly ordered. Each layer may only consume the layers above it. A violation of this ordering is a review blocker.

```
  Primitives         (raw values: color scales, spacing steps, radii)
      ↓
  Tokens             (semantic aliases: text.primary, bg.default)
      ↓
  Components         (Button, Card, Dialog — no domain knowledge)
      ↓
  Patterns           (compositions: Filters, Empty States, Toolbars)
      ↓
  Business components (Worklist, EvidenceBox, GaugeForTRS — product-owned)
      ↓
  Applications       (ClinicalIQ, SourceIQ, HerCare screens)
```

### Primitives
Raw source-of-truth values. `neutral[500]` is a hex string. `spacing[16]` is `"16px"`. Primitives have no meaning; they are the palette from which meaning is composed at the next layer. **Consumers never import primitives directly.** Only the alias layer may.

### Tokens
Semantic roles. `text.primary`, `bg.subtle`, `border.strong`, `spacing.stack.md`. These name *what a value is for*, not *what it looks like*. When the brand pivots or dark mode arrives, only this layer changes; every layer below it moves with it for free.

### Components
The 22 primitives shipped by HC1: Button, Input, Card, Dialog, etc. Each is generic across every product. A component never knows about a patient or a specimen; it knows about the mechanics of "click," "select," "reveal a panel."

### Patterns
Compositions of components solving a recurring UX problem. A Filters panel is a Popover containing Checkboxes and Buttons — the pattern documents how those pieces fit together, but each piece remains a plain component. Patterns live in the design system when the composition itself is shared across products (a Toolbar layout). If only one product needs the composition, it lives in the product.

### Business components
Product-scoped. `WorklistTable`, `EvidenceBox`, `GaugeForTRS`, `PatientCard`. These wrap HC1 primitives with domain knowledge. They live inside `ClinicalIQ/src/clinicaliq/`, `sourceIQ/src/sourceiq/`, etc. — never inside HC1. When two products need the same business component, we do not move it into HC1; we ask whether the shared behavior is actually a *pattern* (which does belong in HC1) or a *coincidence* (which does not).

### Applications
The product screens themselves. Compose business components + patterns + components + tokens. Never reach past any layer to grab a raw primitive.

**Why the strict ordering:** each rule of what-may-consume-what is what allows the layers to evolve independently. If Applications imported primitives directly, a brand change would require a full product regression. Because they don't, a brand change is a token-layer edit and every screen inherits it.

---

## 5. Token Philosophy

Three token tiers, one direction of dependency.

```
  Primitive Tokens        neutral[100..900], teal[100..700], spacing[0..128]
        ↓
  Semantic Tokens         bg.default, text.primary, spacing.stack.md
        ↓
  Component Tokens        button.paddingX.md, card.borderRadius
        ↓
  Components              consume component tokens (never primitives, rarely semantics)
```

### Why semantic aliases exist

If a `Button` component wrote `background: neutral[900]` directly, then repainting the brand to a warmer neutral would mean editing every component that referenced `neutral[900]`. Semantic aliases mean `Button` writes `background: text.primary` (or whatever the semantic role is). When the brand shifts, only the alias-to-primitive mapping changes — every component moves with it, unchanged.

Semantics also make intent readable. `text.primary` tells you the value is meant to be the primary reading colour. `neutral[900]` tells you nothing about intent, only about the palette position. Six months from now, when a designer asks "can we shift the primary reading colour a bit lighter?", the semantic aliases give you one place to change.

### Why component tokens exist

Some values are stable across many components (`spacing.stack.md` is one gap between stacked items, used everywhere). Some are component-specific (`button.paddingX.md` is the padding for a button, only). Component tokens wrap the common cases so that a button's padding can be tweaked without touching a shared spacing token that would ripple into unrelated components.

**Rule of thumb:** if two components would visually diverge from tweaking the value, use a component token. If they should move together, use a semantic alias.

### Where CSS variables fit

Every token is mirrored as a `--hc-*` CSS custom property in `src/tokens/css/variables.css`. Consumed via `import "@hc1/design-system/styles"` once at app entry. This gives us:

- Runtime theming (change a `<html>` class → shift the whole system).
- Non-JS consumers (Tailwind arbitrary values, Emotion, plain CSS).
- Debugging in DevTools without hunting through a TypeScript build.

TypeScript exports of the same tokens exist for Recharts, canvas rendering, and any case where a literal value is required.

---

## 6. Component Philosophy

### What belongs in HC1

- **A control** that at least two products would otherwise re-implement (Button, Input, Select, Checkbox).
- **A surface** that structures content the same way across products (Card, Dialog, Drawer, Popover, Table).
- **A signal** that communicates state uniformly (Alert, Badge, Toast, Skeleton).
- **A layout scaffold** shared across products' shells (Tabs, Breadcrumb, Pagination).

Every HC1 component is:
- Domain-agnostic. `<Table>` does not know it will render lab values; it only knows about columns, rows, sorting.
- Composable. Complex screens are assembled from primitives; primitives never grow to accommodate a specific screen.
- Overridable. Every visual value is a token; every prop has a sensible default; every consumer can extend by wrapping.

### What belongs in the product

- **Business components.** A `PatientRow` that renders a patient inside a `<Table>` is product-owned. A `TRSGauge` that renders a Total Recall Score inside a `<Gauge>` is product-owned. A `CarePlanStep` is product-owned.
- **Domain wrappers.** If ClinicalIQ needs a "Publish" button with a confirmation dialog and a specific colour, it composes `<Button variant="cta">` + `<Dialog>` inside the product — it does not push a `PublishButton` up into HC1.
- **One-product patterns.** A pattern that only ClinicalIQ needs is a ClinicalIQ file. When SourceIQ later needs the same shape, we lift it — after the second use case is real, never before.

### Examples

**Belongs in HC1:** A generic `<Table>` with sortable columns, expandable rows, sticky headers, and cell alignment options. Used by ClinicalIQ's worklist, SourceIQ's lab inventory, HerCare's OB roster.

**Does not belong in HC1:** A `<WorklistTable>` that shows patient columns (name, MRN, TRS score, care plan status). That is a ClinicalIQ business component composed on top of the HC1 `<Table>`.

**Belongs in HC1:** A generic `<StatusChip>` with severity variants (critical / high / medium / low / normal). Used to indicate any severity anywhere.

**Does not belong in HC1:** A `<TRSChip>` that reads a Total Recall Score and picks a severity. That composition — TRS score → severity → StatusChip — is domain logic and stays in ClinicalIQ.

---

## 7. Layout Philosophy

Three spacing rhythms, one scale.

### Inline
Horizontal breathing room within a single line: gap between an icon and its label, gap between two buttons in a row, gap between a metric and its unit. Small values: 4, 8, 12.

### Stack
Vertical breathing room between stacked items in a group: label above input, description below title, two rows in a list. Medium values: 8, 12, 16, 20.

### Section
Vertical breathing room between semantic sections of a page: header above content, content above footer, one panel above another. Large values: 24, 32, 40, 48, 64.

**Why three rhythms:** inline, stack, and section carry different weights of visual separation. Using the same value for all three collapses the visual hierarchy — a page becomes one flat wash of even spacing instead of a scannable structure. Using different values for each communicates *how related* two elements are without any additional visual chrome.

**The scale:** every spacing value in every screen is one of `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`. Off-scale values (7px, 13px, 18px) are review blockers. If a design mock has 15px, the fix is to round to 16 (or 12), not to add 15 to the scale.

---

## 8. Color Philosophy

**Colour communicates meaning. It is never decoration.**

If a screen has an orange badge, the badge is signalling *execute / irreversible / caution*. If a screen has red, something is critical. If a screen has teal, that is the primary action. If a screen has green, something succeeded or is normal.

Colour categories:

- **Primary** (teal) — the action the user is expected to take. There is at most one primary action per view.
- **Secondary** (violet, muted greys) — supporting actions, secondary emphasis, chrome.
- **Neutral** (greys) — text, borders, backgrounds. The vast majority of every screen is neutral.
- **Status** (red, amber, yellow, green) — severity, feedback, state. Every use of a status colour must correspond to a real state; never use red because "this looks like an important spot," only because the state is critical.

**The AI gradient** (violet-to-teal on the `IntelligenceHeader`) is reserved for moments where the product is showing a clinician a genuine AI-generated result — a suggested care plan, an anomaly detected, a summarized report. Using it decoratively — as a header background, as a section banner, as brand chrome — devalues the signal so that when a real AI moment appears, the clinician has already tuned it out.

**No product-brand accent colours.** Every product uses the same palette. Modules are distinguished by *content and layout*, not by giving each product its own coloured chrome. If you find yourself reaching for a colour to "differentiate the module," you are working around a real information-hierarchy problem — fix the hierarchy instead.

---

## 9. Typography Philosophy

### Hierarchy
Three sizes are enough for 95% of screens: **body** (14 or 16), **body-small** (12), **title** (18 or 20). Headings only where the semantic structure demands them; not for visual weight. If you find yourself wanting a fourth size, ask whether the structure is too flat (use weight or space instead) or whether the extra size is chasing a design aesthetic (drop it).

**Only even sizes.** 12, 14, 16, 18, 20, 24, 32. Odd sizes (11, 13, 15) render inconsistently across zoom levels and browsers; the difference is imperceptible visually but real in typography metrics. This is a hard rule at review.

### Readability
Line-height at 1.4–1.5 for body copy, 1.2–1.3 for titles. Never below 1.2 (letterforms collide) and rarely above 1.6 (the eye loses the line). Measure — do not eyeball — before shipping.

### Density
Clinical UI is dense by design; clinicians need to see a lot of context at once. That means we resist the modern instinct to add whitespace between every row. In a worklist table, cell padding is 8–12, not 16–20. In a form, label-to-input gap is 4–6, not 12. Density is not clutter if the hierarchy is clean; it is efficiency.

### Clinical usability
Numbers must be readable at speed. Every number — lab value, KPI, patient count, chart axis — uses **tabular-nums** so columns of digits align. A clinician scanning a column of Hgb values should never have to squint because "10.5" and "11.2" are different widths. This is why every table cell and KPI in HC1 opts into `tabular-nums-hc1` (or Tailwind's `tabular-nums`) by default.

### Font weight
Titles: 600 or 700. Everything else: 400 or 500. That's it. Do not mix in 300, 350, 550, 800; the extra weights add noise without adding hierarchy. Weight, like colour, is a communication channel — spend it sparingly.

---

## 10. Motion Philosophy

### Fast feedback
Any pointer interaction must produce a visible response within 100ms. Hover states, active states, focus rings — all instant. If the underlying work is slow (fetching data, computing a result), the visual acknowledgment is still instant and the slow work is indicated with a spinner or skeleton.

### Subtle transitions
Panel open/close: 150ms. Modal enter: 250ms. Nothing in HC1 animates longer than 350ms. Longer animations feel indulgent in clinical software; the clinician wants the panel *now*, not a smooth journey to the panel over half a second.

### Reduced motion
Every animation respects `prefers-reduced-motion: reduce`. The animation is not disabled entirely — it is collapsed to a zero-duration opacity swap so the state change is still visible, but no movement occurs. Vestibular sensitivity is common; respecting the OS setting is not optional.

### Purpose-driven animation
Animation exists to answer three questions: *where did that come from?* (an entrance from the direction of the trigger), *where did that go?* (an exit toward the trigger), *what changed?* (a value tick or list re-order). If your animation does not answer one of those, remove it. No decorative motion. No easter eggs. No "just to make it feel alive." Clinical software is not alive; it is a tool.

---

## 11. Accessibility

**Accessibility is never optional.** Every component ships with the following, or it is not shipped:

### Keyboard first
Every interactive element is reachable and operable by keyboard alone. Tab moves forward, Shift+Tab backward, Enter/Space activates, arrow keys navigate within composite widgets (radio groups, tabs, menus), Escape dismisses transient surfaces. Tab order matches the visual reading order — never reordered by CSS `order` or `flex-direction: reverse` without a matching `tabindex` adjustment.

### Native HTML
Prefer the browser's native semantics. A button is `<button>`, not `<div onClick>`. A link is `<a href>`, not `<span onClick>`. A form field is `<input>`, not a `contenteditable` div. Native elements bring focus management, keyboard behavior, form participation, and screen-reader announcement for free — reinventing them is how accessibility bugs multiply.

### Visible focus
Every focusable element paints a 2px outline in the brand ring colour when focused via keyboard. Consistent across Button, Input, Card, Dialog, Drawer, Checkbox, Radio, Tabs, Breadcrumb — one visual family. `:focus-visible` (never plain `:focus`) so the ring appears for keyboard users but not on mouse click.

### Contrast
All text passes WCAG AA (4.5:1 for body, 3:1 for large). No exceptions for "subtle" placeholder or "muted" labels. If it needs to be readable, it needs to pass the ratio. The token layer enforces this by pairing every `text.*` alias with a specific `bg.*` alias — you cannot compose a low-contrast pair by accident.

### ARIA only when necessary
Native semantics first, ARIA to fill gaps only where the DOM cannot express the widget's role. Do not sprinkle `role="button"` on a `<button>`; do not add `aria-label` when the visible text already labels the control. Over-ARIA is worse than under-ARIA because it lies to assistive tech about the shape of the UI.

### Non-visual state
Every visual state has a non-visual equivalent: loading = `aria-busy`, disabled = `aria-disabled` (or native `disabled`), error = `aria-invalid` + `role="alert"` on the message, required = native `required` + a visible marker. A screen reader user gets the same information a sighted user gets.

**None of this is a "future PR."** A component's PR is not mergeable without the keyboard, ARIA, focus, and contrast checks completed. The playground documentation includes an Accessibility section per component that names exactly what was implemented; if the section is empty, the component is not ready.

---

## 12. Component Lifecycle

Every component moves through eight stages. Skipping a stage is a review blocker.

### Research
Before writing code: what problem does this solve, in which products, replacing what. If the answer is "one product might use this," stop — it belongs in the product, not HC1.

### Specification
Write the component's contract before writing the code: props (with types), sub-components, states (default / hover / focus / active / disabled / loading / error / warning / success / read-only), sizes, variants, ARIA roles, keyboard shortcuts, motion, tokens consumed. This is 30 minutes of typing that saves 3 days of rework.

### Implementation
The code. Consumes only the alias and component-token layers. Uses native HTML wherever possible. Ships CSS in a colocated file (`Component.css`), not inline styles. Every visual value is a token.

### Documentation
A `<Component>Doc.tsx` file inside `src/docs/components/` that renders the component in every state, size, and variant, with real-world examples, prop tables, accessibility notes, keyboard reference, and "do / don't" pairs. Documentation is not a follow-up PR; it is part of the component PR.

### Playground
The doc is wired into the playground's registry and reachable at `/design-system#<component-id>`. Interactive controls let a reviewer manipulate every prop live. This is where product engineers preview before adopting.

### Verification
`npm run typecheck` clean. `vite build` clean. Headless probe of the playground page: every state renders, keyboard interaction works, ARIA attributes present, focus paints, no console errors. This is a smoke-verify, not a unit test — it proves the component doesn't crash the playground.

### Migration
Every existing product screen that could use the new component gets an issue filed (or a follow-up PR). We do not merge a new component into HC1 without at least one committed migration target — otherwise we accumulate unadopted primitives that become drift.

### Release
`CHANGELOG.md` updated in the same PR. Version bumped according to the semver rules. The next consumer PR can pull the new version and adopt it.

---

## 13. Migration Strategy

**Products consume HC1. Products never fork HC1.**

Improvements happen centrally. If ClinicalIQ needs a variant of Button that HC1 doesn't ship, the correct move is:

1. Confirm at least one other product would use it. If not, wrap Button locally inside ClinicalIQ.
2. If two products need it, propose the change to HC1, ship it in the design system, then adopt the new version.

The wrong move is: copy Button into ClinicalIQ, modify locally, ship. This is the death of a design system. Within a year the "local Button" and the "HC1 Button" have drifted, and no one knows which is the source of truth.

**Enforcement:** every product's CLAUDE.md forbids re-implementing anything the DS provides. Every code review checks for local re-implementations of shipped primitives. The alias path `@hc1/design-system/*` is the only sanctioned import for any of the 22 components.

**Migration cadence:** products migrate incrementally, one screen at a time, one component at a time. There is no "big-bang" adoption. During migration, legacy components are tagged `@deprecated` (see `LEGACY_ARCHIVE.md` in ClinicalIQ) and removed only after the last consumer moves. A migration PR touches product screens, never HC1.

**When HC1 breaks:** a breaking DS change forces every product to migrate before the DS ships the new version. If migration is not feasible, the change is not breaking — it is a new opt-in prop or a new component alongside the old one. We do not push breaking changes upstream and leave products to catch up.

---

## 14. Contribution Rules

Before adding a component, answer four questions in the PR description. Any "no" is a stop.

### 14.1 Is it reusable?
Does the component make sense outside the one screen you are looking at right now? A "PatientNotesPanel" is not reusable — it is a business component. A generic "ExpandableSection" is.

### 14.2 Can composition solve this?
Is there an existing primitive (or pair of primitives) that composed would do the job? A "Confirmation Dialog" is not a new component — it is `<Dialog>` + `<Button>` + a title and description. A "Filter Panel" is not new — it is `<Popover>` + `<Checkbox>`.

### 14.3 Does another primitive already exist?
Search the components folder. If there is an 80% match, extend that one (with a new prop, a new variant, a new sub-component). Do not ship two components that solve overlapping problems.

### 14.4 Is it needed by multiple HC1 products?
If only one product needs it today, it stays in that product. Reusable-in-theory is not the same as reusable-in-practice. Wait for the second real consumer.

**In addition:** every component change updates the doc file, adds to the playground, updates `CHANGELOG.md`, and passes typecheck + build. A component PR that touches code without touching docs is incomplete.

---

## 15. Non-Goals

The HC1 Design System does not own these things. If your PR would introduce any of them into `src/`, the answer is no:

- **Business workflows.** How care plans are approved, how orders are placed, how a specimen moves through a lab. These are product concerns.
- **Charts.** We use Recharts directly in products. Chart configuration (axis format, series colours, tooltip content) is domain-specific and stays with the product. The tokens are shared; the chart wrappers are not.
- **Rich text editors.** Content authoring is not a clinical primitive. If a product needs one, it installs one directly.
- **Maps.** Same reason.
- **Feature logic.** Anything that reads or writes clinical data.
- **API clients.** Fetching, caching, mutation — product infrastructure, not UI.
- **Clinical domain logic.** Scoring algorithms (TRS, ACOG, HEDIS), lab reference ranges, diagnostic decision trees. Belongs in `src/clinicaliq/`, `src/hercare/`, etc.
- **State management.** Redux, Zustand, React Query — product concerns. HC1 components are controlled/uncontrolled at the DOM level and take no position on where state lives.

The point of a design system is that it is *small* and *sharp*. Every non-goal above is a category of complexity we deliberately keep out so the surface stays maintainable.

---

## 16. Definition of Done

A component is complete only when *every* item below is checked. Not "some day" — in the merging PR.

- **Design tokens.** Every visual value is a token. Zero hardcoded hex, zero off-scale pixel amount. Verified by grep.
- **Accessibility.** Keyboard operable, screen-reader announced, ARIA correct where needed, visible focus, contrast passes AA. Documented in the component's Accessibility section.
- **Documentation.** A dedicated `<Name>Doc.tsx` file with: Purpose, Anatomy, States, Sizes, Composition, Accessibility, Keyboard, Best Practices, Common Mistakes, Interactive Playground, Real-World Examples, Props, Tokens Used, Implementation Notes.
- **Playground.** Registered in `src/docs/registry.ts` and reachable at a stable URL fragment. Live controls exercise every prop.
- **Real-world examples.** At least three examples drawn from actual product scenarios (worklist row, care plan step, filter panel — pick relevant ones). Not "here is a button with the word Button on it."
- **Migration guidance.** Named consumers in the "Migration Targets" section of the doc: which existing legacy component this replaces and in which product.
- **Verification.** `npm run typecheck` clean. `vite build` clean. Headless probe of the doc page passes every assertion (rendered, ARIA, keyboard, focus).
- **Zero hardcoded values.** Not a single `#`, not a single unnamed `px`, in the component or its CSS. Any exception is documented inline with a token-limitation reason.
- **Production readiness.** No `TODO`, no `FIXME`, no `@ts-expect-error`, no `any` without a comment explaining why. No "we will document this later." No "this state is planned for a follow-up."

The rule of thumb: if the component would embarrass a new engineer reading it in a year, it is not done.

---

## 17. Long-Term Vision

Five years out, HC1 has ten IQ products in the market. Every one of them looks the same, feels the same, behaves the same. A clinician who used ClinicalIQ at a previous hospital sits down at a HerCare workstation and is productive in ninety seconds because every button, every dialog, every table, every keyboard shortcut is where they expect.

The design system has moved through 3.x. The token layer has absorbed one full brand refresh without a single component change. Dark mode shipped as a token remap. Density modes (comfortable / compact / dense) are configurable per user.

Product codebases have gotten *thinner* every year, not thicker. What was 40 files of chrome and layout in a product screen in year one is 6 files in year five, because the platform absorbed the shared shapes. Product engineers spend nearly all their time on domain logic, because the UI is provided.

New products are cheap to launch. Bootstrapping a fifth or sixth IQ module takes days, not months, because the shell, the tokens, the components, and the layouts are all installed. What used to be a 6-week UI scaffolding sprint is now `npm install @hc1/design-system` and a router.

Contributing to the platform is a normal part of product work. When a product engineer discovers that a primitive is missing, the fix goes upstream, not sideways. The idea of a "product-local UI utility" has died — everyone knows to lift.

Somewhere, five years from now, an intern makes a PR that violates a rule in this document. In the review, another engineer types "see FOUNDATION.md §11" and links here. That is when we know the constitution held.

---

*Written for HC1. Kept intentionally short. When this file grows past ~1500 lines, it has become a wiki and we have lost the plot — trim, do not expand.*
