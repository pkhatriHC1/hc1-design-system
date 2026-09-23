import { Children, forwardRef, isValidElement, useMemo } from "react";
import type { ReactElement } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "../../utils/cn";
import type {
  AvatarGroupProps,
  AvatarProps,
  AvatarSize,
} from "./Avatar.types";

/**
 * HC1 Avatar — circular (or square) identity chip.
 *
 * Wraps @radix-ui/react-avatar so the image → fallback cascade is
 * handled correctly (fallback appears only after the image errors, or
 * after `delayMs` if the image is slow to load — no flash of initials).
 *
 * Fallback priority: `children` (icon or custom node) > `name`-derived
 * initials > a neutral placeholder chip.
 *
 * Sizes align with Button + Input so an Avatar sits pixel-flush next to
 * a same-size control on the same row.
 */

/* ══════ Size + shape maps ═════════════════════════════════════════ */

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};

const FALLBACK_TEXT_PX: Record<AvatarSize, number> = {
  xs: 10,
  sm: 11,
  md: 13,
  lg: 15,
  xl: 20,
};

const STATUS_PX: Record<AvatarSize, number> = {
  xs: 6,
  sm: 7,
  md: 9,
  lg: 11,
  xl: 14,
};

const STATUS_COLOR: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "var(--hc-color-status-success-fg)",
  away: "var(--hc-color-accent-500)",
  busy: "var(--hc-color-status-error-fg)",
  offline: "var(--hc-color-neutral-400)",
};

/* ══════ Initials derivation ═══════════════════════════════════════ */

function deriveInitials(name: string | undefined): string {
  if (!name) return "";
  const cleaned = name.replace(/[^\p{L}\s'-]/gu, " ").trim();
  if (!cleaned) return "";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]![0]!.toUpperCase();
  const first = parts[0]![0]!;
  const last = parts[parts.length - 1]![0]!;
  return (first + last).toUpperCase();
}

/* ══════ Root ══════════════════════════════════════════════════════ */

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    children,
    size = "md",
    shape = "circle",
    status,
    delayMs = 500,
    className,
    style,
    ...rest
  },
  forwardedRef,
) {
  const px = SIZE_PX[size];
  const fallbackFontPx = FALLBACK_TEXT_PX[size];
  const initials = useMemo(() => deriveInitials(name), [name]);
  const accessibleName = alt ?? name;

  return (
    <RadixAvatar.Root
      ref={forwardedRef}
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      role={accessibleName ? "img" : undefined}
      aria-label={accessibleName}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
        "bg-[color:var(--hc-color-brand-50)] text-[color:var(--hc-color-brand-700)]",
        "font-medium leading-none",
        shape === "circle" ? "rounded-full" : "rounded-[var(--hc-radius-8)]",
        className,
      )}
      style={{ width: px, height: px, fontSize: fallbackFontPx, ...style }}
      {...rest}
    >
      {src && (
        <RadixAvatar.Image
          src={src}
          alt={accessibleName ?? ""}
          data-slot="avatar-image"
          className="h-full w-full object-cover"
        />
      )}
      <RadixAvatar.Fallback
        delayMs={src ? delayMs : 0}
        data-slot="avatar-fallback"
        className="flex h-full w-full items-center justify-center"
      >
        {children ?? initials ?? null}
      </RadixAvatar.Fallback>
      {status && (
        <span
          data-slot="avatar-status"
          data-status={status}
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            "ring-2 ring-[color:var(--hc-color-bg-surface)]",
          )}
          style={{
            width: STATUS_PX[size],
            height: STATUS_PX[size],
            background: STATUS_COLOR[status],
          }}
        />
      )}
    </RadixAvatar.Root>
  );
});
Avatar.displayName = "Avatar";

/* ══════ Group ═════════════════════════════════════════════════════ */

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { size, max, children, className, ...rest },
  forwardedRef,
) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement<AvatarProps> => isValidElement(child),
  );
  const shown = typeof max === "number" ? items.slice(0, max) : items;
  const hidden = items.length - shown.length;

  const overlapPx: Record<AvatarSize, string> = {
    xs: "-ml-1",
    sm: "-ml-1.5",
    md: "-ml-2",
    lg: "-ml-2.5",
    xl: "-ml-3",
  };
  const effectiveSize = size ?? "md";
  const overlapClass = overlapPx[effectiveSize];

  return (
    <div
      ref={forwardedRef}
      data-slot="avatar-group"
      className={cn("flex items-center", className)}
      {...rest}
    >
      {shown.map((child, i) => {
        const merged: AvatarProps = {
          ...child.props,
          size: size ?? child.props.size,
          className: cn(
            child.props.className,
            "ring-2 ring-[color:var(--hc-color-bg-surface)]",
            i > 0 && overlapClass,
          ),
        };
        return <Avatar key={i} {...merged} />;
      })}
      {hidden > 0 && (
        <Avatar
          size={size}
          className={cn(
            "ring-2 ring-[color:var(--hc-color-bg-surface)]",
            shown.length > 0 && overlapClass,
            "bg-[color:var(--hc-color-neutral-100)] text-[color:var(--hc-color-text-secondary)]",
          )}
          aria-label={`${hidden} more`}
        >
          {`+${hidden}`}
        </Avatar>
      )}
    </div>
  );
});
AvatarGroup.displayName = "AvatarGroup";
