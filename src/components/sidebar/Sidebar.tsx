import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { SectionLabel } from "../section-label";
import type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarSectionProps,
  SidebarItemProps,
  SidebarFooterProps,
  SidebarTriggerProps,
} from "./Sidebar.types";

/**
 * HC1 Sidebar — the standard left-hand navigation for every IQ
 * product. Compose with Sidebar.Header, Sidebar.Section, Sidebar.Item,
 * and Sidebar.Footer.
 *
 * Owns: chrome (dark gradient background), collapse animation,
 * keyboard shortcut (Cmd/Ctrl+B), localStorage persistence, active
 * state visuals, hover/focus rings, tooltip-when-collapsed, ARIA
 * nav landmark, badge slot.
 *
 * Consumer owns: which nav items exist, icons, hrefs, active matching
 * (usually against the router's pathname).
 */

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(
      "Sidebar subcomponents (Header/Section/Item/Footer/Trigger) must be rendered inside a <Sidebar> or a <SidebarProvider>.",
    );
  }
  return ctx;
}

const DEFAULT_PERSIST_KEY = "hc-sidebar-collapsed";

/* ══════ SIDEBAR PROVIDER (state only, no chrome) ═════════════════ */

/**
 * Provider that supplies collapse state to <Sidebar>, <Sidebar.Trigger>,
 * and any other subcomponent — even when they render in different
 * subtrees. Wrap this above <AppShell> when the trigger lives in the
 * top-bar of AppShell.Main (outside the sidebar aside). Optional if
 * everything sits inside <Sidebar> — the Sidebar auto-provides
 * context in that case.
 */

type SidebarStateOptions = {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  persistKey?: string | false;
  keyboardShortcut?: string | false;
};

function useSidebarState({
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  persistKey = DEFAULT_PERSIST_KEY,
  keyboardShortcut = "b",
}: SidebarStateOptions): SidebarContextValue {
  const [uncontrolled, setUncontrolled] = useState<boolean>(() => {
    if (controlledCollapsed !== undefined) return controlledCollapsed;
    if (persistKey && typeof window !== "undefined") {
      try {
        const v = window.localStorage.getItem(persistKey);
        if (v === "true") return true;
        if (v === "false") return false;
      } catch {
        /* localStorage unavailable — fall through to default */
      }
    }
    return defaultCollapsed;
  });

  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : uncontrolled;

  const setCollapsed = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolled(value);
        if (persistKey && typeof window !== "undefined") {
          try {
            window.localStorage.setItem(persistKey, String(value));
          } catch {
            /* ignore */
          }
        }
      }
      onCollapsedChange?.(value);
    },
    [isControlled, onCollapsedChange, persistKey],
  );

  const toggle = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);

  useEffect(() => {
    if (!keyboardShortcut) return;
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable === true;
      if (inEditable) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === keyboardShortcut.toLowerCase()) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyboardShortcut, toggle]);

  return useMemo<SidebarContextValue>(
    () => ({ collapsed, toggle, setCollapsed }),
    [collapsed, toggle, setCollapsed],
  );
}

export type SidebarProviderProps = SidebarStateOptions & { children: ReactNode };

export function SidebarProvider(props: SidebarProviderProps) {
  const { children, ...stateOpts } = props;
  const value = useSidebarState(stateOpts);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    persistKey = DEFAULT_PERSIST_KEY,
    keyboardShortcut = "b",
    ariaLabel = "Primary",
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  /* If a SidebarProvider is already in scope, use its context and
     ignore local state props. Otherwise create local state. */
  const existingContext = useContext(SidebarContext);
  const localContext = useSidebarState({
    collapsed: controlledCollapsed,
    defaultCollapsed,
    onCollapsedChange,
    persistKey,
    keyboardShortcut,
  });

  const contextValue = existingContext ?? localContext;
  const { collapsed } = contextValue;

  /* Chrome background — fully overridable via CSS vars in a consumer
     :root. Consumer sets --hc-sidebar-bg-from/via/to (or --hc-sidebar-bg
     wholesale) to retint. Defaults chain to HC1 brand ramp. Kept as an
     inline style because Tailwind v4's arbitrary-value parser doesn't
     handle deeply-nested var() fallbacks reliably. */
  const chromeStyle = {
    background:
      "var(--hc-sidebar-bg, linear-gradient(180deg, var(--hc-sidebar-bg-from, var(--hc-color-brand-700)) 0%, var(--hc-sidebar-bg-via, var(--hc-color-brand-800)) 50%, var(--hc-sidebar-bg-to, var(--hc-color-brand-900)) 100%))",
  } as const;

  const asideEl = (
    <aside
      ref={forwardedRef}
      data-slot="sidebar"
      data-state={collapsed ? "collapsed" : "expanded"}
      aria-label={ariaLabel}
      style={chromeStyle}
      className={cn(
        /* Fixed height, flex column, chrome */
        "flex h-full shrink-0 flex-col",
        "text-[color:var(--hc-sidebar-fg,var(--hc-color-text-inverse))]",
        /* Width — animated between collapsed (icon-only 48px = 3rem) and
           expanded (256px = 16rem). Matches shadcn's SIDEBAR_WIDTH /
           SIDEBAR_WIDTH_ICON so consumers migrating from shadcn's copied
           sidebar see identical dimensions. */
        "transition-[width] duration-200 ease-standard motion-reduce:duration-0",
        "w-[16rem] data-[state=collapsed]:w-[3rem]",
        /* Right border for visual separation from main content */
        "border-r border-[color:var(--hc-color-border-inverse)]",
        className,
      )}
      {...rest}
    >
      {children}
    </aside>
  );

  /* Only wrap with a Provider if there isn't one already above us. */
  return existingContext ? asideEl : (
    <SidebarContext.Provider value={contextValue}>{asideEl}</SidebarContext.Provider>
  );
});
SidebarRoot.displayName = "Sidebar";

