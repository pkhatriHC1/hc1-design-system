# Patterns roadmap & log

Working log for the pattern layer of `@hc1/design-system`. This file is the source of truth for what pattern work is in flight, what's shipped, and what's next. Keep the phase checklists honest — check items as they land, add a dated entry under **Log** when a phase closes or a decision changes.

Pattern docs stubs live under `src/docs/patterns/`. Pattern CODE lives under `src/patterns/`, exported at `@hc1/design-system/patterns`.

---

## Decisions locked

- **Patterns live in `src/patterns/` with their own subpath export** (`@hc1/design-system/patterns`), not as compound APIs hung off existing primitives. Patterns compose multiple primitives, iterate faster than primitives, and are opinionated — a separate semver contract keeps that clean and keeps the main entry lean.
- **`Form` / `FormField` use `react-hook-form` as an optional peer dep.** Single opinionated API. Consumers who don't reach for `<Form>` still use bare `<Input>` etc. without pulling RHF. Rationale: at HC1 scale, headless optionality is negative value — cross-product consistency and shared bugfixes matter more than library independence.
- **Nested sidebar navigation is a primitive extension, not a pattern.** Ships inside `src/components/sidebar/` as new subcomponents (`Sidebar.Group`, `Sidebar.GroupTrigger`), not under `src/patterns/`. Rule of thumb: if it's a natural extension of one primitive, extend the primitive; if it composes multiple, it's a pattern.

---

## Phase 0 — Scaffolding [done 2026-09-23]

- [x] `src/patterns/` folder + placeholder `index.ts`
- [x] `tsup.config.ts` entry: `patterns/index`
- [x] `package.json` subpath export: `./patterns`
- [x] `dist/styles.css` `@source` covers `patterns/index.{js,cjs}` so Tailwind picks up arbitrary utility classes baked into patterns
- [x] `PATTERNS_LOG.md` at repo root

## Phase 1 — Forms & confirmations foundation [done 2026-09-23]

- [x] `Form`, `FormField`, `FormInput`, `FormTextarea`, `FormSelect`, `FormCheckbox`, `FormSwitch`, `FormRadioGroup`, `FormSection`, `FormActions` — all wired through `react-hook-form` at `src/patterns/form/`. RHF is an OPTIONAL peer dep.
- [x] `ConfirmDialog` — `src/patterns/confirm-dialog/`. `variant='destructive'` for delete flows, optional `typedGuard` string the user must type to unlock Confirm, async `onConfirm` (button shows loading, dialog stays open on reject).
- [x] `EmptyState` presets — five shortcuts inside `src/components/empty-state/presets.tsx`: `NoDataEmptyState`, `NoResultsEmptyState`, `ErrorEmptyState`, `PermissionDeniedEmptyState`, `OfflineEmptyState`. Each picks the right `variant`, ships a lucide default icon, exposes a slim primary/secondary action API and slots for override.
- [x] `Sidebar.Group` — collapsible parent row that mirrors `Sidebar.Item` layout + trailing chevron + animated child list. Uncontrolled `defaultOpen` or controlled `open`/`onOpenChange`. Collapsed-rail behaviour: renders as icon-only with tooltip, children hidden entirely (fan-out popover deliberately out of scope for the primitive).

## Phase 2 — Primitive gaps that data patterns depend on [done 2026-09-23]

