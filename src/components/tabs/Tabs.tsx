import { forwardRef } from "react";
import type { CSSProperties } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type {
  TabsListProps,
  TabsPanelProps,
  TabsPanelsProps,
  TabsProps,
  TabsSize,
  TabsVariant,
  TabsTabProps,
} from "./Tabs.types";

/**
 * HC1 Tabs — the canonical section-navigation primitive.
 *
 * Migrated from a hand-built implementation (~300 lines with custom
 * keyboard nav + aria wiring) to a wrapper around @radix-ui/react-tabs.
 * Radix owns: value state, automatic activation (arrow keys focus AND
 * select — the WAI-ARIA "automatic" pattern), roving tabindex, all aria
 * attributes (role="tablist" / "tab" / "tabpanel", aria-selected,
 * aria-controls, aria-labelledby).
 *
 * We own the visual layer: size ladder via CSS custom properties on the
 * root, the underline-selection styling, hover/focus states, and the
 * icon/badge slots on each Tab.
 *
 * Public API preserved — Tabs, Tabs.List, Tabs.Tab, Tabs.Panels,
 * Tabs.Panel compose identically. useTabsContext is no longer used
 * internally (Radix owns state) but is exported as a null-returning stub
 * so no consumer breaks; migration to Radix's own hooks is a follow-up.
 */

/* ══════ SIZE CONTEXT ══════════════════════════════════════════════
   Radix Tabs doesn't expose the size prop to descendants. We bridge via
   a tiny context so Tabs.Tab can render sized chrome without prop-
   drilling. */

import { createContext, useContext } from "react";

const TabsSizeContext = createContext<TabsSize>("md");
const TabsVariantContext = createContext<TabsVariant>("underline");

/* Segmented look (SourceIQ time-frame control, 2026-11-11): filled dark
   teal pill for the active option, grey text for the rest. Used for
   picking a range or a filter; underline tabs switch views. */
const segmentedListClasses = cn(
  "inline-flex w-auto items-center gap-[var(--hc-space-4)] p-0 border-0 bg-transparent",
);
const segmentedTabClasses = cn(
  "h-[var(--hc-field-height)] px-[var(--hc-space-12)] border-0 mb-0 rounded-control",
  "text-[12px] font-semibold text-neutral-500",
  "not-disabled:hover:bg-neutral-100 not-disabled:hover:text-neutral-900",
  "data-[state=active]:bg-brand-800 data-[state=active]:text-white",
  "data-[state=active]:not-disabled:hover:bg-brand-800 data-[state=active]:not-disabled:hover:text-white",
);

/* ══════ CVA — ROOT (sets --hc-tabs-* CSS vars) ═══════════════════ */

