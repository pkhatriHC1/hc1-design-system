import { forwardRef, createElement } from "react";
import { cn } from "../../utils/cn";
import type { PageHeaderProps } from "./PageHeader.types";

/**
 * HC1 PageHeader — the standard hero strap that sits at the top of
 * every product page: optional breadcrumb + title + optional
 * subtitle on the left, optional meta / actions on the right, optional
 * tabs row at the bottom.
 *
 * Used to be reinvented on every route with slightly different
 * spacing choices; centralizing keeps every page consistent and lets
 * design retune the type ramp once for every IQ product.
 */

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { breadcrumb, title, titleAs = "h1", subtitle, meta, actions, tabs, className, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      data-slot="page-header"
      className={cn(
        "mb-6 flex flex-col",
        tabs ? "gap-4" : "gap-3",
        className,
      )}
      {...rest}
    >
      {breadcrumb && (
        <div data-slot="page-header-breadcrumb" className="min-w-0">
          {breadcrumb}
        </div>
      )}

      <div
        data-slot="page-header-row"
        className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          {createElement(
            titleAs,
            {
              "data-slot": "page-header-title",
              className: cn(
                "m-0 mb-0.5",
                "font-bold text-[color:var(--hc-color-text-primary)]",
                "text-[24px] leading-[1.2] tracking-tight",
                "[font-family:var(--hc-font-sans)]",
              ),
            },
            title,
          )}
          {subtitle && (
            <p
              data-slot="page-header-subtitle"
              className={cn(
                "m-0",
                "text-[14px] leading-[1.5]",
                "text-[color:var(--hc-color-text-tertiary)]",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {(meta || actions) && (
          <div
            data-slot="page-header-aside"
            className="flex shrink-0 items-center gap-2"
          >
            {meta}
            {actions}
          </div>
        )}
      </div>

      {tabs && (
        <div
          data-slot="page-header-tabs"
          className="-mb-[1px] border-b border-[color:var(--hc-color-border-subtle)]"
        >
          {tabs}
        </div>
      )}
    </div>
  );
});
PageHeader.displayName = "PageHeader";
