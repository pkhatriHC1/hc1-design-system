import type { HTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { Button } from "../../components/button";
import { cn } from "../../utils/cn";

/**
 * Wizard — multi-step form flow with a step indicator and nav.
 *
 * Consumer owns the currentStep index + per-step content. Wizard renders
 * the numbered step indicator (with "done" checkmarks for completed
 * steps), wraps the content, and drops in Back / Next / Finish buttons
 * driven by handler props.
 *
 *   const [step, setStep] = useState(0);
 *   const steps = [
 *     { id: "account", label: "Account" },
 *     { id: "profile", label: "Profile" },
 *     { id: "confirm", label: "Confirm" },
 *   ];
 *
 *   <Wizard
 *     steps={steps}
 *     currentStep={step}
 *     onStepChange={setStep}
 *     onBack={() => setStep(step - 1)}
 *     onNext={() => setStep(step + 1)}
 *     onFinish={handleFinish}
 *   >
 *     {step === 0 && <AccountForm />}
 *     {step === 1 && <ProfileForm />}
 *     {step === 2 && <ConfirmForm />}
 *   </Wizard>
 */

export type WizardStep = {
  /** Stable id — React key + click handler target. */
  id: string;
  /** Visible step label. */
  label: ReactNode;
  /** Optional short description under the label. */
  description?: ReactNode;
};

export type WizardProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Step definitions, in visit order. */
  steps: WizardStep[];
  /** Index of the currently visible step (0-based). */
  currentStep: number;
  /**
   * Fires when the user clicks a step in the indicator. Only fires for
   * completed (past) steps — clicking a future step is suppressed so
   * the wizard flow stays linear.
   */
  onStepChange?: (index: number) => void;
  /**
   * Back handler. Renders a Back button (disabled on the first step).
   * Omit to hide Back entirely.
   */
  onBack?: () => void;
  /**
   * Next handler. Renders a Next button on every step except the last.
   */
  onNext?: () => void;
  /**
   * Finish handler. Renders a Finish button on the last step in place
   * of Next.
   */
  onFinish?: () => void;
  /** Back button label. @default 'Back' */
  backLabel?: string;
  /** Next button label. @default 'Continue' */
  nextLabel?: string;
  /** Finish button label. @default 'Finish' */
  finishLabel?: string;
  /**
   * Disable the Next / Finish button — for gating advancement on
   * validation.
   */
  canAdvance?: boolean;
  /** The current step's content. */
  children?: ReactNode;
};

export function Wizard({
  steps,
  currentStep,
  onStepChange,
  onBack,
  onNext,
  onFinish,
  backLabel = "Back",
  nextLabel = "Continue",
  finishLabel = "Finish",
  canAdvance = true,
  className,
  children,
  ...rest
}: WizardProps) {
  const isLast = currentStep >= steps.length - 1;
  const isFirst = currentStep <= 0;

  return (
    <div
      data-slot="wizard"
      className={cn("flex flex-col gap-[var(--hc-space-16)]", className)}
      {...rest}
    >
      {/* Step indicator */}
      <ol
        role="list"
        data-slot="wizard-steps"
        className="flex flex-wrap items-center gap-2"
      >
        {steps.map((step, i) => {
          const isCurrent = i === currentStep;
          const isDone = i < currentStep;
          const clickable = !!onStepChange && isDone;
          return (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                data-slot="wizard-step"
                data-current={isCurrent || undefined}
                data-done={isDone || undefined}
                aria-current={isCurrent ? "step" : undefined}
                disabled={!clickable}
                onClick={clickable ? () => onStepChange!(i) : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--hc-radius-8)] px-2 py-1",
                  "text-[13px] leading-tight",
                  "transition-colors duration-150 ease-standard motion-reduce:duration-0",
                  clickable && "hover:bg-[color:var(--hc-color-brand-50)] cursor-pointer",
                  !clickable && "cursor-default",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                    isCurrent && "bg-[color:var(--hc-color-action-primary)] text-[color:var(--hc-color-text-on-solid)]",
                    isDone && "bg-[color:var(--hc-color-brand-100)] text-[color:var(--hc-color-brand-700)]",
                    !isCurrent && !isDone && "border border-[color:var(--hc-color-border-default)] text-[color:var(--hc-color-text-tertiary)]",
                  )}
                >
                  {isDone ? <Check className="size-3" /> : i + 1}
                </span>
                <span className="flex flex-col leading-tight text-left">
                  <span
                    className={cn(
                      "font-medium",
                      isCurrent && "text-[color:var(--hc-color-text-primary)]",
                      !isCurrent && "text-[color:var(--hc-color-text-secondary)]",
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-[11px] text-[color:var(--hc-color-text-tertiary)]">
                      {step.description}
                    </span>
                  )}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-px w-6 shrink-0 bg-[color:var(--hc-color-border-default)]"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Content */}
      <div data-slot="wizard-content" className="min-w-0">
        {children}
      </div>

      {/* Nav */}
      {(onBack || onNext || onFinish) && (
        <div
          data-slot="wizard-actions"
          className="flex items-center gap-2 border-t border-[color:var(--hc-color-border-subtle)] pt-[var(--hc-space-16)]"
        >
          {onBack && (
            <Button variant="outline" onClick={onBack} disabled={isFirst}>
              {backLabel}
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            {!isLast && onNext && (
              <Button onClick={onNext} disabled={!canAdvance}>
                {nextLabel}
              </Button>
            )}
            {isLast && onFinish && (
              <Button onClick={onFinish} disabled={!canAdvance}>
                {finishLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