- [x] `Avatar` — `src/components/avatar/`. Circle/square, 5-size ladder (xs/sm/md/lg/xl matching Button+Input), image-with-graceful-fallback via `@radix-ui/react-avatar`, initials auto-derived from `name`, optional presence dot (online/away/busy/offline). Also ships `AvatarGroup` with `max` overflow behaviour.
- [x] `DropdownMenu` — `src/components/dropdown-menu/`. Thin wrap of `@radix-ui/react-dropdown-menu` on the DS chrome family (same panel style as Popover/Dialog). Compound: `Trigger` / `Content` / `Item` (with `destructive` + `shortcut`) / `CheckboxItem` / `RadioGroup` / `RadioItem` / `Label` / `Separator` / `Group` / `Sub` / `SubTrigger` / `SubContent`. Size ladder on `Content` (sm/md/lg min-widths).
- [x] `Combobox` — `src/components/combobox/`. Searchable Select on top of `@radix-ui/react-popover`. Client-side filter by default (label + description case-insensitive substring); pass `onSearch` for server-side. Full keyboard nav (Arrow/Home/End/Enter/Escape), aria-activedescendant, loading spinner, group headers, custom filter override. Same validation model as Input.

## Phase 3 — Data-table pattern layer [in progress]

The headline worklist story.

- [x] `FilterBar` pattern — `src/patterns/filter-bar/`. Compositional API (`FilterBar.Search` + `FilterBar.Filter` + `FilterBar.Actions`), auto-rendered Clear-all button via `onClearAll`, filter chips composed into trigger labels ("Severity: Critical").
- [x] `DataTable` pattern — `src/patterns/data-table/`. Config-driven column API (`DataTableColumn<T>`), three-way sort cycle (asc → desc → null), opt-in checkbox column via `selection` + `onSelectionChange`, opinionated loading skeletons + empty state + pagination footer. Consumer owns pagination + sort state; DataTable never slices or resorts the array.
- [ ] `Worklist` preset — `DataTable` opinionated for clinical rows: Avatar + severity badge + row `DropdownMenu`. Deferred as a thin follow-up — the `DataTableDoc` "With FilterBar toolbar" section already shows the full worklist composition, so a dedicated preset only saves ~30 LOC per consumer. Revisit if we standardize the exact column shape across ClinicalIQ / SourceIQ / HerCare.

## Phase 4 — Navigation & shell [done 2026-09-23]

- [x] `AppShell` full — `src/components/app-shell/`. Added `AppShell.Header` (optional top bar, full-width, shrink-to-content, bottom divider) and `AppShell.Footer` (optional bottom bar, top divider). Root now walks children by displayName so JSX order doesn't matter — Header sits above the Sidebar + Main row, Footer sits below.
- [x] `PageHeader` — `src/components/page-header/`. Added `breadcrumb` and `tabs` props alongside the existing title/subtitle/meta/actions. Breadcrumb strip renders above the title; Tabs strip renders at the bottom of the header on the content divider (Tabs above = top-level nav = Sidebar's job; Tabs below = within-page nav = PageHeader's slot). Kept the existing prop API for backward compat; compound subcomponents deferred (add if a consumer needs them).
- [x] `CommandPalette` — `src/patterns/command-palette/`. Dialog + search input + filterable command list. Config-driven `CommandItem` array (label + description + icon + shortcut + group + keywords + action + disabled), first-seen group order, client-side substring filter with keywords support, custom `filter` override for fuzzy match. Keyboard: type-to-search, ArrowUp/Down navigate (disabled skipped), Home/End jump, Enter runs. DS doesn't bind ⌘K — consumers own the shortcut so the palette coexists with other Cmd+K listeners.

## Phase 5 — Dashboards [done 2026-09-24]

- [x] `KpiCard` + `KpiRow` — `src/patterns/kpi-card/`. Label + value + optional delta + optional sparkline + optional icon. Delta auto-colors as success / error based on `positive` semantics (up-is-good vs down-is-good). Sparkline is a hand-rolled SVG polyline — no Recharts dep. KpiRow is a responsive grid (2/3/4/5/6 columns → auto-drops on tablet/phone).
- [x] `ChartCard` — `src/patterns/chart-card/`. Card frame with title + description + actions + fixed-height body wrapping any Recharts chart in ResponsiveContainer. Built-in loading skeleton (bar-shaped) and empty state. `recharts` declared as OPTIONAL peer dep so products without charts don't pay the bundle cost.
- [x] `DashboardHero` template — `src/patterns/dashboard-hero/`. Vertical stack: header (PageHeader) / kpis (KpiRow) / primary chart (2/3 wide) + secondary chart (1/3). Collapses to single-column on narrow. Extra content drops in `children` below the chart row.

