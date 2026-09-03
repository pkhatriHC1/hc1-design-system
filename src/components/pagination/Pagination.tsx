import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  PaginationInfoProps,
  PaginationNextProps,
  PaginationPageListProps,
  PaginationPageProps,
  PaginationPageSizeProps,
  PaginationPreviousProps,
  PaginationProps,
  PaginationSize,
  PaginationWindowItem,
} from "./Pagination.types";

/**
 * HC1 Pagination — the canonical navigation primitive for paged data.
 *
 * Migrated from Pagination.css to shadcn-style (cva + Tailwind utilities).
 * No Radix wrap — Pagination is a presentational primitive on native
 * <nav> + <button> + <select>. The prop API, DOM structure, page-window
 * algorithm, and a11y wiring are preserved verbatim; every color, height,
 * padding, and state maps 1:1 to the same --hc-* alias the previous
 * Pagination.css consumed.
 *
 * Size propagates from root → subcomponents via CSS custom properties
 * set on the root by the `size` cva variant:
 *   --hc-pagination-btn-size    — square page-button height + min-width
 *   --hc-pagination-font-size   — button + info + select font-size
 *   --hc-pagination-nav-pad     — horizontal padding on Prev/Next
 *   --hc-pagination-icon-size   — chevron size inside Prev/Next
 *
 * Change size on the root, everything scales.
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type PaginationContextValue = {
  page: number;
  pageCount: number;
  size: PaginationSize;
  siblingCount: number;
  boundaryCount: number;
  disabled: boolean;
  loading: boolean;

  pageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;

  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  /** Stable id prefix so subcomponents can compose ids without collisions. */
  idBase: string;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext(source: string): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Pagination] ${source} must be rendered inside a <Pagination> parent.`,
    );
  }
  return ctx;
}

/* ══════ PAGE-WINDOW ALGORITHM ═════════════════════════════════════
 * Standard book-end + siblings window. Always shows `boundaryCount`
 * pages at the start and end, and `siblingCount` pages on each side
 * of the current page. Gaps of two or more collapse into an ellipsis;
 * gaps of one render the missing page (no ellipsis that just replaces
 * a single page — that's noise). */

export function buildPageWindow(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationWindowItem[] {
  const safePageCount = Math.max(1, Math.floor(pageCount));
  const safePage      = clamp(Math.floor(page), 1, safePageCount);
  const sibling       = Math.max(0, Math.floor(siblingCount));
  const boundary      = Math.max(0, Math.floor(boundaryCount));

  const startPages = range(1, Math.min(boundary, safePageCount));
  const endPages   = range(
    Math.max(safePageCount - boundary + 1, boundary + 1),
    safePageCount,
  );

  const siblingsStart = Math.max(
    Math.min(safePage - sibling, safePageCount - boundary - sibling * 2 - 1),
    boundary + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(safePage + sibling, boundary + sibling * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : safePageCount - 1,
  );

  const items: PaginationWindowItem[] = [];

  for (const p of startPages) items.push({ type: "page", page: p });

  if (siblingsStart > boundary + 2) {
    items.push({ type: "ellipsis", key: "start" });
  } else if (boundary + 1 < safePageCount - boundary) {
    items.push({ type: "page", page: boundary + 1 });
  }

  for (const p of range(siblingsStart, siblingsEnd)) {
    items.push({ type: "page", page: p });
  }

  if (siblingsEnd < safePageCount - boundary - 1) {
    items.push({ type: "ellipsis", key: "end" });
  } else if (safePageCount - boundary > boundary) {
    items.push({ type: "page", page: safePageCount - boundary });
  }

  for (const p of endPages) items.push({ type: "page", page: p });

  return dedupeAdjacent(items);
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function dedupeAdjacent(items: PaginationWindowItem[]): PaginationWindowItem[] {
  const out: PaginationWindowItem[] = [];
  const seenPages = new Set<number>();
  for (const item of items) {
    if (item.type === "page") {
      if (seenPages.has(item.page)) continue;
      seenPages.add(item.page);
    }
    const prev = out[out.length - 1];
    if (prev && prev.type === "ellipsis" && item.type === "ellipsis") continue;
    out.push(item);
  }
  return out;
}

/* ══════ CVA — ROOT ════════════════════════════════════════════════ */

const paginationRootVariants = cva(
  cn(
    "flex items-center justify-between flex-wrap min-w-0 box-border",
    "font-sans text-neutral-900",
    "gap-[var(--hc-pagination-outer-gap)]",
    "text-[length:var(--hc-pagination-font-size)]",
    /* Outer gap default (16 — between Info / List / PageSize). */
    "[--hc-pagination-outer-gap:var(--hc-space-16)]",
  ),
  {
    variants: {
      size: {
        sm: cn(
          "[--hc-pagination-btn-size:28px]",
          "[--hc-pagination-font-size:var(--hc-font-size-12)]",
          "[--hc-pagination-nav-pad:var(--hc-space-8)]",
          "[--hc-pagination-icon-size:14px]",
          "[--hc-pagination-gap:var(--hc-space-4)]",
        ),
        md: cn(
          "[--hc-pagination-btn-size:36px]",
          "[--hc-pagination-font-size:var(--hc-font-size-14)]",
          "[--hc-pagination-nav-pad:var(--hc-space-12)]",
          "[--hc-pagination-icon-size:16px]",
          "[--hc-pagination-gap:var(--hc-space-4)]",
        ),
        lg: cn(
          "[--hc-pagination-btn-size:44px]",
          "[--hc-pagination-font-size:var(--hc-font-size-16)]",
          "[--hc-pagination-nav-pad:var(--hc-space-16)]",
          "[--hc-pagination-icon-size:18px]",
          "[--hc-pagination-gap:var(--hc-space-4)]",
        ),
      },
      loading: {
        true:  "opacity-[0.72]",
        false: "",
      },
      disabled: {
        true:  "opacity-60",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      loading: false,
      disabled: false,
    },
  },
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const PaginationRoot = forwardRef<HTMLElement, PaginationProps>(function PaginationRoot(
  {
    page,
    pageCount,
    onPageChange,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    totalItems,
    size = "md",
    siblingCount = 1,
    boundaryCount = 1,
    disabled = false,
    loading = false,
    className,
    style,
    children,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  },
  ref,
) {
  const idBase = useId();

  const contextValue = useMemo<PaginationContextValue>(
    () => ({
      page,
      pageCount: Math.max(1, pageCount),
      size,
      siblingCount,
      boundaryCount,
      disabled,
      loading,
      pageSize,
      pageSizeOptions,
      totalItems,
      onPageChange,
      onPageSizeChange,
      idBase,
    }),
    [page, pageCount, size, siblingCount, boundaryCount, disabled, loading, pageSize, pageSizeOptions, totalItems, onPageChange, onPageSizeChange, idBase],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <nav
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        data-slot="pagination-root"
        style={style as CSSProperties}
        className={cn(
          paginationRootVariants({
            size,
            loading,
            disabled,
          } as VariantProps<typeof paginationRootVariants>),
          className,
        )}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
});
PaginationRoot.displayName = "Pagination";

/* ══════ INFO ══════════════════════════════════════════════════════ */

const PaginationInfo = forwardRef<HTMLDivElement, PaginationInfoProps>(function PaginationInfo(
  { render, className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Info");

  const content = useMemo<ReactNode>(() => {
    if (children != null) return children;

    const firstItem =
      ctx.pageSize != null ? (ctx.page - 1) * ctx.pageSize + 1 : undefined;
    const lastItem =
      ctx.pageSize != null && ctx.totalItems != null
        ? Math.min(ctx.page * ctx.pageSize, ctx.totalItems)
        : ctx.pageSize != null
        ? ctx.page * ctx.pageSize
        : undefined;

    if (render) {
      return render({
        page: ctx.page,
        pageCount: ctx.pageCount,
        pageSize: ctx.pageSize,
        totalItems: ctx.totalItems,
        firstItem,
        lastItem,
      });
    }

    if (ctx.pageSize != null && ctx.totalItems != null) {
      return (
        <>
          Showing{" "}
          <strong className="text-neutral-900 font-semibold">{fmt(firstItem!)}</strong>
          –<strong className="text-neutral-900 font-semibold">{fmt(lastItem!)}</strong> of{" "}
          <strong className="text-neutral-900 font-semibold">{fmt(ctx.totalItems)}</strong>
        </>
      );
    }
    return (
      <>
        Page <strong className="text-neutral-900 font-semibold">{fmt(ctx.page)}</strong> of{" "}
        <strong className="text-neutral-900 font-semibold">{fmt(ctx.pageCount)}</strong>
      </>
    );
  }, [children, render, ctx.page, ctx.pageCount, ctx.pageSize, ctx.totalItems]);

  return (
    <div
      ref={ref}
      aria-live="polite"
      data-slot="pagination-info"
      className={cn(
        "text-neutral-700 min-w-0",
        "text-[length:var(--hc-pagination-font-size)]",
        "[font-variant-numeric:tabular-nums]",
        className,
      )}
      {...rest}
    >
      {content}
    </div>
  );
});
PaginationInfo.displayName = "Pagination.Info";

function fmt(n: number): string {
  return n.toLocaleString();
}

/* ══════ PAGE LIST ═════════════════════════════════════════════════ */

const PaginationPageList = forwardRef<HTMLUListElement, PaginationPageListProps>(function PaginationPageList(
  { className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.PageList");

  const items = useMemo(
    () => buildPageWindow(ctx.page, ctx.pageCount, ctx.siblingCount, ctx.boundaryCount),
    [ctx.page, ctx.pageCount, ctx.siblingCount, ctx.boundaryCount],
  );

  const auto = children == null;

  return (
    <ul
      ref={ref}
      data-slot="pagination-list"
      className={cn(
        "list-none m-0 p-0",
        "flex items-center flex-wrap min-w-0",
        "gap-[var(--hc-pagination-gap)]",
        className,
      )}
      {...rest}
    >
      {auto
        ? items.map((item, i) =>
            item.type === "ellipsis" ? (
              <li key={`e-${item.key}-${i}`} data-slot="pagination-item" className="flex items-center">
                <Ellipsis />
              </li>
            ) : (
              <li key={`p-${item.page}`} data-slot="pagination-item" className="flex items-center">
                <PaginationPage page={item.page} />
              </li>
            ),
          )
        : children}
    </ul>
  );
});
PaginationPageList.displayName = "Pagination.PageList";

function Ellipsis() {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center select-none",
        "min-w-[var(--hc-pagination-btn-size)] h-[var(--hc-pagination-btn-size)]",
        "text-neutral-500",
        "text-[length:var(--hc-pagination-font-size)]",
      )}
    >
      &hellip;
    </span>
  );
}

/* ══════ CVA — PAGE BUTTON ═════════════════════════════════════════ */

const paginationButtonVariants = cva(
  cn(
    "appearance-none m-0 p-0 cursor-pointer select-none",
    "bg-white text-neutral-900 border border-neutral-200 rounded-control",
    "min-w-[var(--hc-pagination-btn-size)] h-[var(--hc-pagination-btn-size)]",
    "px-8",
    "inline-flex items-center justify-center gap-4",
    "font-[inherit] font-medium leading-none",
    "text-[length:var(--hc-pagination-font-size)]",
    "[font-variant-numeric:tabular-nums]",
    "transition-[background-color,border-color,color] duration-150 ease-standard motion-reduce:duration-0",
    /* Hover / active only when not disabled and not current. */
    "not-disabled:not-data-[current=true]:hover:bg-neutral-100",
    "not-disabled:not-data-[current=true]:hover:border-neutral-300",
    "not-disabled:not-data-[current=true]:active:bg-neutral-200",
    /* Focus ring — 2px brand outline, 2px offset. */
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    /* Disabled */
    "disabled:cursor-not-allowed disabled:text-neutral-400 disabled:border-neutral-100 disabled:bg-white",
    /* Current page — brand fill + inverse ink. */
    "data-[current=true]:bg-brand-500 data-[current=true]:border-brand-500",
    "data-[current=true]:text-white data-[current=true]:font-semibold",
    "data-[current=true]:cursor-default",
    /* Current + disabled: keep brand tint (parent .loading opacity dims the whole thing). */
    "data-[current=true]:disabled:text-white",
    "data-[current=true]:disabled:bg-brand-500 data-[current=true]:disabled:border-brand-500",
  ),
);

/* ══════ PAGE ══════════════════════════════════════════════════════ */

const PaginationPage = forwardRef<HTMLButtonElement, PaginationPageProps>(function PaginationPage(
  { page, disabled, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Page");
  const isCurrent = page === ctx.page;
  const isDisabled = disabled ?? (ctx.disabled || ctx.loading);

  return (
    <button
      ref={ref}
      type="button"
      data-slot="pagination-page"
      data-current={isCurrent || undefined}
      onClick={() => {
        if (isDisabled || isCurrent) return;
        ctx.onPageChange?.(page);
      }}
      disabled={isDisabled}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={ariaLabel ?? (isCurrent ? `Page ${page}, current page` : `Go to page ${page}`)}
      className={cn(paginationButtonVariants(), className)}
      {...rest}
    >
      {children ?? fmt(page)}
    </button>
  );
});
PaginationPage.displayName = "Pagination.Page";

/* ══════ PREVIOUS ══════════════════════════════════════════════════ */

const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationPreviousProps>(function PaginationPrevious(
  { label = "Previous", labelHidden = false, disabled, className, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Previous");
  const isDisabled = (disabled ?? false) || ctx.disabled || ctx.loading || ctx.page <= 1;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="pagination-prev"
      onClick={() => {
        if (isDisabled) return;
        ctx.onPageChange?.(ctx.page - 1);
      }}
      disabled={isDisabled}
      aria-label={label}
      className={cn(
        paginationButtonVariants(),
        "px-[var(--hc-pagination-nav-pad)]",
        /* Chevron sizing lives on the button because the SVG element inside
           doesn't get its own size utility class. */
        "[&_svg]:size-[var(--hc-pagination-icon-size)] [&_svg]:block [&_svg]:text-current",
        className,
      )}
      {...rest}
    >
      <ChevronLeftIcon />
      {label && (labelHidden
        ? <span className="sr-only">{label}</span>
        : <span data-slot="pagination-nav-label" className="font-medium">{label}</span>
      )}
    </button>
  );
});
PaginationPrevious.displayName = "Pagination.Previous";

/* ══════ NEXT ══════════════════════════════════════════════════════ */

const PaginationNext = forwardRef<HTMLButtonElement, PaginationNextProps>(function PaginationNext(
  { label = "Next", labelHidden = false, disabled, className, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Next");
  const isDisabled = (disabled ?? false) || ctx.disabled || ctx.loading || ctx.page >= ctx.pageCount;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="pagination-next"
      onClick={() => {
        if (isDisabled) return;
        ctx.onPageChange?.(ctx.page + 1);
      }}
      disabled={isDisabled}
      aria-label={label}
      className={cn(
        paginationButtonVariants(),
        "px-[var(--hc-pagination-nav-pad)]",
        "[&_svg]:size-[var(--hc-pagination-icon-size)] [&_svg]:block [&_svg]:text-current",
        className,
      )}
      {...rest}
    >
      {label && (labelHidden
        ? <span className="sr-only">{label}</span>
        : <span data-slot="pagination-nav-label" className="font-medium">{label}</span>
      )}
      <ChevronRightIcon />
    </button>
  );
});
PaginationNext.displayName = "Pagination.Next";

/* ══════ PAGE SIZE ═════════════════════════════════════════════════ */

const PaginationPageSize = forwardRef<HTMLDivElement, PaginationPageSizeProps>(function PaginationPageSize(
  { label = "Per page", labelHidden = false, className, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.PageSize");
  const selectId = `${ctx.idBase}-page-size`;

  if (!ctx.pageSizeOptions || ctx.pageSizeOptions.length === 0) return null;
  if (!ctx.onPageSizeChange) return null;

  const isDisabled = ctx.disabled || ctx.loading;

  return (
    <div
      ref={ref}
      data-slot="pagination-page-size"
      className={cn(
        "inline-flex items-center gap-8 min-w-0",
        "text-neutral-700",
        "text-[length:var(--hc-pagination-font-size)]",
        className,
      )}
      {...rest}
    >
      <label
        htmlFor={selectId}
        data-slot="pagination-page-size-label"
        className={cn(
          "text-inherit font-medium",
          labelHidden && "sr-only",
        )}
      >
        {label}
      </label>
      <select
        id={selectId}
        value={ctx.pageSize}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          ctx.onPageSizeChange?.(next);
        }}
        disabled={isDisabled}
        data-slot="pagination-page-size-select"
        className={cn(
          "appearance-none [-webkit-appearance:none]",
          "bg-white text-neutral-900 border border-neutral-200 rounded-control cursor-pointer",
          "h-[var(--hc-pagination-btn-size)]",
          "pl-12 pr-24",
          "font-[inherit] font-medium leading-none",
          "text-[length:var(--hc-pagination-font-size)]",
          "[font-variant-numeric:tabular-nums]",
          /* Chevron via inline SVG so no external icon dependency. Same
             hex (#647880) as the original Pagination.css. */
          "bg-no-repeat bg-[right_8px_center] bg-[length:14px_14px]",
          "bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22><path%20d=%22M4%206%20L8%2010%20L12%206%22%20stroke=%22%23647880%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/></svg>')]",
          "transition-[background-color,border-color] duration-150 ease-standard motion-reduce:duration-0",
          "not-disabled:hover:border-neutral-300",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
        )}
      >
        {ctx.pageSizeOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
});
PaginationPageSize.displayName = "Pagination.PageSize";

/* ══════ ICONS ═════════════════════════════════════════════════════ */

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 3 L11 8 L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type PaginationCompound = typeof PaginationRoot & {
  Info:     typeof PaginationInfo;
  PageList: typeof PaginationPageList;
  Page:     typeof PaginationPage;
  Previous: typeof PaginationPrevious;
  Next:     typeof PaginationNext;
  PageSize: typeof PaginationPageSize;
};

const Pagination = PaginationRoot as PaginationCompound;
Pagination.Info     = PaginationInfo;
Pagination.PageList = PaginationPageList;
Pagination.Page     = PaginationPage;
Pagination.Previous = PaginationPrevious;
Pagination.Next     = PaginationNext;
Pagination.PageSize = PaginationPageSize;

export {
  Pagination,
  usePaginationContext,
  paginationRootVariants,
  paginationButtonVariants,
};
