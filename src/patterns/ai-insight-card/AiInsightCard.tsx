import type { HTMLAttributes, ReactNode } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "../../components/button";
import { cn } from "../../utils/cn";

/**
 * AiInsightCard — the sanctioned AI-generated moment.
 *
 * Reserved for surfaces where the product is showing a clinician a
 * genuine AI-generated result: a suggested care plan, an anomaly the
 * model flagged, a summarized report. This is the ONLY component in
 * the DS that uses the violet AI token family — see FOUNDATION.md §8
 * for the "AI moments only" rule.
 *
 * The card has an obvious AI mark (sparkles icon by default), a title,
 * a description body, a provenance line (which model + confidence), and
 * accept / dismiss actions. Consumers should not restyle the frame or
 * change the icon color — the visual language is what makes AI content
 * unambiguously identifiable to the user.
 *
 *   <AiInsightCard
 *     title="Recommend chest X-ray"
 *     description="Cough + fever + recent travel history suggests possible tuberculosis screening."
 *     provenance="ClinicalAI 4.2 · 87% confidence"
 *     onAccept={() => acceptRec()}
 *     onDismiss={() => dismissRec()}
 *   />
 */

export type AiInsightCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Card heading — the recommendation or insight, phrased actively. */
  title: ReactNode;
  /**
   * The body — usually 1-2 sentences explaining the reasoning. Longer
   * insights should link to a full report page rather than fitting
   * inside the card.
   */
  description?: ReactNode;
  /**
   * Provenance line — model name + version + confidence (or whatever
   * metadata the product surfaces). Renders in a muted strap under the
   * description so users can trace the recommendation back to the
   * source model.
   */
  provenance?: ReactNode;
  /** Optional icon override. @default <Sparkles /> */
  icon?: ReactNode;
  /**
   * Accept-action handler. When provided, an Accept Button appears in
   * the action row. Use the primary accept when the user confirms the
   * AI suggestion (adds to care plan, applies to record).
   */
  onAccept?: () => void;
  /** Label on the Accept button. @default 'Accept' */
  acceptLabel?: string;
  /**
   * Dismiss-action handler. When provided, a Dismiss ghost Button
   * appears in the action row.
   */
  onDismiss?: () => void;
  /** Label on the Dismiss button. @default 'Dismiss' */
  dismissLabel?: string;
  /**
   * Extra action slot — rendered after Dismiss + Accept. Use for
   * "View reasoning" or "Report issue" links.
   */
  extraActions?: ReactNode;
  /** Replace the body with skeletons while the insight is being computed. */
  loading?: boolean;
  /** Any additional content between the description and the actions row. */
  children?: ReactNode;
};

export function AiInsightCard({
  title,
  description,
  provenance,
  icon = <Sparkles />,
  onAccept,
  acceptLabel = "Accept",
  onDismiss,
  dismissLabel = "Dismiss",
  extraActions,
  loading,
  children,
  className,
  ...rest
}: AiInsightCardProps) {
  const hasActions = !!onAccept || !!onDismiss || !!extraActions;

  return (
    <div
      data-slot="ai-insight-card"
      className={cn(
        "relative flex flex-col gap-[var(--hc-space-12)]",
        "rounded-[var(--hc-radius-control)] border",
        /* Violet AI-token frame — the visual signature that marks the
           content as AI-generated. Left accent bar is stronger; the
           background stays a subtle wash. */
        "border-[color:var(--hc-color-violet-200)]",
        "bg-[color:var(--hc-color-ai-subtle-bg)]",
        "p-[var(--hc-space-16)]",
        /* Left accent bar via ::before-style inset box-shadow. */
        "shadow-[inset_3px_0_0_var(--hc-color-ai-default)]",
        className,
      )}
      {...rest}
    >
      <div className="flex items-start gap-3">
        <div
          data-slot="ai-insight-card-icon"
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            "bg-[color:var(--hc-color-violet-100)] text-[color:var(--hc-color-ai-default)]",
            "[&>svg]:size-4",
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div
            data-slot="ai-insight-card-title"
            className={cn(
              "text-[15px] font-semibold leading-tight",
              "text-[color:var(--hc-color-text-primary)]",
            )}
          >
            {title}
          </div>
          {description && !loading && (
            <div
              data-slot="ai-insight-card-description"
              className={cn(
                "mt-1 text-[13px] leading-relaxed",
                "text-[color:var(--hc-color-text-secondary)]",
              )}
            >
              {description}
            </div>
          )}
          {loading && (
            <div className="mt-2 flex flex-col gap-1.5">
              <div className="h-[12px] w-[80%] animate-pulse rounded-[4px] bg-[color:var(--hc-color-violet-100)]" />
              <div className="h-[12px] w-[60%] animate-pulse rounded-[4px] bg-[color:var(--hc-color-violet-100)]" />
            </div>
          )}
        </div>
      </div>

      {children}

      {provenance && (
        <div
          data-slot="ai-insight-card-provenance"
          className={cn(
            "flex items-center gap-1.5",
            "text-[11px] font-medium uppercase tracking-widest",
            "text-[color:var(--hc-color-violet-700)]",
          )}
        >
          <span
            aria-hidden="true"
            className="inline-block size-1.5 rounded-full bg-[color:var(--hc-color-ai-default)]"
          />
          {provenance}
        </div>
      )}

      {hasActions && (
        <div
          data-slot="ai-insight-card-actions"
          className="mt-1 flex flex-wrap items-center gap-2"
        >
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X />
              {dismissLabel}
            </Button>
          )}
          {onAccept && (
            <Button variant="default" size="sm" onClick={onAccept}>
              <Check />
              {acceptLabel}
            </Button>
          )}
          {extraActions}
        </div>
      )}
    </div>
  );
}