## Phase 6 — Clinical / HC1-specific patterns [done 2026-09-24]

- [x] `SeverityLegend` — `src/patterns/severity-legend/`. Color-key row keyed 1:1 to `--hc-color-severity-*` tokens. Configurable levels + labels + orientation (horizontal wraps / vertical for map sidebars) + compact mode. Uses `role="list"` for AT.
- [x] `AiInsightCard` — `src/patterns/ai-insight-card/`. Ships the DS's ONLY sanctioned use of the violet AI tokens (`--hc-color-ai-*`, `--hc-color-violet-*`). Title + description + provenance strap + Accept/Dismiss buttons + optional extraActions. Left accent bar (inset box-shadow) + violet-50 wash + sparkles icon in a violet-100 circle make AI content unambiguously identifiable to the user. Loading state pulses violet placeholders so users see an AI moment is arriving.
- [x] `PatientIdentityStrip` — `src/patterns/patient-identity-strip/`. Persistent header for every route inside a patient chart. Avatar + name + MRN + severity Badge (with SeverityLevel → Badge variant mapping baked in) + configurable meta pairs + right-aligned actions. Compact mode for embedding inside Cards / Dialogs. Severity is optional so the strip also fits anonymized / non-clinical views.

## Phase 7 — B-tier + cleanup [patterns done 2026-09-24; cleanup deferred]

- [x] `Wizard` — `src/patterns/wizard/`. Numbered step indicator + Back/Next/Finish nav. Completed steps show checkmarks and are clickable to jump back; future steps aren't (linear flow). `canAdvance` gates Next.
- [x] `InlineEdit` — `src/patterns/inline-edit/`. Read ↔ edit toggle. Hover reveals edit icon; Enter saves (Cmd+Enter for multiline), Escape cancels. `renderValue` hook for custom read-mode formatters.
- [x] `CardGrid` — `src/patterns/card-grid/`. Responsive grid wrapper for tile-shaped Cards. 2..6 columns, auto-drops on tablet/phone.
- [x] `DetailPage` template — `src/patterns/detail-page/`. Identity strap → PageHeader (with tabs) → 2-column body with main + optional right rail. Repurposes the existing `template-detail` registry entry.
- [x] `BulkActionBar` — `src/patterns/bulk-action-bar/`. Sticky selection strap for DataTable. Renders conditionally on `selectedCount > 0` from the consumer side.
- [ ] Delete dead code in `src/layouts/` — DEFERRED. `Sidebar.tsx` / `SidebarLink.tsx` / `PageHeader.tsx` / `SectionHeader.tsx` are still imported by `src/layouts/Shell.tsx` which the playground depends on. Migration path: rewrite Shell on top of `AppShell` + `components/sidebar` + `components/page-header` + `components/section-label` first, then delete.
- [ ] Populate registry stubs — DEFERRED. `pattern-tables`, `pattern-filters`, `pattern-navigation` still point at 7-line `ComingSoonCard` stubs even though DataTable / FilterBar cover most of the intended surface. Either remove the stub entries or write topic-level pattern docs.

---

## Log

### 2026-09-24 — Phase 7: B-tier patterns shipped; cleanup deferred
Five patterns landed. The two cleanup checklist items (delete dead layouts / repurpose stubs) are deferred with rationale — dead-code deletion needs the playground's Shell to be migrated onto DS primitives first.

