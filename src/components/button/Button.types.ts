import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Visual variant — matches the shadcn/sourceIQ vocabulary so a
 * consumer swapping its local Button implementation for this one
 * doesn't have to rename a single prop.
 *
 * The legacy HC1 names ("primary", "danger", "danger-outline", "success",
 * "cta", "icon") are accepted as deprecated aliases and render the closest
 * canonical variant. Prefer the shadcn/sourceIQ names for new code.
 */
export type ButtonVariant =
  | "default"       // brand-fill primary — the "main action" button
  | "outline"       // white pill with subtle border — secondary action
  | "secondary"     // filled secondary (uses --secondary token)
  | "ghost"         // hover-only fill, transparent at rest
  | "destructive"   // subtle red wash + red text — for delete/cancel-only
  | "link"          // underline-on-hover link-styled button
  /* ── deprecated HC1 legacy names (v0.11 back-compat) ── */
  | "primary"       // deprecated alias for "default"
  | "danger"        // deprecated alias for "destructive"
  | "danger-outline"// deprecated: renders as outline with red accents
  | "success"       // deprecated: renders as outline with green accents
  | "cta"           // deprecated: renders as default (amber CTA styling dropped)
  | "icon";         // deprecated: use variant="ghost" size="icon" instead

/**
 * Size ladder — matches shadcn/sourceIQ heights so an icon-in-Button
 * on a page migrating to this component renders at the same 36px.
 *
 *   default  → 36px (h-9) — the everyday button
 *   xs       → 24px (h-6) — dense toolbars, chip actions
 *   sm       → 32px (h-8) — table row actions, small forms
 *   lg       → 40px (h-10) — hero CTAs, mobile touch targets
 *   icon     → 36×36 square — icon-only default
 *   icon-xs  → 24×24 square
 *   icon-sm  → 32×32 square
 *   icon-lg  → 40×40 square
 */
export type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"
  /* ── deprecated HC1 legacy sizes (v0.11 back-compat) ── */
  | "md"            // deprecated alias for "default"
  | "xl";           // deprecated: renders as "lg"

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Visual variant.
   * @default 'default'
   */
  variant?: ButtonVariant;
  /**
   * Size ladder.
   * @default 'default'
   */
  size?: ButtonSize;
  /**
   * Render as a Radix Slot instead of a `<button>`. Use to compose
   * with `<Link>` / `<a>` / any interactive child while inheriting
   * button styling — this is how you attach a Button style to a
   * React Router `<Link>` or a Next.js `<Link>`.
   *
   * When `asChild` is true, the immediate child receives the button
   * classes + refs. The child MUST be a single React element.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * Grow to fill the parent's width. (Legacy HC1 v0.11 prop —
   * prefer `className="w-full"` for new code.)
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Show a loading spinner overlay. The button stays focusable but
   * intercepts clicks (aria-busy). (Legacy HC1 v0.11 prop —
   * prefer disabling + rendering a `<Loader2 />` child.)
   * @default false
   */
  loading?: boolean;
  /**
   * Icon rendered before the label. (Legacy HC1 v0.11 prop —
   * prefer putting the icon as a child element.)
   */
  leftIcon?: ReactNode;
  /**
   * Icon rendered after the label. (Legacy HC1 v0.11 prop —
   * prefer putting the icon as a child element.)
   */
  rightIcon?: ReactNode;
  /**
   * (Legacy HC1 v0.11 prop — prefer `size="icon"` instead.)
   * When true, forces square dimensions.
   * @default false
   */
  iconOnly?: boolean;
};
