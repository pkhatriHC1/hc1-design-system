import { Children, forwardRef, isValidElement } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { SidebarProvider } from "../sidebar";
import type {
  AppShellFooterProps,
  AppShellHeaderProps,
  AppShellMainProps,
  AppShellProps,
} from "./AppShell.types";

/**
 * HC1 AppShell — the standard product-page frame.
 *
 * Root walks children by displayName and lays out AppShell.Header on
 * top, AppShell.Footer on bottom, and everything else (Sidebar +
 * AppShell.Main) in the middle row. This lets consumers write:
 *
 *   <AppShell>
 *     <AppShell.Header>…</AppShell.Header>
 *     <Sidebar>…</Sidebar>
 *     <AppShell.Main>…</AppShell.Main>
 *     <AppShell.Footer>…</AppShell.Footer>
 *   </AppShell>
 *
 * …in whichever JSX order reads best, without having to remember which
 * flex direction wraps which slot.
 */

/* ══════ Root ══════════════════════════════════════════════════════ */

const AppShellRoot = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { className, children, ...rest },
  forwardedRef,
) {
  const { header, footer, content } = splitChildren(children);

  return (
    <SidebarProvider>
      <div
        ref={forwardedRef}
        data-slot="app-shell"
        className={cn(
          "flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-hidden",
          "bg-[color:var(--hc-color-bg-page)] text-[color:var(--hc-color-text-primary)]",
          "[font-family:var(--hc-font-sans)]",
          className,
        )}
        {...rest}
      >
        {header}
        <div
          data-slot="app-shell-row"
          className="flex min-h-0 flex-1 overflow-hidden"
        >
          {content}
        </div>
        {footer}
      </div>
    </SidebarProvider>
  );
});
AppShellRoot.displayName = "AppShell";

/**
 * Split children into header / footer / main-row slots by displayName.
 * Unknown children fall through to the main row so a consumer can drop
 * arbitrary composition inside without breaking the layout.
 */
function splitChildren(children: ReactNode) {
  const header: ReactElement[] = [];
  const footer: ReactElement[] = [];
  const content: ReactNode[] = [];

  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child)) {
      content.push(child);
      return;
    }
    const displayName = (child.type as { displayName?: string } | undefined)?.displayName;
    if (displayName === "AppShell.Header") header.push(child);
    else if (displayName === "AppShell.Footer") footer.push(child);
    else content.push(child);
  });

  return { header, footer, content };
}

/* ══════ Header ═══════════════════════════════════════════════════ */

const AppShellHeader = forwardRef<HTMLElement, AppShellHeaderProps>(function AppShellHeader(
  { className, style, divider = true, padding = "12px 24px", children, ...rest },
  forwardedRef,
) {
  const headerStyle: CSSProperties = { ...style, padding };
  return (
    <header
      ref={forwardedRef}
      data-slot="app-shell-header"
      className={cn(
        "flex shrink-0 items-center gap-3",
        "bg-[color:var(--hc-color-bg-surface)]",
        divider && "border-b border-[color:var(--hc-color-border-subtle)]",
        className,
      )}
      style={headerStyle}
      {...rest}
    >
      {children}
    </header>
  );
});
AppShellHeader.displayName = "AppShell.Header";

/* ══════ Footer ══════════════════════════════════════════════════ */

const AppShellFooter = forwardRef<HTMLElement, AppShellFooterProps>(function AppShellFooter(
  { className, style, divider = true, padding = "8px 24px", children, ...rest },
  forwardedRef,
) {
  const footerStyle: CSSProperties = { ...style, padding };
  return (
    <footer
      ref={forwardedRef}
      data-slot="app-shell-footer"
      className={cn(
        "flex shrink-0 items-center gap-3",
        "bg-[color:var(--hc-color-bg-surface)]",
        "text-[12px] text-[color:var(--hc-color-text-tertiary)]",
        divider && "border-t border-[color:var(--hc-color-border-subtle)]",
        className,
      )}
      style={footerStyle}
      {...rest}
    >
      {children}
    </footer>
  );
});
AppShellFooter.displayName = "AppShell.Footer";

/* ══════ Main ══════════════════════════════════════════════════ */

const AppShellMain = forwardRef<HTMLElement, AppShellMainProps>(function AppShellMain(
  { className, style, maxWidth, center = false, padding = 24, children, ...rest },
  forwardedRef,
) {
  const mainStyle: CSSProperties = { ...style, padding };
  const innerStyle: CSSProperties =
    maxWidth != null ? { maxWidth, marginInline: center ? "auto" : undefined } : {};

  return (
    <main
      ref={forwardedRef}
      data-slot="app-shell-main"
      className={cn(
        "min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
      style={mainStyle}
      {...rest}
    >
      {maxWidth != null ? <div style={innerStyle}>{children}</div> : children}
    </main>
  );
});
AppShellMain.displayName = "AppShell.Main";

/* ══════ Compound export ══════════════════════════════════════════ */

type AppShellCompound = typeof AppShellRoot & {
  Header: typeof AppShellHeader;
  Main: typeof AppShellMain;
  Footer: typeof AppShellFooter;
};

const AppShell = AppShellRoot as AppShellCompound;
AppShell.Header = AppShellHeader;
AppShell.Main = AppShellMain;
AppShell.Footer = AppShellFooter;

export { AppShell };