- Wizard at `src/patterns/wizard/` — numbered step indicator + Back/Next/Finish. Completed steps get checkmarks and are clickable; future steps aren't (linear flow). `canAdvance` gates Next for form validation.
- InlineEdit at `src/patterns/inline-edit/` — read/edit toggle. Enter saves single-line, Cmd/Ctrl+Enter saves multiline, Escape cancels both. `renderValue` hook for custom read-mode formatters (dates, badges).
- CardGrid at `src/patterns/card-grid/` — responsive grid wrapper. columns={2..6}, tablet/phone breakpoints, minTileWidth for finer density control.
- BulkActionBar at `src/patterns/bulk-action-bar/` — sticky selection strap for DataTable. Inline / sticky variants. Consumer renders conditionally on selection.length > 0.
- DetailPage template at `src/patterns/detail-page/` — identity → PageHeader (with tabs) → 2/3+1/3 body split. Repurposes existing `template-detail` registry entry.

Doc pages under patterns: WizardDoc, InlineEditDoc, CardGridDoc, BulkActionBarDoc. DetailPageDoc rewritten from stub in templates category.

Deferred: (1) delete src/layouts/ dead files — Shell.tsx depends on them, migration needs its own pass. (2) Repurpose or delete pattern-tables/pattern-filters/pattern-navigation stubs — DataTable and FilterBar cover the intended surface.

Bundle: dist/patterns/index.d.ts grew 41.40 → 50.02 KB.

### 2026-09-24 — Phase 6 complete: SeverityLegend, AiInsightCard, PatientIdentityStrip
The clinical / HC1-specific layer — three patterns that carry the domain-specific visual language across products.

- SeverityLegend at `src/patterns/severity-legend/` — the color-key row every clinical surface needs. Keyed 1:1 to the five `--hc-color-severity-*` token groups so consumers never restyle a swatch. Ships horizontal / vertical / compact / localized / subset variants.
- AiInsightCard at `src/patterns/ai-insight-card/` — the DS's ONLY sanctioned use of the violet AI tokens per FOUNDATION.md §8. Every AI moment in HC1 products routes through this component so users can identify AI-generated content at a glance. Provenance line is required by the docs guidance (model + version + confidence) — no anonymous AI recommendations.
- PatientIdentityStrip at `src/patterns/patient-identity-strip/` — the persistent identity chip pinned to every route inside a patient chart. Avatar + name + MRN + severity Badge + meta pairs + actions. Compact mode for Card / Dialog embedding.

Doc pages: SeverityLegendDoc + AiInsightCardDoc + PatientIdentityStripDoc all under patterns. Registry entries added.

Bundle: `dist/patterns/index.d.ts` grew 35.48 → 41.40 KB.

### 2026-09-24 — Phase 5 complete: KpiCard/KpiRow, ChartCard, DashboardHero
Dashboards layer landed — the pattern every landing view opens with.

- KpiCard at `src/patterns/kpi-card/` — label + value + delta + sparkline + icon. Delta color is automatic based on `positive` semantics; up-is-good metrics (revenue, uptime) get green on up-trends, down-is-good metrics (wait time, error rate) get green on down-trends. Sparkline is a hand-rolled SVG polyline so KpiCard has zero external deps.
- KpiRow at `src/patterns/kpi-card/KpiRow.tsx` — responsive grid wrapper. Configurable column count with sensible tablet/phone breakpoints.
- ChartCard at `src/patterns/chart-card/` — Card frame + fixed-height body wrapping any Recharts chart in ResponsiveContainer. Built-in loading (bar skeleton) + empty state (contained EmptyState). Recharts declared as an OPTIONAL peer dep + external in tsup.
- DashboardHero at `src/patterns/dashboard-hero/` — template composing PageHeader + KpiRow + primary/secondary chart cards. 2/3 + 1/3 chart split on wide, stacked on narrow. Extra content drops in `children`.

Doc pages: KpiCardDoc + ChartCardDoc under patterns; DashboardPatternDoc rewritten from ComingSoon stub to the full DashboardHero doc. Registry entries `pattern-kpi-card`, `pattern-chart-card` added; `pattern-dashboard` now points at the real template.

