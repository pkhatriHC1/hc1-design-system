import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * DetailPage — the standard record-detail template.
 *
 * Vertical stack: identity strip (optional) → PageHeader (with tabs) →
 * two-column body with main content and an optional right rail.
 *
 *   ┌────────────────────────────────────────────────────┐
 *   │ identity (PatientIdentityStrip / opt)              │
 *   ├────────────────────────────────────────────────────┤
 *   │ header (PageHeader with tabs)                      │
 *   ├──────────────────────────────┬─────────────────────┤
 *   │                              │                     │
 *   │ main (page content)          │ sidebar (opt)       │
 *   │ ─ 2/3 width on wide screens  │ 1/3 width           │
 *   │                              │                     │
 *   └──────────────────────────────┴─────────────────────┘
 *
 * If `sidebar` is omitted, `main` stretches full-width. On narrow
 * viewports both columns stack vertically.
 */

export type DetailPageProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Optional identity strap pinned at the top — typically a
   * PatientIdentityStrip. Renders above the PageHeader so users see
   * "which record" before "what section".
   */
  identity?: ReactNode;
  /** PageHeader — title + breadcrumb + tabs + actions. */
  header?: ReactNode;
  /** Right rail — metadata card, related records, timeline. */
  sidebar?: ReactNode;
  /** Main content region — the tab body typically. */
  children?: ReactNode;
  /** Vertical gap between regions in px. @default 24 */
  gap?: number;
};

export function DetailPage({
  identity,
  header,
  sidebar,
  children,
  gap = 24,
  className,
  style,
  ...rest
}: DetailPageProps) {
  return (
    <div
      data-slot="detail-page"
      className={cn("flex flex-col", className)}
      style={{ gap, ...style }}
      {...rest}
    >
      {identity && (
        <div data-slot="detail-page-identity" className="min-w-0">
          {identity}
        </div>
      )}
      {header && (
        <div data-slot="detail-page-header" className="min-w-0">
          {header}
        </div>
      )}
      {(children || sidebar) && (
        <div
          data-slot="detail-page-body"
          className={cn(
            "grid grid-cols-1 min-w-0",
            sidebar ? "lg:grid-cols-3" : "",
          )}
          style={{ gap }}
        >
          {children && (
            <div
              data-slot="detail-page-main"
              className={cn("min-w-0", sidebar && "lg:col-span-2")}
            >
              {children}
            </div>
          )}
          {sidebar && (
            <div data-slot="detail-page-sidebar" className="min-w-0">
              {sidebar}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
