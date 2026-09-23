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