preview/package.json + vite.config.ts updated with the new peer deps (Radix Avatar, DropdownMenu, react-hook-form, recharts) that the docs use — the preview site imports from `src/` so it needs everything the DS source imports.

Bundle: `dist/patterns/index.d.ts` grew 27.15 → 35.48 KB.

### 2026-09-23 — Phase 4 complete: AppShell + PageHeader extensions, CommandPalette
Two primitive extensions and one net-new pattern.

- AppShell got Header + Footer slots. Layout is now Header / [Sidebar + Main] / Footer, distributed by displayName so JSX order is free.
- PageHeader got breadcrumb + tabs props. Backward-compat: existing title/subtitle/meta/actions still work. Compound subcomponents intentionally deferred — the prop-driven API covers the 90% case, and Sidebar-style compound would be over-engineering for a single-row header.
- CommandPalette (src/patterns/command-palette/) — the ⌘K pattern. Dialog + search + filterable command list with groups, keywords, shortcuts, disabled rows, custom filter. Consumer owns the shortcut binding so the palette can coexist with other Cmd+K listeners.

Doc pages: AppShellDoc + PageHeaderDoc under components, CommandPaletteDoc under patterns. Registry updated with app-shell, page-header, pattern-command-palette entries.

Bundle: `dist/patterns/index.d.ts` grew 24.09 → 27.15 KB (just CommandPalette; the AppShell/PageHeader changes land in the main index).

### 2026-09-23 — Phase 3: FilterBar + DataTable landed
Two of the three Phase 3 items shipped. `Worklist` preset deferred (see above).

- FilterBar at `src/patterns/filter-bar/` — `FilterBar.Search` + `FilterBar.Filter` (Combobox with label chip pattern) + `FilterBar.Actions`. Root's `onClearAll` auto-renders the Clear button so every FilterBar in HC1 clears the same way.
- DataTable at `src/patterns/data-table/` — the headline worklist. Config-driven columns (`DataTableColumn<T>` with `accessor` + `render` + `sortable` + `width` + `align`), consumer-owned three-way sort cycle, opt-in leading checkbox column with header all/some/none logic, loading skeleton rows, contained EmptyState inside a full-width cell, Pagination footer via the primitive.
- Doc pages: `FilterBarDoc` + `DataTableDoc` under `pattern-filter-bar` and `pattern-data-table` in the registry. DataTableDoc's "With FilterBar toolbar" section is the live worklist demo — filters + sort + pagination + clear + row DropdownMenu all wired.

Bundle: `dist/patterns/index.d.ts` grew 15.22 KB → 24.09 KB.

### 2026-09-23 — Phase 2 complete: Avatar, DropdownMenu, Combobox landed
Three net-new primitives that Phase 3 (FilterBar, DataTable, Worklist) depends on.

- `Avatar` at `src/components/avatar/` — 5-size ladder aligned to Button/Input, circle+square, initials auto-derived, presence dot in 4 tones, plus `AvatarGroup` with overflow `max`. Uses `@radix-ui/react-avatar` for the image → fallback cascade.
- `DropdownMenu` at `src/components/dropdown-menu/` — full compound wrap of `@radix-ui/react-dropdown-menu` (12 subcomponents). Same panel chrome as Popover/Dialog for family consistency. `Item.destructive` for delete rows, `Item.shortcut` for right-aligned ⌘K hints, nested submenus, checkbox + radio item styles.
- `Combobox` at `src/components/combobox/` — searchable Select. Built on `@radix-ui/react-popover` + hand-rolled filter + keyboard nav (no `cmdk` dep). `onSearch` opt-in for server-side. Client-side default filter matches label + description, custom override supported. Full validation model (error/warning/success + helper text) mirroring Input.

