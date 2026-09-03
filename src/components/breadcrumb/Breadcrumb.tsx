import { forwardRef, Fragment } from "react";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

import type {
  BreadcrumbCurrentProps,
  BreadcrumbItemData,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from "./Breadcrumb.types";

import { Popover } from "../popover";

/**
 * HC1 Breadcrumb — the canonical hierarchical-location primitive.
 *
 * Migrated to cva + Tailwind while preserving every dimension, colour,
 * radius and focus-ring value from the previous BEM stylesheet — the
 * public API, DOM shape, and visual output are byte-for-byte identical.
 * All spacing/colour tokens flow through `--hc-breadcrumb-*` CSS vars
 * so runtime theming still works.
 *
 * Compose with `Breadcrumb.List` + `Breadcrumb.Item` + `Breadcrumb.Link`
 * / `Breadcrumb.Current` + `Breadcrumb.Separator`, OR pass the `items`
 * shorthand. The root is a `<nav aria-label={label}>` landmark.
 */

/* ══════ CVA ═══════════════════════════════════════════════════════ */

const breadcrumbRootVariants = cva(
  cn(
    "block font-sans text-14 leading-5",
    "text-[color:var(--hc-breadcrumb-link-color)]",
  ),
);

const breadcrumbListVariants = cva(
  cn(
    "list-none p-0 m-0",
    "flex items-center flex-wrap",
    "gap-[var(--hc-breadcrumb-gap)]",
    "min-h-[var(--hc-breadcrumb-row-h)]",
  ),
);

const breadcrumbItemVariants = cva(
  cn("inline-flex items-center min-w-0"),
);

const breadcrumbLinkVariants = cva(
  cn(
    "inline-flex items-center gap-4",
    "px-[var(--hc-breadcrumb-pad-x)] py-[var(--hc-breadcrumb-pad-y)]",
    "text-[color:var(--hc-breadcrumb-link-color)]",
    "font-[inherit] no-underline cursor-pointer",
    "rounded-[var(--hc-breadcrumb-link-radius)]",
    "border-0 bg-transparent",
    "transition-[color] duration-150 ease-standard motion-reduce:duration-0",
    "hover:text-[color:var(--hc-breadcrumb-link-color-hover)] hover:underline hover:[text-underline-offset:2px]",
    "focus:outline-none",
    "focus-visible:outline focus-visible:outline-[length:var(--hc-breadcrumb-link-ring-width)] focus-visible:outline-[color:var(--hc-breadcrumb-link-ring-color)] focus-visible:[outline-offset:var(--hc-breadcrumb-link-ring-offset)]",
  ),
  {
    variants: {
      disabled: {
        true: cn(
          "text-[color:var(--hc-breadcrumb-link-color-disabled)]",
          "cursor-not-allowed no-underline pointer-events-none",
          "hover:text-[color:var(--hc-breadcrumb-link-color-disabled)] hover:no-underline",
        ),
        false: "",
      },
    },
    defaultVariants: { disabled: false },
  },
);

const breadcrumbLinkIconVariants = cva(
  cn("inline-flex items-center text-current [&_svg]:block"),
);

const breadcrumbLinkLabelVariants = cva(
  cn("overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px]"),
);

const breadcrumbSeparatorVariants = cva(
  cn(
    "inline-flex items-center select-none",
    "text-[color:var(--hc-breadcrumb-separator-color)]",
    "px-[var(--hc-breadcrumb-separator-gap)] py-0",
    "[&_svg]:block",
  ),
);

const breadcrumbCurrentVariants = cva(
  cn(
    "inline-flex items-center gap-4",
    "px-[var(--hc-breadcrumb-pad-x)] py-[var(--hc-breadcrumb-pad-y)]",
    "text-[color:var(--hc-breadcrumb-link-color-current)]",
    "font-[inherit] font-medium",
    "max-w-[320px] overflow-hidden text-ellipsis whitespace-nowrap",
  ),
);

const breadcrumbCurrentIconVariants = cva(
  cn("inline-flex items-center text-current [&_svg]:block"),
);

const breadcrumbEllipsisVariants = cva(
  cn(
    "inline-flex items-center justify-center",
    "size-24 p-0",
    "text-[color:var(--hc-breadcrumb-link-color)]",
    "bg-transparent border-0",
    "rounded-[var(--hc-breadcrumb-link-radius)] cursor-pointer",
    "transition-[color,background-color] duration-150 ease-standard motion-reduce:duration-0",
    "hover:text-[color:var(--hc-breadcrumb-link-color-hover)] hover:bg-bg-subtle",
    "focus:outline-none",
    "focus-visible:outline focus-visible:outline-[length:var(--hc-breadcrumb-link-ring-width)] focus-visible:outline-[color:var(--hc-breadcrumb-link-ring-color)] focus-visible:[outline-offset:var(--hc-breadcrumb-link-ring-offset)]",
  ),
);

const breadcrumbEllipsisListVariants = cva(
  cn("list-none m-0 p-0 flex flex-col gap-[2px]"),
);

const breadcrumbEllipsisRowVariants = cva(
  cn(
    "inline-flex items-center gap-8 w-full",
    "px-8 py-8",
    "text-[color:var(--hc-color-text-primary)]",
    "font-sans text-14 leading-5 no-underline",
    "rounded-[var(--hc-breadcrumb-link-radius)]",
    "transition-[background-color] duration-150 ease-standard motion-reduce:duration-0",
    "hover:bg-bg-subtle",
    "focus:outline-none",
    "focus-visible:outline focus-visible:outline-[length:var(--hc-breadcrumb-link-ring-width)] focus-visible:outline-[color:var(--hc-breadcrumb-link-ring-color)] focus-visible:[outline-offset:-2px]",
  ),
  {
    variants: {
      disabled: {
        true: cn(
          "text-[color:var(--hc-breadcrumb-link-color-disabled)]",
          "cursor-not-allowed no-underline pointer-events-none",
          "hover:bg-transparent",
        ),
        false: "",
      },
    },
    defaultVariants: { disabled: false },
  },
);

/* ══════ DEFAULT SEPARATOR + ELLIPSIS ICONS ════════════════════════ */

function CaretIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EllipsisIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  );
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    label = "Breadcrumb",
    items,
    separator,
    maxItems,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      data-slot="breadcrumb-root"
      className={cn(breadcrumbRootVariants(), className)}
      {...rest}
    >
      {children ?? renderFromItems(items ?? [], separator, maxItems)}
    </nav>
  );
});
BreadcrumbRoot.displayName = "Breadcrumb";

