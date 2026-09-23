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

## Phase 1 — Forms & confirmations foundation [not started]

Highest consumer pain, lowest-risk primitives-already-exist work.

- [ ] `Form`, `FormField`, `FormSection`, `FormActions` — wired to `react-hook-form`
  - Add `react-hook-form` as optional peer in `package.json`
  - `FormField` takes `control` + `name`, renders `Label` + control + `FormMessage` with correct `aria-describedby`/`aria-invalid`
  - Works with existing `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch` via slot pattern
- [ ] `ConfirmDialog` — `Dialog` preset with destructive `Button`, optional typed-name guard (Vercel-style "type PROJECT_NAME to confirm")
- [ ] `EmptyState` presets — extend `src/components/empty-state/` with `variant="no-data" | "no-results" | "error" | "permission"` shortcuts. Stays a primitive extension, doesn't move to `src/patterns/`.
- [ ] `Sidebar.Group` + `Sidebar.GroupTrigger` — nested collapsible groups inside existing `src/components/sidebar/`. Primitive extension.

## Phase 2 — Primitive gaps that data patterns depend on [not started]

Net-new primitives so Phase 3 has building blocks.

- [ ] `Combobox` primitive — searchable Select. Base for FilterBar + Command palette.
- [ ] `DropdownMenu` primitive — row actions, header overflow. Replaces ad-hoc `Popover` menus.
- [ ] `Avatar` primitive — worklist rows, user chips, comment threads.

## Phase 3 — Data-table pattern layer [not started]

The headline worklist story.

- [ ] `FilterBar` pattern — search + Combobox filters + chip row + clear-all
- [ ] `DataTable` pattern — Table + Toolbar + sort + selection + Pagination + Skeleton + EmptyState composed. Column config API.
- [ ] `Worklist` preset — `DataTable` opinionated for clinical rows: Avatar + severity badge + row `DropdownMenu`. Clinical density.

## Phase 4 — Navigation & shell [not started]

- [ ] `AppShell` full — `Header`, `Sidebar`, `Main`, `Footer` slots. Extends existing `src/components/app-shell/` (primitive extension, not pattern).
- [ ] `PageHeader` compound — `Breadcrumb`, `Title`, `Description`, `Tabs`, `Actions` slots. Extends existing `src/components/page-header/`.
- [ ] `CommandPalette` pattern — `Dialog` + `Combobox` + recent items + keyboard shortcuts. Depends on Phase 2 Combobox.

## Phase 5 — Dashboards [not started]

- [ ] `KpiRow` + `KpiCard` — metric + delta + optional sparkline
- [ ] `ChartCard` — `Card` + Recharts wrapper + built-in Empty/Loading. Recharts becomes an optional peer dep, subpath-lazy.
- [ ] `DashboardHero` template — KPI row + primary chart + drill-down slot

## Phase 6 — Clinical / HC1-specific patterns [not started]

- [ ] `PatientIdentityStrip` — compact patient header: name + MRN + severity + actions
- [ ] `AiInsightCard` — `Card` on violet AI tokens, provenance line, accept/dismiss actions. Only sanctioned use of the violet ramp (see `FOUNDATION.md` §8).
- [ ] `SeverityLegend` — badge row keyed to severity aliases

## Phase 7 — B-tier + cleanup [not started]

- [ ] `Wizard` / `Stepper` pattern
- [ ] `InlineEdit` pattern (read ↔ edit toggle)
- [ ] `CardGrid` pattern (responsive gallery)
- [ ] `DetailPage` template
- [ ] `BulkActionBar` pattern
- [ ] Delete dead code in `src/layouts/`: `Sidebar.tsx`, `SidebarLink.tsx`, `PageHeader.tsx`, `SectionHeader.tsx` (superseded by `src/components/{sidebar, page-header, section-label}`). Migrate `DesignSystemPlayground.tsx` off `layouts/Shell` first.
- [ ] Populate stubs under `src/docs/patterns/` with real usage examples per pattern.

---

## Log

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
