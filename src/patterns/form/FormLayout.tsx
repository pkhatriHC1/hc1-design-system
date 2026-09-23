import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * Layout helpers for form scaffolding. Not RHF-aware — pure layout.
 *
 * FormSection: titled section with optional description and a stacked
 *              content region. Use to group related fields (e.g.,
 *              "Account", "Notifications") on a settings page.
 *
 * FormActions: right-aligned action row (Cancel + Submit by convention)
 *              with a top divider. Sits at the bottom of a form.
 */

export type FormSectionProps = {
  /** Section heading — reads as a subheading, not a page title. */
  title?: ReactNode;
  /** Short description under the heading. */
  description?: ReactNode;
  /** Section content — typically a stack of FormInput / FormField rows. */
  children: ReactNode;
  className?: string;
};

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-[var(--hc-space-16)] py-[var(--hc-space-16)]",
        className,
      )}
    >
      {(title || description) && (
        <header className="flex flex-col gap-[var(--hc-space-4)]">
          {title && (
            <h3 className="m-0 text-[var(--hc-font-size-16)] font-semibold text-[color:var(--hc-color-text-primary)]">
              {title}
            </h3>
          )}
          {description && (
            <p className="m-0 text-[var(--hc-font-size-14)] leading-normal text-[color:var(--hc-color-text-secondary)] max-w-[62ch]">
              {description}
            </p>
          )}
        </header>
      )}
      <div className="flex flex-col gap-[var(--hc-space-16)]">{children}</div>
    </section>
  );
}

export type FormActionsProps = {
  /**
   * Horizontal alignment of the action row.
   * `right` (default) — Cancel + Submit sit at the far right.
   * `between` — first child left, remaining children right (Back / Continue).
   * `left` — actions hug the left edge (rare; use in narrow drawers).
   * @default "right"
   */
  align?: "left" | "right" | "between";
  /**
   * Draw a divider above the action row.
   * @default true
   */
  divider?: boolean;
  /** Buttons — typically a Cancel outline + a Submit default. */
  children: ReactNode;
  className?: string;
};

export function FormActions({
  align = "right",
  divider = true,
  children,
  className,
}: FormActionsProps) {
  const justify =
    align === "right" ? "justify-end" : align === "between" ? "justify-between" : "justify-start";
  return (
    <div
      className={cn(
        "flex items-center gap-[var(--hc-space-8)] pt-[var(--hc-space-16)] mt-[var(--hc-space-16)]",
        justify,
        divider && "border-t border-[color:var(--hc-color-border-subtle)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