function renderFromItems(
  items: BreadcrumbItemData[],
  separator: ReactNode,
  maxItems?: number,
) {
  if (items.length === 0) return null;

  const shouldCollapse =
    typeof maxItems === "number" && maxItems > 1 && items.length > maxItems;

  let visible: BreadcrumbItemData[];
  let hidden: BreadcrumbItemData[] = [];
  if (shouldCollapse) {
    const tailCount = Math.max(1, maxItems - 1);
    visible = [items[0], ...items.slice(items.length - tailCount)];
    hidden  = items.slice(1, items.length - tailCount);
  } else {
    visible = items;
  }

  return (
    <BreadcrumbList>
      {visible.map((item, index) => {
        const isLast = index === visible.length - 1;
        const injectEllipsisBefore =
          shouldCollapse && index === 1 && hidden.length > 0;

        return (
          <Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}

            {injectEllipsisBefore && (
              <>
                <BreadcrumbEllipsisItem hidden={hidden} />
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              </>
            )}

            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbCurrent icon={item.icon}>{item.label}</BreadcrumbCurrent>
              ) : (
                <BreadcrumbLink
                  href={item.href}
                  disabled={item.disabled}
                  icon={item.icon}
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        );
      })}
    </BreadcrumbList>
  );
}

/* ══════ LIST ══════════════════════════════════════════════════════ */

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(function BreadcrumbList(
  { className, children, ...rest },
  ref,
) {
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListVariants(), className)}
      {...rest}
    >
      {children}
    </ol>
  );
});
BreadcrumbList.displayName = "Breadcrumb.List";

/* ══════ ITEM ══════════════════════════════════════════════════════ */

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn(breadcrumbItemVariants(), className)}
      {...rest}
    >
      {children}
    </li>
  );
});
BreadcrumbItem.displayName = "Breadcrumb.Item";

