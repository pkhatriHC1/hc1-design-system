import { Fragment, forwardRef } from "react";
import type { ReactNode } from "react";
import { Bell, ChevronDown, CircleHelp, Search, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { DropdownMenu } from "../dropdown-menu";
import type { AppShellTopBarProps } from "./AppShell.types";

/**
 * AppShell.TopBar — the hc1 top bar, identical in every product.
 *
 * MODULAR, NOT CUSTOMISABLE (decision 2026-11-11). The bar has fixed
 * slots in a fixed order. A product switches optional slots on by
 * passing their prop; it never moves, restyles, or adds a slot.
 *
 *   ┌──────────────────────────────────────────────────────────────────┐
 *   │ [logo] Product │ Context        Search  [IQ Assistant] 🔔  ?  User │
 *   └──────────────────────────────────────────────────────────────────┘
 *     required        optional        optional  optional  opt  opt  required
 *
 * There is deliberately no `className`, `style` or `children`: those
 * are how products drifted apart. Need a slot that isn't here? Propose
 * it for the design system — don't build it in the product.
 */
export const AppShellTopBar = forwardRef<HTMLElement, AppShellTopBarProps>(
  function AppShellTopBar(
    { product, context, search, assistant, notifications, help, user },
    forwardedRef,
  ) {
    const hasCount = notifications?.count != null && notifications.count > 0;

    return (
      <header
        ref={forwardedRef}
        data-slot="app-shell-topbar"
        className={cn(
          "flex shrink-0 items-center justify-between gap-[var(--hc-space-16)]",
          "h-[var(--hc-shell-topbar-height)] px-[var(--hc-shell-topbar-pad-x)]",
          "bg-[color:var(--hc-color-bg-surface)]",
          "border-b border-[color:var(--hc-color-border-subtle)]",
          "[font-family:var(--hc-font-sans)]",
        )}
      >
        {/* ── Left: product (required) + context (optional) ── */}
        <div className="flex min-w-0 items-center gap-[var(--hc-space-12)]">
          <ProductMark product={product} />
          {context != null && (
            <>
              <span
                aria-hidden="true"
                className="h-[var(--hc-space-24)] w-px shrink-0 bg-[color:var(--hc-color-border-default)]"
              />
              <div
                data-slot="app-shell-topbar-context"
                className="min-w-0 truncate text-[14px] font-semibold text-[color:var(--hc-color-text-primary)]"
              >
                {context}
              </div>
            </>
          )}
        </div>

        {/* ── Right: optional slots in fixed order, then user (required) ── */}
        <div className="flex shrink-0 items-center gap-[var(--hc-space-12)]">
          {search && (
            <button
              type="button"
              data-slot="app-shell-topbar-search"
              onClick={search.onOpen}
              className={cn(
                "inline-flex h-[var(--hc-field-height)] w-[240px] items-center gap-[var(--hc-space-8)]",
                "rounded-[var(--hc-radius-control)] border border-[color:var(--hc-color-border-default)]",
                "bg-[color:var(--hc-color-bg-surface)] px-[var(--hc-space-12)]",
                "text-[14px] text-[color:var(--hc-color-text-tertiary)]",
                "hover:border-[color:var(--hc-color-border-strong)]",
                "focus:outline-none focus-visible:outline focus-visible:outline-2",
                "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
              )}
            >
              <Search aria-hidden="true" className="size-[var(--hc-space-16)] shrink-0" />
              <span className="flex-1 truncate text-left">{search.placeholder ?? "Search"}</span>
              {search.shortcut && (
                <kbd className="rounded-[var(--hc-radius-chip)] border border-[color:var(--hc-color-border-default)] px-[var(--hc-space-4)] text-[12px] font-medium">
                  {search.shortcut}
                </kbd>
              )}
            </button>
          )}

          {assistant && (
            <Button variant="cta" onClick={assistant.onClick} data-slot="app-shell-topbar-assistant">
              <Sparkles aria-hidden="true" />
              {assistant.label ?? "IQ Assistant"}
            </Button>
          )}

          {notifications && (
            <span className="relative inline-flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={notifications.onClick}
                aria-label={
                  hasCount ? `Notifications, ${notifications.count} unread` : "Notifications"
                }
                data-slot="app-shell-topbar-notifications"
              >
                <Bell aria-hidden="true" />
              </Button>
              {hasCount && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -right-1 -top-1",
                    "min-w-[18px] rounded-[var(--hc-radius-circular)] px-[var(--hc-space-4)]",
                    "bg-[color:var(--hc-color-action-danger)] text-center",
                    "text-[12px] font-semibold leading-[18px] text-[color:var(--hc-color-text-on-solid)]",
                  )}
                >
                  {notifications.count! > 99 ? "99+" : notifications.count}
                </span>
              )}
            </span>
          )}

          {help && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Help"
              data-slot="app-shell-topbar-help"
              onClick={help.onClick}
              {...(help.href ? { asChild: true } : {})}
            >
              {help.href ? (
                <a href={help.href} target="_blank" rel="noreferrer">
                  <CircleHelp aria-hidden="true" />
                </a>
              ) : (
                <CircleHelp aria-hidden="true" />
              )}
            </Button>
          )}

          <UserBlock user={user} />
        </div>
      </header>
    );
  },
);
AppShellTopBar.displayName = "AppShell.TopBar";

