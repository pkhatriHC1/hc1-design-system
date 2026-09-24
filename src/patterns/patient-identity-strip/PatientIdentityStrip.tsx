import type { HTMLAttributes, ReactNode } from "react";
import { Avatar } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { cn } from "../../utils/cn";
import type { SeverityLevel } from "../severity-legend";

/**
 * PatientIdentityStrip — the compact identity header for every patient
 * surface.
 *
 * Persistent on every route inside a patient's chart so clinicians
 * always know which record they're looking at. Left side: Avatar +
 * name + MRN + severity Badge. Middle: meta pairs (age, sex, DOB,
 * anything the product wants to expose). Right side: consumer actions
 * (Assign, Archive, Chart, etc.).
 *
 *   <PatientIdentityStrip
 *     name="Alicia Reyes"
 *     mrn="MRN-000431"
 *     severity="critical"
 *     photo="/api/patients/431.jpg"
 *     meta={[
 *       { label: "Age", value: "62" },
 *       { label: "Sex", value: "F" },
 *       { label: "DOB", value: "1963-04-12" },
 *     ]}
 *     actions={<Button variant="outline">Assign</Button>}
 *   />
 */

const SEVERITY_LABEL: Record<SeverityLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  normal: "Normal",
};

const SEVERITY_VARIANT: Record<SeverityLevel, Parameters<typeof Badge>[0]["variant"]> = {
  critical: "danger",
  high: "warning",
  medium: "warning",
  low: "neutral",
  normal: "success",
};

export type PatientMeta = {
  label: ReactNode;
  value: ReactNode;
};

export type PatientIdentityStripProps = HTMLAttributes<HTMLDivElement> & {
  /** Patient's display name (first + last). */
  name: string;
  /** Medical Record Number — rendered in monospaced tertiary text under the name. */
  mrn: string;
  /**
   * Optional secondary identifier under the MRN — DOB, encounter id,
   * whatever the product surfaces alongside the MRN.
   */
  subline?: ReactNode;
  /** Optional patient photo. Falls back to name-derived initials on the Avatar. */
  photo?: string;
  /** Clinical severity. Renders as a colored Badge next to the name. */
  severity?: SeverityLevel;
  /** Override the Badge label ("Watch list", "In review", etc.). */
  severityLabel?: ReactNode;
  /**
   * Meta pairs — label + value rows rendered inline between the name
   * block and the actions. Wraps to a new line on narrow viewports.
   */
  meta?: PatientMeta[];
  /** Right-aligned action slot. */
  actions?: ReactNode;
  /** Compact — reduces padding + avatar size for embedding inside cards. */
  compact?: boolean;
};

export function PatientIdentityStrip({
  name,
  mrn,
  subline,
  photo,
  severity,
  severityLabel,
  meta,
  actions,
  compact = false,
  className,
  ...rest
}: PatientIdentityStripProps) {
  return (
    <div
      data-slot="patient-identity-strip"
      className={cn(
        "flex flex-wrap items-center gap-4",
        "rounded-[var(--hc-radius-control)] border",
        "border-[color:var(--hc-color-border-subtle)]",
        "bg-[color:var(--hc-color-bg-elevated)]",
        compact ? "p-[var(--hc-space-8)]" : "p-[var(--hc-space-16)]",
        className,
      )}
      {...rest}
    >
      {/* Identity — Avatar + name block */}
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size={compact ? "md" : "lg"} src={photo} name={name} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div
              data-slot="patient-identity-strip-name"
              className={cn(
                "min-w-0 truncate font-semibold leading-tight",
                compact ? "text-[15px]" : "text-[17px]",
                "text-[color:var(--hc-color-text-primary)]",
              )}
            >
              {name}
            </div>
            {severity && (
              <Badge variant={SEVERITY_VARIANT[severity]}>
                {severityLabel ?? SEVERITY_LABEL[severity]}
              </Badge>
            )}
          </div>
          <div
            data-slot="patient-identity-strip-mrn"
            className={cn(
              "font-mono text-[color:var(--hc-color-text-tertiary)]",
              compact ? "text-[11px]" : "text-[12px]",
            )}
          >
            {mrn}
            {subline && (
              <span className="ml-2 text-[color:var(--hc-color-text-tertiary)]">
                · {subline}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Meta pairs */}
      {meta && meta.length > 0 && (
        <div
          data-slot="patient-identity-strip-meta"
          className={cn(
            "flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1",
            "border-l border-[color:var(--hc-color-border-subtle)]",
            "pl-4",
          )}
        >
          {meta.map((m, i) => (
            <div key={i} className="flex flex-col leading-tight">
              <span
                className={cn(
                  "font-semibold uppercase tracking-widest",
                  "text-[color:var(--hc-color-text-tertiary)]",
                  compact ? "text-[10px]" : "text-[10px]",
                )}
              >
                {m.label}
              </span>
              <span
                className={cn(
                  compact ? "text-[13px]" : "text-[14px]",
                  "font-medium text-[color:var(--hc-color-text-primary)]",
                )}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div
          data-slot="patient-identity-strip-actions"
          className="ml-auto flex shrink-0 items-center gap-2"
        >
          {actions}
        </div>
      )}
    </div>
  );
}