Two Radix packages added as OPTIONAL peer deps + devDeps: `@radix-ui/react-avatar ^1.1.0`, `@radix-ui/react-dropdown-menu ^2.1.0`. RHF stays optional too. `dist/index.d.ts` grew ~15KB (Avatar + DropdownMenu + Combobox types).

Phase 3 (FilterBar → DataTable → Worklist) is next — the "worklist story" that the audit called out as the single highest-leverage data pattern.

### 2026-09-23 — Phase 1 complete
All four Phase 1 items landed in one push after the Form pattern kickoff earlier the same day:

- 5 remaining form sugar wrappers (`FormTextarea` / `FormSelect` / `FormCheckbox` / `FormSwitch` / `FormRadioGroup`) — mechanically identical to `FormInput`: forward RHF's `field` into the underlying primitive's controlled props, map `fieldState.error` into whatever error surface the primitive exposes (`errorMessage`, `invalid`).
- `ConfirmDialog` at `src/patterns/confirm-dialog/` — Dialog preset with the four affordances that actually matter: a destructive variant, a typed-name guard, async confirm with loading state, and safe cancel-during-pending suppression.
- `EmptyState` presets at `src/components/empty-state/presets.tsx` — five shortcut components (No data / No results / Error / Permission denied / Offline). Each renders the base primitive with the right variant + default icon + minimal action API. Ergonomic wins: `<NoResultsEmptyState query="john" onClear={...} />` and `<ErrorEmptyState onRetry={refetch} />`.
- `Sidebar.Group` — new subcomponent at the bottom of `src/components/sidebar/Sidebar.tsx`, attached to the compound. Uses `useId` for aria-controls, ChevronRight from lucide as the toggle indicator, matches Sidebar.Item's height/padding token references so nested rows sit flush.

Build clean, typecheck clean, `dist/patterns/index.d.ts` at 15.22 KB (up from 6.92 KB in the kickoff commit). Phase 2 (Combobox, DropdownMenu, Avatar primitives — the gaps that Phase 3 patterns depend on) is next.

### 2026-09-23 — Phase 1 kickoff: Form pattern landed
`src/patterns/form/` now ships `Form`, `FormField`, `FormInput`, `FormSection`, `FormActions` — the RHF-adapter core of Phase 1's Forms track. Package now declares `react-hook-form ^7.0.0` as an OPTIONAL peer; `tsup.config.ts` marks it external so it isn't bundled. Sugar wrappers for the other form primitives (Textarea, Select, Checkbox, Switch, RadioGroup) are next inside the same folder — same shape as FormInput. Also still open in Phase 1: `ConfirmDialog`, `EmptyState` presets, `Sidebar.Group`.

Consumer usage looks like:
```tsx
const form = useForm<{ email: string }>({ defaultValues: { email: "" } });
<Form {...form}>
  <FormSection title="Account">
    <FormInput control={form.control} name="email" label="Email" />
  </FormSection>
  <FormActions>
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Save</Button>
  </FormActions>
</Form>
```

### 2026-09-23 — Phase 0 complete
Scaffold landed:
- `src/patterns/index.ts` placeholder
- `tsup.config.ts` builds `patterns/index` alongside `index` + `tokens/index`
- `package.json` exports `./patterns` subpath
- `dist/styles.css` `@source` covers pattern-emitted class strings
- Roadmap + decisions recorded in this file

Next up: Phase 1 (Form + FormField). Waiting on scope confirmation before starting.

### 2026-09-23 — Audit + decisions
- Ran full component audit (30 primitives) — see conversation history. Result: primitives mature, `src/patterns/` empty, `src/docs/patterns/*` are all 7-line `<ComingSoonCard/>` stubs, `src/layouts/` has 4 dead files.
- Decided patterns get own folder + own subpath export.
- Decided Form pattern uses `react-hook-form` as optional peer dep, single opinionated API.
- Decided nested sidebar navigation is a primitive extension, not a pattern.
