import { useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../../components/button";

/**
 * StepChecklist — a list of process steps that are marked done.
 *
 * Not a form: each step shows a completion tick (done) or an empty
 * circle (to do), with an optional date on the right. Clicking a step
 * toggles it. Done steps keep their label (no strike-through) in a
 * quieter colour. Steps can optionally be removed, with a confirm.
 *
 *   <StepChecklist
 *     ariaLabel="Vendor progress"
 *     steps={[
 *       { id: "plan", label: "Action plan generated", done: true, meta: "Oct 20, 2026" },
 *       { id: "email", label: "Email sent to vendor", done: false },
 *     ]}
 *     onToggle={(id) => toggle(id)}
 *     onRemove={(id) => remove(id)}   // optional
 *   />
 *
 * Pair with Progress above it for the overall percentage.
 */
export type StepChecklistStep = {
  id: string;
  label: ReactNode;
  done: boolean;
  /** Right-aligned detail, usually the completion date. */
  meta?: ReactNode;
};

export type StepChecklistProps = {
  steps: StepChecklistStep[];
  onToggle?: (id: string) => void;
  /** Enables a remove action per step (shown on hover/focus, with a confirm). */
  onRemove?: (id: string) => void;
  ariaLabel: string;
};

export function StepChecklist({ steps, onToggle, onRemove, ariaLabel }: StepChecklistProps) {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <ul aria-label={ariaLabel} data-slot="step-checklist" className="m-0 flex list-none flex-col p-0 [font-family:var(--hc-font-sans)]">
      {steps.map((step) => {
        const label = typeof step.label === "string" ? step.label : step.id;
        const marker = step.done ? (
          <CheckCircle2 aria-hidden="true" className="size-[var(--hc-space-16)] shrink-0 text-[color:var(--hc-color-status-success-fg)]" />
        ) : (
          <Circle aria-hidden="true" className="size-[var(--hc-space-16)] shrink-0 text-[color:var(--hc-color-border-strong)]" />
        );
        const text = (
          <span
            className={cn(
              "min-w-0 flex-1 text-[14px] leading-snug",
              step.done ? "text-[color:var(--hc-color-text-supporting)]" : "font-medium text-[color:var(--hc-color-text-primary)]",
            )}
          >
            {step.label}
          </span>
        );
        return (
          <li
            key={step.id}
            data-done={step.done || undefined}
            className="group flex min-h-[var(--hc-space-40)] items-center gap-[var(--hc-space-12)] border-b border-[color:var(--hc-color-border-subtle)] last:border-b-0"
          >
            {onToggle ? (
              <button
                type="button"
                role="checkbox"
                aria-checked={step.done}
                aria-label={`${label}: ${step.done ? "done" : "to do"}`}
                onClick={() => onToggle(step.id)}
                className={cn(
                  "-mx-[var(--hc-space-8)] flex min-w-0 flex-1 cursor-pointer items-center gap-[var(--hc-space-12)] self-stretch",
                  "rounded-[var(--hc-radius-control)] border-0 bg-transparent px-[var(--hc-space-8)] text-left",
                  "hover:bg-[color:var(--hc-color-bg-subtle)]",
                  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--hc-color-border-focus)]",
                )}
              >
                {marker}
                {text}
              </button>
            ) : (
              <span className="flex min-w-0 flex-1 items-center gap-[var(--hc-space-12)]">
                {marker}
                {text}
              </span>
            )}
            {step.meta != null && (
              <span className="shrink-0 text-[12px] text-[color:var(--hc-color-text-tertiary)] [font-variant-numeric:tabular-nums]">
                {step.meta}
              </span>
            )}
            {onRemove &&
              (confirming === step.id ? (
                <span className="flex shrink-0 items-center gap-[var(--hc-space-4)]">
                  <Button variant="ghost" size="xs" onClick={() => setConfirming(null)}>Keep</Button>
                  <Button variant="destructive" size="xs" onClick={() => { onRemove(step.id); setConfirming(null); }}>
                    Delete
                  </Button>
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove step: ${label}`}
                  onClick={() => setConfirming(step.id)}
                  className="opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 />
                </Button>
              ))}
          </li>
        );
      })}
    </ul>
  );
}