/* ══════ LINK ══════════════════════════════════════════════════════ */

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { className, children, href, disabled = false, icon, ...rest },
  ref,
) {
  const classes = cn(breadcrumbLinkVariants({ disabled }), className);
  const body = (
    <>
      {icon && (
        <span
          data-slot="breadcrumb-link-icon"
          aria-hidden="true"
          className={breadcrumbLinkIconVariants()}
        >
          {icon}
        </span>
      )}
      <span data-slot="breadcrumb-link-label" className={breadcrumbLinkLabelVariants()}>
        {children}
      </span>
    </>
  );

  if (disabled) {
    return (
      <span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        data-slot="breadcrumb-link"
        aria-disabled="true"
        className={classes}
        {...(rest as unknown as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {body}
      </span>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      data-slot="breadcrumb-link"
      className={classes}
      {...rest}
    >
      {body}
    </a>
  );
});
BreadcrumbLink.displayName = "Breadcrumb.Link";

/* ══════ SEPARATOR ═════════════════════════════════════════════════ */

const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(function BreadcrumbSeparator(
  { className, children, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn(breadcrumbSeparatorVariants(), className)}
      {...rest}
    >
      {children ?? <CaretIcon />}
    </li>
  );
});
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

/* ══════ CURRENT ═══════════════════════════════════════════════════ */

const BreadcrumbCurrent = forwardRef<HTMLSpanElement, BreadcrumbCurrentProps>(function BreadcrumbCurrent(
  { className, children, icon, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-current="page"
      data-slot="breadcrumb-current"
      className={cn(breadcrumbCurrentVariants(), className)}
      {...rest}
    >
      {icon && (
        <span
          data-slot="breadcrumb-current-icon"
          aria-hidden="true"
          className={breadcrumbCurrentIconVariants()}
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
});
BreadcrumbCurrent.displayName = "Breadcrumb.Current";

/* ══════ ELLIPSIS ITEM (used by collapsed path shorthand) ══════════ */

function BreadcrumbEllipsisItem({ hidden }: { hidden: BreadcrumbItemData[] }) {
  return (
    <li className={breadcrumbItemVariants()} data-slot="breadcrumb-item">
      <Popover placement="bottom">
        <Popover.Trigger>
          <button
            type="button"
            data-slot="breadcrumb-ellipsis"
            className={breadcrumbEllipsisVariants()}
            aria-label="Show collapsed crumbs"
          >
            <EllipsisIcon />
          </button>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Collapsed breadcrumbs" minWidth={200}>
          <ul
            data-slot="breadcrumb-ellipsis-list"
            className={breadcrumbEllipsisListVariants()}
          >
            {hidden.map((item, i) => (
              <li key={i}>
                {item.href && !item.disabled ? (
                  <a
                    href={item.href}
                    data-slot="breadcrumb-ellipsis-row"
                    className={breadcrumbEllipsisRowVariants({ disabled: false })}
                  >
                    {item.icon && (
                      <span aria-hidden="true" className="inline-flex">{item.icon}</span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <span
                    data-slot="breadcrumb-ellipsis-row"
                    className={breadcrumbEllipsisRowVariants({ disabled: true })}
                    aria-disabled={item.disabled || undefined}
                  >
                    {item.icon && (
                      <span aria-hidden="true" className="inline-flex">{item.icon}</span>
                    )}
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover>
    </li>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type BreadcrumbCompound = typeof BreadcrumbRoot & {
  List:      typeof BreadcrumbList;
  Item:      typeof BreadcrumbItem;
  Link:      typeof BreadcrumbLink;
  Separator: typeof BreadcrumbSeparator;
  Current:   typeof BreadcrumbCurrent;
};

const Breadcrumb = BreadcrumbRoot as BreadcrumbCompound;
Breadcrumb.List      = BreadcrumbList;
Breadcrumb.Item      = BreadcrumbItem;
Breadcrumb.Link      = BreadcrumbLink;
Breadcrumb.Separator = BreadcrumbSeparator;
Breadcrumb.Current   = BreadcrumbCurrent;

export {
  Breadcrumb,
  breadcrumbRootVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
  breadcrumbCurrentVariants,
};
