# @hc1/design-system

Shared UI package for every HC1 IQ product — **ClinicalIQ**, **SourceIQ**, **HerCare**, and any future module. One source of truth for tokens, components, and the interactive playground.

## Installation

### Inside the HC1 monorepo (current setup)

The package lives at `/HC1/hc1-design-system/` next to each product. Consumers reference it via a bundler alias:

```js
// e.g. ClinicalIQ/vite.config.js
resolve: {
  alias: {
    "@hc1/design-system": path.resolve(__dirname, "../hc1-design-system/src"),
  },
},
```

The package ships **source-only**: consumers' bundlers compile the TypeScript + JSX directly. Any Vite/Next/Rollup project already handles this.

### When published to npm (future)

```
npm install @hc1/design-system
```

The bundler alias goes away; `import ... from "@hc1/design-system"` resolves via `node_modules` and the `exports` map in `package.json`.

## Usage

```tsx
import { Button, Card, Dialog } from "@hc1/design-system";
import { primitives, aliases } from "@hc1/design-system/tokens";
import "@hc1/design-system/styles"; // once, at app entry

export function App() {
  return (
    <Card>
      <Button variant="primary">Click</Button>
    </Card>
  );
}
```

To mount the interactive documentation app (dev-mode only):

```tsx
import { DesignSystemPlayground } from "@hc1/design-system/playground";
```

## Public exports

### `@hc1/design-system` (root)

Components — one named export per component:

| | | | |
|---|---|---|---|
| `Alert` | `Badge` | `Breadcrumb` | `Button` |
| `Card` | `Checkbox` | `Dialog` | `Drawer` |
| `EmptyState` | `Input` | `Pagination` | `Popover` |
| `Radio` | `Select` | `Skeleton` | `Switch` |
| `Table` | `Tabs` | `Textarea` | `Toast` |
| `Tooltip` | | | |

Plus the `tokens` namespace: `import { tokens } from "@hc1/design-system"` → `tokens.primitives`, `tokens.aliases`, etc.

### `@hc1/design-system/tokens`

Direct access to the three-layer token system:

- `primitives` — raw values (color scales, spacing, radius, typography). Never consumed by components directly.
- `aliases` — semantic roles (`color.bg.default`, `text.primary`, `spacing.stack.md`). The layer components consume.
- `components` — per-component token bundles (button.paddingX, card.borderRadius, etc.).
- `types` — shared TypeScript token types (`ColorScale`, `TypographyStyle`).

### `@hc1/design-system/styles`

The CSS bridge — every token exported as a `--hc-*` custom property. Import once at your app's entry:

```ts
import "@hc1/design-system/styles";
```

### `@hc1/design-system/playground`

The interactive documentation app. Dev-mode only — don't bundle into production.

## Folder structure

```
hc1-design-system/
├── package.json           — @hc1/design-system, semver 1.x
├── tsconfig.json          — strict, ES2022, JSX react-jsx
├── README.md              — this file
├── CHANGELOG.md           — release notes
└── src/
    ├── index.ts           — root public API
    ├── playground.ts      — /playground subpath entry
    ├── DesignSystemPlayground.tsx
    ├── components/        — 22 component folders (public via root)
    │   └── index.ts
    ├── tokens/            — primitives, aliases, components, CSS
    │   ├── index.ts       — public via /tokens
    │   └── css/
    │       └── variables.css  — public via /styles
    ├── hooks/             — internal (playground)
    ├── layouts/           — internal (playground chrome)
    ├── utils/             — internal (playground helpers)
    ├── foundations/       — internal (playground content)
    ├── patterns/          — internal (playground content)
    └── docs/              — internal (playground doc pages)
```

Only `components`, `tokens`, `styles`, and `playground` are covered by the `exports` map in `package.json`. Everything else is internal — do not reach into `src/hooks`, `src/utils`, etc.

## Development workflow

1. Edit files under `src/`.
2. Run the playground from a consumer (e.g. ClinicalIQ) to see changes — the DS is source-only, so any HMR-capable bundler picks up edits immediately.
3. Add a component: create `src/components/<name>/` with `Name.tsx`, `Name.types.ts`, `Name.css`, `index.ts`; add to `src/components/index.ts`; add a doc file under `src/docs/components/<Name>Doc.tsx`; register in `src/docs/registry.ts`.
4. Typecheck:
   ```
   npm run typecheck
   ```

## Dependencies

- **Peer** — `react`, `react-dom` (>=18). The consumer's React version wins.
- **Runtime** — `lucide-react` (icons). Consumers get this via the DS install.
- **Dev** — `typescript`, `@types/react`, `@types/react-dom`.

No dependency on ClinicalIQ or any product. The package is independently installable.

## Versioning strategy

**Current release: `0.9.0` — pre-1.0.** The public API is stable-in-intent but has not yet survived a real product migration, so any 0.9.x → 0.9.y change may still break consumers. Pin exact versions during the migration window.

**1.0.0 will ship only when all four gates are cleared:**

1. ClinicalIQ is fully migrated onto `@hc1/design-system`.
2. SourceIQ is fully migrated onto `@hc1/design-system`.
3. The legacy design systems inside both products are removed.
4. The public API has absorbed at least one round of migration feedback without a breaking change.

**Post-1.0 semver:**

- **Major** (`2.0.0`) — breaking change to any public export: removed component, renamed prop, moved subpath entry, removed token, or changed token value in a way that shifts pixel output.
- **Minor** (`1.1.0`) — new component, new prop (backward-compat), new token, new subpath entry.
- **Patch** (`1.0.1`) — bug fix, doc update, internal refactor with no public API change.

Token-value tweaks that visually shift output (a hex change, a radius jump) are treated as breaking — bump major.

## Contribution guidelines

1. Read `CLAUDE.md` at the repo root (guardrails for tokens/components/playground content). If it's missing, create one from ClinicalIQ's version and drop the product-specific sections.
2. Before adding a new component, check if it already exists — never fork.
3. Every component ships with: `<Name>.tsx`, `<Name>.types.ts`, `<Name>.css`, `index.ts`, matching `<Name>Doc.tsx` in the playground, and a registry entry.
4. Every design decision must trace back to a token. No raw hex, no off-scale spacing.
5. Update `CHANGELOG.md` in the same PR as the code change.