/* ══════ Pieces ═══════════════════════════════════════════════════ */

function ProductMark({ product }: { product: AppShellTopBarProps["product"] }) {
  const inner: ReactNode = (
    <>
      {product.logo && (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center [&>img]:h-[var(--hc-space-24)] [&>svg]:h-[var(--hc-space-24)]">
          {product.logo}
        </span>
      )}
      <span className="truncate text-[16px] font-bold text-[color:var(--hc-color-text-heading)]">
        {product.name}
      </span>
    </>
  );
  const classes = "inline-flex min-w-0 items-center gap-[var(--hc-space-8)] no-underline";
  return product.href ? (
    <a href={product.href} data-slot="app-shell-topbar-product" className={classes}>
      {inner}
    </a>
  ) : (
    <span data-slot="app-shell-topbar-product" className={classes}>
      {inner}
    </span>
  );
}

function UserBlock({ user }: { user: AppShellTopBarProps["user"] }) {
  const content = (
    <>
      <Avatar size="sm" name={user.name} src={user.avatarSrc} />
      <span className="hidden min-w-0 flex-col text-left leading-tight md:flex">
        <span className="truncate text-[14px] font-semibold text-[color:var(--hc-color-text-primary)]">
          {user.name}
        </span>
        {user.role && (
          <span className="truncate text-[12px] text-[color:var(--hc-color-text-tertiary)]">
            {user.role}
          </span>
        )}
      </span>
    </>
  );
  const classes = cn(
    "inline-flex items-center gap-[var(--hc-space-8)] rounded-[var(--hc-radius-control)]",
    "px-[var(--hc-space-4)] py-[var(--hc-space-4)]",
  );
  if (user.menu && user.menu.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            data-slot="app-shell-topbar-user"
            aria-label={`${user.name} — account menu`}
            className={cn(
              classes,
              "hover:bg-[color:var(--hc-color-bg-subtle)] data-[state=open]:bg-[color:var(--hc-color-bg-subtle)]",
              "focus:outline-none focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
            )}
          >
            {content}
            <ChevronDown aria-hidden className="size-[var(--hc-space-16)] text-[color:var(--hc-color-text-tertiary)]" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="md" align="end">
          <div data-slot="app-shell-user-menu-header" className="flex items-center gap-[var(--hc-space-12)] px-[var(--hc-space-8)] py-[var(--hc-space-8)]">
            <Avatar size="md" name={user.name} src={user.avatarSrc} />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[14px] font-semibold text-[color:var(--hc-color-text-primary)]">{user.name}</span>
              {user.role && <span className="truncate text-[12px] text-[color:var(--hc-color-text-tertiary)]">{user.role}</span>}
              {user.email && <span className="truncate text-[12px] text-[color:var(--hc-color-text-tertiary)]">{user.email}</span>}
            </span>
          </div>
          <DropdownMenu.Separator />
          {user.menu.map((item) => (
            <Fragment key={item.label}>
              {item.separatorBefore && <DropdownMenu.Separator />}
              <DropdownMenu.Item destructive={item.destructive} onSelect={item.onSelect}>
                {item.icon}
                {item.label}
              </DropdownMenu.Item>
            </Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  }
  return user.onClick ? (
    <button
      type="button"
      data-slot="app-shell-topbar-user"
      onClick={user.onClick}
      className={cn(
        classes,
        "hover:bg-[color:var(--hc-color-bg-subtle)]",
        "focus:outline-none focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
      )}
    >
      {content}
    </button>
  ) : (
    <span data-slot="app-shell-topbar-user" className={classes}>
      {content}
    </span>
  );
}
