import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * HeroSummary — the one headline banner on a page (at most one).
 *
 * SourceIQ standard (2026-11-11). Replaces the two hand-built banners in
 * SourceIQ ("Total Potential Savings" and "AI Agent Insights"):
 *
 *   ┌────────────────────────────────────────────────────────────────┐
 *   │ [icon]  Label                                   [action]        │
 *   │         1,287,112                                               │
 *   │         11 initiatives · 9 vendors                              │
 *   └────────────────────────────────────────────────────────────────┘
 *
 * COLOUR RULE: solid dark teal by default. The gradient is reserved for
 * AI surfaces — set `ai` only when the banner reports on AI agents or
 * AI-generated findings; it then uses the AI gradient (teal → amber).
 *
 *   <HeroSummary
 *     label="Total potential savings"
 *     value="1,287,112"
 *     supportingText="11 initiatives · 9 vendors"
 *   />
 *
 *   <HeroSummary
 *     ai
 *     icon={<Sparkles />}
 *     label="AI Agent Insights"
 *     value="10 active insights"
 *     supportingText="Ambient agents continuously monitoring your supply chain"
 *     action={<Button variant="outline">View initiatives</Button>}
 *   />
 */
export type HeroSummaryProps = {
  /** Small line above the value. */
  label: ReactNode;
  /** The headline figure or statement. Rendered 32px bold. */
  value: ReactNode;
  /** One supporting line under the value. */
  supportingText?: ReactNode;
  /** Optional lucide icon in a translucent tile on the left. */
  icon?: ReactNode;
  /** Optional single action on the right (one Button). */
  action?: ReactNode;
  /** AI surface → AI gradient (teal → amber). @default false */
  ai?: boolean;
};

export function HeroSummary({ label, value, supportingText, icon, action, ai = false }: HeroSummaryProps) {
  return (
    <section
      data-slot="hero-summary"
      data-ai={ai || undefined}
      className={cn(
        "flex items-center justify-between gap-[var(--hc-space-24)]",
        "rounded-[var(--hc-radius-surface)] p-[var(--hc-space-24)]",
        "text-[color:var(--hc-color-text-on-solid)] [font-family:var(--hc-font-sans)]",
        ai
          ? "bg-[linear-gradient(110deg,var(--hc-color-ai-gradient-from),var(--hc-color-ai-gradient-via)_55%,var(--hc-color-ai-gradient-to))]"
          : "bg-[color:var(--hc-color-brand-800)]",
      )}
    >
      <div className="flex min-w-0 items-center gap-[var(--hc-space-16)]">
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex size-[var(--hc-space-48)] shrink-0 items-center justify-center rounded-[var(--hc-radius-control)] bg-white/15 [&>svg]:size-6"
          >
            {icon}
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-[var(--hc-space-4)]">
          <span className="text-[14px] font-medium text-white/80">{label}</span>
          <span className="text-[32px] font-bold leading-[1.15] [font-variant-numeric:tabular-nums]">{value}</span>
          {supportingText && <span className="text-[14px] text-white/80">{supportingText}</span>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </section>
  );
}