/* ══════ HEADER ════════════════════════════════════════════════════ */

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(function SidebarHeader(
  { brand, action, className, children, ...rest },
  forwardedRef,
) {
  const { collapsed } = useSidebarContext();

  return (
    <div
      ref={forwardedRef}
      data-slot="sidebar-header"
      className={cn(
        /* Padding + gap match shadcn's SidebarHeader p-2 with no
           separator border — consumers migrating from that primitive
           see identical header height. Overrideable via className. */
        "flex shrink-0 flex-col gap-2 p-2",
        "data-[collapsed=true]:px-1.5",
        className,
      )}
      data-collapsed={collapsed}
      {...rest}
    >
      {brand && (
        <div
          data-slot="sidebar-brand"
          className={cn(
            "flex items-center gap-2 px-2",
            "text-[16px] font-bold leading-tight",
            "text-[color:var(--hc-color-text-inverse)]",
          )}
        >
          {brand}
        </div>
      )}
      {action && <SidebarHeaderAction action={action} collapsed={collapsed} />}
      {children}
    </div>
  );
});
SidebarHeader.displayName = "Sidebar.Header";

function SidebarHeaderAction({
  action,
  collapsed,
}: {
  action: NonNullable<SidebarHeaderProps["action"]>;
  collapsed: boolean;
}) {
  const buttonClasses = cn(
    "flex items-center justify-center gap-2",
    /* Fully overridable via CSS vars — consumer can set
       --hc-sidebar-action-bg / -fg / -hover on Sidebar or :root
       to make the primary action match its own brand. Defaults
       chain to HC1's elevated-surface white pill. */
    "rounded-full",
    "bg-[color:var(--hc-sidebar-action-bg,var(--hc-color-bg-surface))]",
    "text-[color:var(--hc-sidebar-action-fg,var(--hc-color-text-primary))]",
    "font-semibold text-[13px] leading-tight",
    "transition-[background-color,transform] duration-150 ease-standard motion-reduce:duration-0",
    "hover:bg-[color:var(--hc-sidebar-action-hover,var(--hc-color-bg-elevated))] hover:shadow-sm",
    "focus:outline-none focus-visible:outline focus-visible:outline-2",
    "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
    "active:translate-y-px",
    /* Layout — icon-only when collapsed, full-width pill when expanded */
    collapsed ? "size-10 self-center" : "h-10 w-full px-4",
  );

  const iconEl = (
    <span
      data-slot="sidebar-header-action-icon"
      className="inline-flex shrink-0 [&>svg]:size-4"
    >
      {action.icon}
    </span>
  );

  const labelEl = !collapsed && (
    <span data-slot="sidebar-header-action-label">{action.label}</span>
  );

  if (action.href) {
    return (
      <a
        data-slot="sidebar-header-action"
        href={action.href}
        aria-label={collapsed ? action.label : undefined}
        className={buttonClasses}
      >
        {iconEl}
        {labelEl}
      </a>
    );
  }
  return (
    <button
      type="button"
      data-slot="sidebar-header-action"
      onClick={action.onClick}
      aria-label={collapsed ? action.label : undefined}
      className={buttonClasses}
    >
      {iconEl}
      {labelEl}
    </button>
  );
}

