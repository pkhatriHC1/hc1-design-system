import { forwardRef } from "react";
import type { MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { ButtonProps, ButtonSize } from "./Button.types";

/**
 * HC1 Button — the reference implementation.
 *
 * This is the first component migrated from custom CSS to shadcn/ui
 * conventions (cva + Tailwind v4 utilities + HC1 tokens via @theme).
 * The prop API is preserved verbatim from the previous Button.css
 * implementation; only the styling mechanism changed. Every color,
 * padding, height, radius, and state produces the identical rendered
 * result as the prior version. See docs/components/ButtonDoc for the
 * full spec.
 */

const buttonVariants = cva(
  cn(
    "relative inline-flex flex-row items-center justify-center",
    "border border-transparent rounded-control",
    "font-sans font-semibold leading-none",
    "whitespace-nowrap no-underline select-none appearance-none",
    "cursor-pointer",
    "[-webkit-tap-highlight-color:transparent]",
    "transition-colors duration-150 ease-standard motion-reduce:duration-0",
    "outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed",
    "aria-busy:cursor-progress",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary border-primary text-primary-foreground",
          "hover:bg-brand-600 hover:border-brand-600",
          "active:bg-brand-700 active:border-brand-700",
          "disabled:bg-neutral-200 disabled:border-neutral-200 disabled:text-neutral-400",
        ),
        secondary: cn(
          "bg-white border-neutral-200 text-neutral-900",
          "hover:bg-neutral-100 hover:border-neutral-300",
          "active:bg-neutral-200",
          "disabled:bg-white disabled:border-neutral-100 disabled:text-neutral-400",
        ),
        ghost: cn(
          "bg-transparent border-transparent text-neutral-900",
          "hover:bg-neutral-100",
          "active:bg-neutral-200",
          "disabled:text-neutral-400",
        ),
        danger: cn(
          "bg-destructive border-destructive text-destructive-foreground",
          "hover:bg-red-600 hover:border-red-600",
          "active:bg-red-700 active:border-red-700",
          "disabled:bg-neutral-200 disabled:border-neutral-200 disabled:text-neutral-400",
        ),
        "danger-outline": cn(
          "bg-white border-red-100 text-red-500",
          "hover:bg-red-50 hover:border-red-200",
          "active:bg-red-100 active:border-red-300",
          "disabled:bg-white disabled:border-neutral-100 disabled:text-neutral-400",
        ),
        success: cn(
          "bg-white border-green-100 text-green-500",
          "hover:bg-green-50 hover:border-green-200",
          "active:bg-green-100 active:border-green-300",
          "disabled:bg-white disabled:border-neutral-100 disabled:text-neutral-400",
        ),
        cta: cn(
          "bg-accent-500 border-accent-600 text-white",
          "hover:bg-accent-600 hover:border-accent-600",
          "active:bg-accent-700 active:border-accent-700",
          "disabled:bg-neutral-200 disabled:border-neutral-200 disabled:text-neutral-400",
        ),
        link: cn(
          "bg-transparent border-transparent text-brand-600",
          "hover:text-brand-700 hover:underline hover:[text-underline-offset:3px]",
          "active:text-brand-700",
          "disabled:text-neutral-400 disabled:no-underline",
        ),
        icon: cn(
          "bg-transparent border-transparent text-neutral-900",
          "hover:bg-neutral-100",
          "active:bg-neutral-200",
          "disabled:text-neutral-400",
        ),
      },
      size: {
        xs: "h-[20px] px-4 text-12 gap-4 [&_svg]:size-[12px]",
        sm: "h-[28px] px-8 text-12 gap-4 [&_svg]:size-[14px]",
        md: "h-[36px] px-12 text-14 gap-8 [&_svg]:size-[16px]",
        lg: "h-[44px] px-16 text-16 gap-8 [&_svg]:size-[20px]",
        xl: "h-[56px] px-24 text-18 gap-12 [&_svg]:size-[24px]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      iconOnly: {
        true: "p-0 gap-0",
        false: "",
      },
    },
    compoundVariants: [
      /* Square dimensions when iconOnly is on (width = size ladder). */
      { iconOnly: true, size: "xs", className: "w-[20px]" },
      { iconOnly: true, size: "sm", className: "w-[28px]" },
      { iconOnly: true, size: "md", className: "w-[36px]" },
      { iconOnly: true, size: "lg", className: "w-[44px]" },
      { iconOnly: true, size: "xl", className: "w-[56px]" },
      /* variant="icon" is inherently square + zero padding, regardless of iconOnly. */
      { variant: "icon", className: "p-0 gap-0" },
      { variant: "icon", size: "xs", className: "w-[20px]" },
      { variant: "icon", size: "sm", className: "w-[28px]" },
      { variant: "icon", size: "md", className: "w-[36px]" },
      { variant: "icon", size: "lg", className: "w-[44px]" },
      { variant: "icon", size: "xl", className: "w-[56px]" },
      /* Link: tight horizontal padding + medium weight, overrides size. */
      { variant: "link", className: "px-4 font-medium" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      iconOnly: false,
    },
  },
);

const SPINNER_SIZE: Record<ButtonSize, string> = {
  xs: "size-[10px] border-[1.5px]",
  sm: "size-[12px] border-2",
  md: "size-[14px] border-2",
  lg: "size-[18px] border-2",
  xl: "size-[22px] border-[2.5px]",
};

const ICON_SLOT = "inline-flex items-center justify-center shrink-0 [&_svg]:block";
const LABEL_SLOT = "inline-block leading-none";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    disabled,
    type = "button",
    onClick,
    children,
    className,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const isIconOnly = variant === "icon" || iconOnly;

  /* Dev-time assertion: any icon-only button must have an accessible name. */
  if (import.meta.env?.DEV && isIconOnly && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn(
      "[hc1 Button] icon-only buttons require aria-label — the button has no visible text.",
    );
  }

  const isDisabled = disabled || loading;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant, size, fullWidth, iconOnly } as VariantProps<typeof buttonVariants>),
        className,
      )}
      {...rest}
    >
      {!isIconOnly && leftIcon && (
        <span className={cn(ICON_SLOT, loading && "invisible")} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {isIconOnly ? (
        <span
          className={cn(ICON_SLOT, loading && "invisible")}
          aria-hidden={ariaLabel ? undefined : "true"}
        >
          {children}
        </span>
      ) : (
        children != null && (
          <span className={cn(LABEL_SLOT, loading && "invisible")}>{children}</span>
        )
      )}
      {!isIconOnly && rightIcon && (
        <span className={cn(ICON_SLOT, loading && "invisible")} aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span
            className={cn(
              "block rounded-full border-current border-t-transparent animate-spin",
              "motion-reduce:[animation-duration:2500ms]",
              SPINNER_SIZE[size],
            )}
          />
        </span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export { buttonVariants };