const tabsRootVariants = cva(
  cn(
    "flex flex-col min-w-0 font-sans text-neutral-900",
  ),
  {
    variants: {
      size: {
        sm: cn(
          "[--hc-tabs-h:32px]",
          "[--hc-tabs-pad-x:var(--hc-space-12)]",
          "[--hc-tabs-gap:var(--hc-space-4)]",
          "[--hc-tabs-font-size:var(--hc-font-size-14)]",
          "[--hc-tabs-icon:14px]",
        ),
        md: cn(
          "[--hc-tabs-h:40px]",
          "[--hc-tabs-pad-x:var(--hc-space-16)]",
          "[--hc-tabs-gap:var(--hc-space-8)]",
          "[--hc-tabs-font-size:var(--hc-font-size-14)]",
          "[--hc-tabs-icon:16px]",
        ),
        lg: cn(
          "[--hc-tabs-h:48px]",
          "[--hc-tabs-pad-x:var(--hc-space-24)]",
          "[--hc-tabs-gap:var(--hc-space-8)]",
          "[--hc-tabs-font-size:var(--hc-font-size-16)]",
          "[--hc-tabs-icon:18px]",
        ),
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ══════ CVA — LIST ════════════════════════════════════════════════ */

const tabsListVariants = cva(
  cn(
    "flex items-stretch gap-4 px-4",
    "border-b border-neutral-100",
    "bg-white min-w-0",
  ),
  {
    variants: {
      scrollable: {
        true: cn(
          "overflow-x-auto overflow-y-hidden",
          "[scrollbar-width:none]",
          "[-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:hidden",
        ),
        false: "",
      },
    },
    defaultVariants: {
      scrollable: true,
    },
  },
);

/* ══════ CVA — TAB (RadixTabs.Trigger) ═════════════════════════════ */

const tabsTabVariants = cva(
  cn(
    "appearance-none border-0 m-0 bg-transparent cursor-pointer",
    "shrink-0 min-w-0 whitespace-nowrap",
    "font-sans font-medium leading-none",
    "inline-flex items-center justify-center gap-[var(--hc-tabs-gap)]",
    "relative",
    "px-[var(--hc-tabs-pad-x)] h-[var(--hc-tabs-h)]",
    "text-[length:var(--hc-tabs-font-size)]",
    "text-neutral-500",
    "rounded-t-control",
    /* Reserve the underline space up front so the tab doesn't jump 2px
       when it becomes selected. Overlap the list's bottom border. */
    "border-b-2 border-transparent -mb-[1px]",
    "transition-[color,background-color,border-color] duration-150 ease-standard motion-reduce:duration-0",
    /* Hover — non-disabled */
    "not-disabled:hover:text-neutral-900 not-disabled:hover:bg-neutral-100",
    /* Focus ring — inset so it doesn't clip the underline. */
    "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
    /* Selected — brand ink + brand underline (Radix drives data-state). */
    "data-[state=active]:text-brand-500 data-[state=active]:border-b-brand-500",
    "data-[state=active]:not-disabled:hover:text-brand-600 data-[state=active]:not-disabled:hover:bg-neutral-100",
    "data-[state=active]:not-disabled:hover:border-b-brand-500",
    /* Disabled */
    "disabled:text-neutral-400 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    /* Icons inside slots inherit sizing from the size variant on the root. */
    "[&_[data-slot=tabs-tab-icon]_svg]:size-[var(--hc-tabs-icon)]",
    "[&_[data-slot=tabs-tab-icon]_svg]:block",
  ),
);

/* ══════ CVA — PANEL (RadixTabs.Content) ═══════════════════════════ */

const tabsPanelVariants = cva(
  cn(
    "min-w-0 pt-16",
    "font-sans text-16 leading-normal text-neutral-900",
    "outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:rounded-control",
  ),
);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  {
    value,
    defaultValue,
    onValueChange,
    size           = "md",
    variant        = "underline",
    ariaLabel,
    ariaLabelledBy,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  return (
    <TabsSizeContext.Provider value={size}>
      <TabsVariantContext.Provider value={variant}>
      <RadixTabs.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-slot="tabs-root"
        data-variant={variant}
        style={style as CSSProperties}
        className={cn(
          tabsRootVariants({
            size,
          } as VariantProps<typeof tabsRootVariants>),
          className,
        )}
        {...(rest as React.ComponentProps<typeof RadixTabs.Root>)}
      >
        {children}
      </RadixTabs.Root>
      </TabsVariantContext.Provider>
    </TabsSizeContext.Provider>
  );
});
TabsRoot.displayName = "Tabs";

/* ══════ LIST ══════════════════════════════════════════════════════ */

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { scrollable = true, className, children, ...rest },
  ref,
) {
  const variant = useContext(TabsVariantContext);
  return (
    <RadixTabs.List
      ref={ref}
      data-slot="tabs-list"
      className={cn(
        tabsListVariants({
          scrollable,
        } as VariantProps<typeof tabsListVariants>),
        variant === "segmented" && segmentedListClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </RadixTabs.List>
  );
});
TabsList.displayName = "Tabs.List";

/* ══════ TAB ═══════════════════════════════════════════════════════ */

const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  { value, icon, badge, disabled, className, children, onClick, ...rest },
  ref,
) {
  const variant = useContext(TabsVariantContext);
  return (
    <RadixTabs.Trigger
      ref={ref}
      value={value}
      disabled={disabled}
      onClick={onClick}
      data-slot="tabs-tab"
      className={cn(tabsTabVariants(), variant === "segmented" && segmentedTabClasses, className)}
      {...rest}
    >
      {icon && (
        <span
          data-slot="tabs-tab-icon"
          aria-hidden="true"
          className="inline-flex items-center justify-center shrink-0 text-current"
        >
          {icon}
        </span>
      )}
      {children != null && (
        <span data-slot="tabs-tab-label" className="inline-block min-w-0">
          {children}
        </span>
      )}
      {badge && (
        <span
          data-slot="tabs-tab-badge"
          aria-hidden="true"
          className="inline-flex items-center shrink-0"
        >
          {badge}
        </span>
      )}
    </RadixTabs.Trigger>
  );
});
TabsTab.displayName = "Tabs.Tab";

/* ══════ PANELS ════════════════════════════════════════════════════ */

const TabsPanels = forwardRef<HTMLDivElement, TabsPanelsProps>(function TabsPanels(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="tabs-panels"
      className={cn("min-w-0", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
TabsPanels.displayName = "Tabs.Panels";

/* ══════ PANEL ═════════════════════════════════════════════════════ */

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value, keepMounted = false, className, children, ...rest },
  ref,
) {
  return (
    <RadixTabs.Content
      ref={ref}
      value={value}
      forceMount={keepMounted ? true : undefined}
      data-slot="tabs-panel"
      className={cn(tabsPanelVariants(), className)}
      {...rest}
    >
      {children}
    </RadixTabs.Content>
  );
});
TabsPanel.displayName = "Tabs.Panel";

/* ══════ useTabsContext — legacy stub ══════════════════════════════
   The original component exported this so downstream code could peek at
   the active value. Radix Tabs owns state internally now; consumers who
   need to observe the active value should use `onValueChange` on the
   root or the DOM's own `data-state` attributes.

   Keeping the export as a stub avoids breaking any imports; it returns
   the size (which is still owned by our context) and null placeholders
   for the removed fields, matching the shape the old hook returned. */

type LegacyTabsContext = {
  baseId:         string;
  activeValue:    string | undefined;
  setActiveValue: (value: string) => void;
  size:           TabsSize;
};

function useTabsContext(component: string): LegacyTabsContext {
  const size = useContext(TabsSizeContext);
  return {
    baseId:      "",
    activeValue: undefined,
    setActiveValue: () => {
      // eslint-disable-next-line no-console
      console.warn(
        `[hc1 Tabs] useTabsContext.setActiveValue is a no-op in the Radix-backed migration (called from ${component}). Use onValueChange on the Tabs root instead.`,
      );
    },
    size,
  };
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type TabsCompound = typeof TabsRoot & {
  List:   typeof TabsList;
  Tab:    typeof TabsTab;
  Panels: typeof TabsPanels;
  Panel:  typeof TabsPanel;
};

const Tabs = TabsRoot as TabsCompound;
Tabs.List   = TabsList;
Tabs.Tab    = TabsTab;
Tabs.Panels = TabsPanels;
Tabs.Panel  = TabsPanel;

export {
  Tabs,
  useTabsContext,
  tabsRootVariants,
  tabsListVariants,
  tabsTabVariants,
  tabsPanelVariants,
};