/* ══════ CONTENT WRAPPER (implicit) ═══════════════════════════════ */
/* Sections render inside a scrollable content area. The Sidebar
   composes them into a min-h-0 flex-1 overflow-y-auto container. */

/* ══════ SECTION ═══════════════════════════════════════════════════ */

const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(function SidebarSection(
  { title, className, children, ...rest },
  forwardedRef,
) {
  const { collapsed } = useSidebarContext();

  return (
    <div
      ref={forwardedRef}
      data-slot="sidebar-section"
      className={cn("flex flex-col", className)}
      {...rest}
    >
      {title && !collapsed && (
        <SectionLabel
          tone="inverse"
          className={cn(
            "px-4 pt-4 pb-1",
            /* Top divider for sections after the first — done via
               ::before-esque; simpler is a border-top when it's not
               the immediate child of section-list. Section itself has
               a mt-2 gap in the list to visually separate. */
          )}
        >
          {title}
        </SectionLabel>
      )}
      <ul
        role="list"
        data-slot="sidebar-section-list"
        className={cn(
          /* Padding + gap match shadcn's SidebarGroupContent + SidebarMenu:
             p-2 wrapper, gap-1 between items. */
          "m-0 flex list-none flex-col gap-1 p-2",
        )}
      >
        {children}
      </ul>
    </div>
  );
});
SidebarSection.displayName = "Sidebar.Section";

/* ══════ ITEM ══════════════════════════════════════════════════════ */

