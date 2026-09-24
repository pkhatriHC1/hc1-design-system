/**
 * @hc1/design-system/patterns — opinionated compositions.
 *
 * Patterns are pre-wired combinations of DS primitives with product
 * decisions baked in (density, defaults, layout, slot policy). They
 * exist to make the common HC1 product surfaces plug-and-play so a
 * consumer engineer doesn't rebuild the same worklist, filter bar,
 * or form scaffolding in every product.
 *
 * How this differs from ../components:
 *   - components/ ships PRIMITIVES: unopinionated, stable semver,
 *     composed by the consumer.
 *   - patterns/   ships PRESETS: opinionated, iterates faster,
 *     composes multiple primitives on the consumer's behalf.
 *
 * Roadmap + phase tracking lives in ../../PATTERNS_LOG.md.
 */

export * from "./form";
export * from "./confirm-dialog";
export * from "./filter-bar";
export * from "./data-table";
export * from "./command-palette";
export * from "./kpi-card";
export * from "./chart-card";
export * from "./severity-legend";
export * from "./ai-insight-card";
export * from "./patient-identity-strip";
export * from "./wizard";
export * from "./inline-edit";
export * from "./grid";
export * from "./bulk-action-bar";
export * from "./page-template";
