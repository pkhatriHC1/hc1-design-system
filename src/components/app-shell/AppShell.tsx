import { forwardRef } from "react";
import type { CSSProperties } from "react";
import { cn } from "../../utils/cn";
import { SidebarProvider } from "../sidebar";
import type { AppShellProps, AppShellMainProps } from "./AppShell.types";

/**
 * HC1 AppShell — the standard product-page frame.
 *
 * Thin flex container. Compose with `<Sidebar>` (which sits on the
 * left and manages its own collapse) and `<AppShell.Main>` (which
 * scrolls its own content while the sidebar stays fixed).
 *
 * Every IQ product uses the same shell so cross-page bugs get fixed
 * once at the DS level and every product picks up the fix.
 */

const AppShellRoot = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { className, children, ...rest },
  forwardedRef,
) {
  /* Wrap with SidebarProvider so Sidebar.Trigger placed anywhere
     inside AppShell (including AppShell.Main's top bar) can control
     the sidebar. If the consumer already put their own provider
     higher up, SidebarProvider composes benignly. */
  return (
    <SidebarProvider>
      <div
        ref={forwardedRef}
        data-slot="app-shell"
        className={cn(
          "flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden",
          "bg-[color:var(--hc-color-bg-page)] text-[color:var(--hc-color-text-primary)]",
          "[font-family:var(--hc-font-sans)]",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </SidebarProvider>
  );
});
AppShellRoot.displayName = "AppShell";

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

type AppShellCompound = typeof AppShellRoot & {
  Main: typeof AppShellMain;
};

const AppShell = AppShellRoot as AppShellCompound;
AppShell.Main = AppShellMain;

export { AppShell };