const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(function SidebarItem(
  props,
  forwardedRef,
) {
  const { icon, label, active, disabled, badge, tooltip, className, ...rest } = props;
  const { collapsed } = useSidebarContext();

  /* Dimensions preserved from shadcn's SidebarMenuButton size="lg" so
     consumers migrating from that primitive see byte-identical layout. */
  const commonClasses = cn(
    "group relative flex items-center gap-2 rounded-md",
    "text-[14px] leading-tight font-medium",
    "no-underline text-[color:var(--hc-color-text-inverse)]",
    "transition-[background-color,opacity] duration-150 ease-standard motion-reduce:duration-0",
    /* Layout — icon-only 32px square when collapsed (shadcn size-8),
       48px tall pill when expanded (shadcn h-12 with p-2). */
    collapsed ? "size-8 justify-center p-2" : "h-12 w-full p-2",
    /* Hover + active states */
    "hover:bg-[color:rgba(255,255,255,0.08)]",
    "aria-[current=page]:bg-[color:rgba(255,255,255,0.12)]",
    /* Focus ring */
    "focus:outline-none focus-visible:outline focus-visible:outline-2",
    "focus-visible:outline-[color:var(--hc-color-bg-surface)] focus-visible:outline-offset-[-2px]",
    /* Disabled */
    disabled && "pointer-events-none opacity-40",
    className,
  );

  const iconEl = (
    <span
      data-slot="sidebar-item-icon"
      className="inline-flex shrink-0 [&>svg]:size-4"
      aria-hidden="true"
    >
      {icon}
    </span>
  );

  const labelEl = !collapsed && (
    <span
      data-slot="sidebar-item-label"
      className="min-w-0 flex-1 truncate"
    >
      {label}
    </span>
  );

  const badgeEl = !collapsed && badge != null && (
    <span data-slot="sidebar-item-badge" className="shrink-0">
      {badge}
    </span>
  );

  /* Tooltip when collapsed. Simple CSS-driven, no Radix dep — appears
     on hover/focus to the right of the item. */
  const collapsedTooltipEl = collapsed && (
    <span
      role="tooltip"
      data-slot="sidebar-item-tooltip"
      className={cn(
        "pointer-events-none absolute left-full top-1/2 z-tooltip ml-2 -translate-y-1/2",
        "whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-medium",
        "bg-[color:var(--hc-color-bg-inverse)] text-[color:var(--hc-color-text-inverse)]",
        "shadow-md",
        "opacity-0 transition-opacity duration-150 ease-standard motion-reduce:duration-0",
        "group-hover:opacity-100 group-focus-visible:opacity-100",
      )}
    >
      {tooltip ?? label}
    </span>
  );

  /* Anchor form when href is provided; button form otherwise. */
  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as { href: string };
    return (
      <li className="list-none">
        <a
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          data-slot="sidebar-item"
          data-active={active || undefined}
          href={href}
          aria-current={active ? "page" : undefined}
          aria-disabled={disabled || undefined}
          className={commonClasses}
          {...anchorRest}
        >
          {iconEl}
          {labelEl}
          {badgeEl}
          {collapsedTooltipEl}
        </a>
      </li>
    );
  }

  const buttonRest = rest as {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  return (
    <li className="list-none">
      <button
        ref={forwardedRef as React.Ref<HTMLButtonElement>}
        type="button"
        data-slot="sidebar-item"
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        disabled={disabled}
        onClick={buttonRest.onClick}
        className={commonClasses}
      >
        {iconEl}
        {labelEl}
        {badgeEl}
        {collapsedTooltipEl}
      </button>
    </li>
  );
});
SidebarItem.displayName = "Sidebar.Item";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(function SidebarFooter(
  { className, children, ...rest },
  forwardedRef,
) {
  const { collapsed } = useSidebarContext();
  if (collapsed) {
    /* Footer content is usually meta text — hidden when collapsed */
    return null;
  }
  return (
    <div
      ref={forwardedRef}
      data-slot="sidebar-footer"
      className={cn(
        /* Matches shadcn's SidebarFooter defaults: flex-col gap-2 p-2. */
        "flex shrink-0 flex-col gap-2 p-2",
        "text-[12px] leading-tight",
        "text-[color:var(--hc-color-text-inverse)] opacity-45",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
SidebarFooter.displayName = "Sidebar.Footer";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(function SidebarTrigger(
  { ariaLabel = "Toggle sidebar", className, ...rest },
  forwardedRef,
) {
  const { collapsed, toggle } = useSidebarContext();
  return (
    <button
      ref={forwardedRef}
      type="button"
      data-slot="sidebar-trigger"
      aria-label={ariaLabel}
      aria-expanded={!collapsed}
      onClick={toggle}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md",
        "text-[color:var(--hc-color-text-secondary)]",
        "transition-colors duration-150 ease-standard motion-reduce:duration-0",
        "hover:bg-[color:var(--hc-color-bg-subtle)] hover:text-[color:var(--hc-color-text-primary)]",
        "focus:outline-none focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-2",
        className,
      )}
      {...rest}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = "Sidebar.Trigger";

/* ══════ CONTENT SCROLL WRAPPER (auto-wrapped around sections) ═════ */

function SidebarContent({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="sidebar-content"
      className="min-h-0 flex-1 overflow-y-auto py-3"
    >
      {children}
    </div>
  );
}

/* ══════ COMPOSITION ROOT — auto-splits header/content/footer ═════ */

/* We could require consumers to manually wrap sections in a scroll
   container, but it's the same layout every time. Auto-wrap by
   filtering children into three buckets by displayName. */

const SidebarRootWithAutoContent = forwardRef<HTMLElement, SidebarProps>(
  function SidebarRootAuto(props, forwardedRef) {
    const { children, ...rest } = props;
    /* React Children.map preserves keys but we need to bucket by
       type. Do it inline. */
    const bucketed = bucketSidebarChildren(children);

    return (
      <SidebarRoot ref={forwardedRef} {...rest}>
        {bucketed.header}
        <SidebarContent>{bucketed.content}</SidebarContent>
        {bucketed.footer}
      </SidebarRoot>
    );
  },
);
SidebarRootWithAutoContent.displayName = "Sidebar";

function bucketSidebarChildren(children: ReactNode): {
  header: ReactNode;
  content: ReactNode[];
  footer: ReactNode;
} {
  const header: ReactNode[] = [];
  const footer: ReactNode[] = [];
  const content: ReactNode[] = [];

  /* React.Children.toArray flattens nested arrays and applies keys —
     handles the common {items.map(...)} pattern that produces a
     nested array within children. */
  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child)) return;
    const displayName = (child.type as { displayName?: string } | undefined)?.displayName;
    if (displayName === "Sidebar.Header") header.push(child);
    else if (displayName === "Sidebar.Footer") footer.push(child);
    else content.push(child);
  });

  return { header, content, footer };
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type SidebarCompound = typeof SidebarRootWithAutoContent & {
  Header: typeof SidebarHeader;
  Section: typeof SidebarSection;
  Item: typeof SidebarItem;
  Footer: typeof SidebarFooter;
  Trigger: typeof SidebarTrigger;
};

const Sidebar = SidebarRootWithAutoContent as SidebarCompound;
Sidebar.Header = SidebarHeader;
Sidebar.Section = SidebarSection;
Sidebar.Item = SidebarItem;
Sidebar.Footer = SidebarFooter;
Sidebar.Trigger = SidebarTrigger;

export { Sidebar, useSidebarContext };
