/**
 * TODO(0.12.1): rewrite ButtonDoc for the new sourceIQ-parity Button API.
 *
 * The 784-line variant/size gallery here was authored against the pre-0.12
 * HC1 Button API (primary/danger/danger-outline/success/cta/icon variants,
 * xs/sm/md/lg/xl size ladder, leftIcon/rightIcon slots). The 0.12 Button
 * mirrors sourceIQ/shadcn Button verbatim (default/outline/secondary/ghost/
 * destructive/link variants, default/xs/sm/lg + icon-* sizes, no
 * leftIcon/rightIcon — put icons as children).
 *
 * This stub keeps the docs playground building while the full page is
 * rewritten. Tracked as a follow-up on the DS 0.12.1 milestone.
 */

import { Button } from "../../components/button";

export function ButtonDoc() {
  return (
    <div style={{ padding: 32, color: "var(--hc-color-text-primary)" }}>
      <h1 style={{ marginTop: 0, fontSize: 24, fontWeight: 700 }}>Button</h1>
      <p style={{ color: "var(--hc-color-text-secondary)", marginBottom: 24 }}>
        API updated in 0.12.0 to match shadcn/SourceIQ verbatim so consumers
        can drop the DS Button in without renaming props. Full doc page
        rewrite pending — see the sourceIQ migration proof for live usage.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24, alignItems: "center" }}>
        <Button size="xs">xs · 24px</Button>
        <Button size="sm">sm · 32px</Button>
        <Button size="default">default · 36px</Button>
        <Button size="lg">lg · 40px</Button>
      </div>
    </div>
  );
}
