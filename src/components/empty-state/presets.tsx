import type { ReactNode } from "react";
import {
  AlertTriangle,
  Inbox,
  Lock,
  RefreshCw,
  SearchX,
  WifiOff,
} from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../button";

/**
 * EmptyState presets — pre-composed variants for the four scenarios that
 * account for ~80% of empty states in HC1 products.
 *
 * The base `<EmptyState>` primitive stays fully composable; these presets
 * are shortcuts that pick the right `variant`, drop in a sensible default
 * icon, and expose a slim prop API for the common cases. Reach for the
 * base primitive when a preset doesn't fit — swap the icon, add a
 * footer, use a custom action row, etc.
 *
 *   NoDataEmptyState          — an empty collection ("no patients yet")
 *   NoResultsEmptyState       — a query returned nothing ("no matches")
 *   ErrorEmptyState           — the surface failed to load
 *   PermissionDeniedEmptyState — the user lacks access
 *   OfflineEmptyState         — connectivity issue
 */

/* ══════ Shared preset shape ═════════════════════════════════════════ */

type BasePresetProps = {
  /** Override the preset's default title. */
  title?: ReactNode;
  /** Override the preset's default description. */
  description?: ReactNode;
  /** Override the preset's default icon. */
  icon?: ReactNode;
  /** Primary action label. Omit to hide the primary action. */
  actionLabel?: string;
  /** Primary action handler. */
  onAction?: () => void;
  /** Secondary action label. Omit to hide the secondary action. */
  secondaryLabel?: string;
  /** Secondary action handler. */
  onSecondary?: () => void;
  /**
   * Layout mode. Matches EmptyState.layout — use "contained" when the
   * preset sits inside a Card / Dialog / Tab panel.
   */
  layout?: "centered" | "contained";
  /** Optional footer node — help link, docs pointer, etc. */
  footer?: ReactNode;
};

function PresetActions({
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  primaryVariant = "default",
}: {
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  primaryVariant?: "default" | "outline";
}) {
  if (!actionLabel && !secondaryLabel) return null;
  return (
    <EmptyState.Actions>
      {secondaryLabel && (
        <Button variant="outline" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      )}
      {actionLabel && (
        <Button variant={primaryVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </EmptyState.Actions>
  );
}

/* ══════ NoData ════════════════════════════════════════════════════════ */

export type NoDataEmptyStateProps = BasePresetProps;

export function NoDataEmptyState({
  title = "Nothing here yet",
  description = "This collection is empty. Add your first item to get started.",
  icon = <Inbox />,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  layout,
  footer,
}: NoDataEmptyStateProps) {
  return (
    <EmptyState variant="default" layout={layout}>
      <EmptyState.Icon>{icon}</EmptyState.Icon>
      <EmptyState.Title>{title}</EmptyState.Title>
      <EmptyState.Description>{description}</EmptyState.Description>
      <PresetActions
        actionLabel={actionLabel}
        onAction={onAction}
        secondaryLabel={secondaryLabel}
        onSecondary={onSecondary}
      />
      {footer && <EmptyState.Footer>{footer}</EmptyState.Footer>}
    </EmptyState>
  );
}

/* ══════ NoResults ═════════════════════════════════════════════════════ */

export type NoResultsEmptyStateProps = BasePresetProps & {
  /**
   * The query that returned no results. Used to render a default
   * description like "No matches for \"john\"." Override `description`
   * to customize.
   */
  query?: string;
  /**
   * Convenience: renders a "Clear filters" secondary action if provided.
   * Wins over `onSecondary` / `secondaryLabel`.
   */
  onClear?: () => void;
};

export function NoResultsEmptyState({
  query,
  title = "No matches",
  description,
  icon = <SearchX />,
  onClear,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  layout,
  footer,
}: NoResultsEmptyStateProps) {
  const resolvedDescription =
    description ??
    (query
      ? `No matches for "${query}". Try a different query or clear the filters.`
      : "No matches for the current filters. Try widening your search.");

  const secondaryProps = onClear
    ? { secondaryLabel: "Clear filters", onSecondary: onClear }
    : { secondaryLabel, onSecondary };

  return (
    <EmptyState variant="search" layout={layout}>
      <EmptyState.Icon>{icon}</EmptyState.Icon>
      <EmptyState.Title>{title}</EmptyState.Title>
      <EmptyState.Description>{resolvedDescription}</EmptyState.Description>
      <PresetActions
        actionLabel={actionLabel}
        onAction={onAction}
        {...secondaryProps}
      />
      {footer && <EmptyState.Footer>{footer}</EmptyState.Footer>}
    </EmptyState>
  );
}

/* ══════ Error ═════════════════════════════════════════════════════════ */

export type ErrorEmptyStateProps = BasePresetProps & {
  /**
   * Convenience: renders a primary "Retry" action if provided. Wins
   * over `onAction` / `actionLabel`.
   */
  onRetry?: () => void;
};

export function ErrorEmptyState({
  title = "Something went wrong",
  description = "We couldn't load this content. Check your connection or try again in a moment.",
  icon = <AlertTriangle />,
  onRetry,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  layout,
  footer,
}: ErrorEmptyStateProps) {
  const primaryProps = onRetry
    ? { actionLabel: "Retry", onAction: onRetry }
    : { actionLabel, onAction };

  return (
    <EmptyState variant="error" layout={layout}>
      <EmptyState.Icon>{onRetry && !actionLabel ? <RefreshCw /> : icon}</EmptyState.Icon>
      <EmptyState.Title>{title}</EmptyState.Title>
      <EmptyState.Description>{description}</EmptyState.Description>
      <PresetActions
        {...primaryProps}
        secondaryLabel={secondaryLabel}
        onSecondary={onSecondary}
      />
      {footer && <EmptyState.Footer>{footer}</EmptyState.Footer>}
    </EmptyState>
  );
}

/* ══════ PermissionDenied ══════════════════════════════════════════════ */

export type PermissionDeniedEmptyStateProps = BasePresetProps & {
  /**
   * Named resource the user tried to access. Renders into the default
   * description ("You don't have access to <resource>."). Override
   * `description` for a fully custom message.
   */
  resource?: string;
  /**
   * Convenience: renders a primary "Request access" action if provided.
   * Wins over `onAction` / `actionLabel`.
   */
  onRequestAccess?: () => void;
};

export function PermissionDeniedEmptyState({
  resource,
  title = "Access denied",
  description,
  icon = <Lock />,
  onRequestAccess,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  layout,
  footer,
}: PermissionDeniedEmptyStateProps) {
  const resolvedDescription =
    description ??
    (resource
      ? `You don't have access to ${resource}. Ask an administrator to grant permission.`
      : "You don't have access to this resource. Ask an administrator to grant permission.");

  const primaryProps = onRequestAccess
    ? { actionLabel: "Request access", onAction: onRequestAccess }
    : { actionLabel, onAction };

  return (
    <EmptyState variant="permission" layout={layout}>
      <EmptyState.Icon>{icon}</EmptyState.Icon>
      <EmptyState.Title>{title}</EmptyState.Title>
      <EmptyState.Description>{resolvedDescription}</EmptyState.Description>
      <PresetActions
        {...primaryProps}
        secondaryLabel={secondaryLabel}
        onSecondary={onSecondary}
      />
      {footer && <EmptyState.Footer>{footer}</EmptyState.Footer>}
    </EmptyState>
  );
}

/* ══════ Offline ══════════════════════════════════════════════════════ */

export type OfflineEmptyStateProps = BasePresetProps & {
  /** Convenience: renders a primary "Retry" action if provided. */
  onRetry?: () => void;
};

export function OfflineEmptyState({
  title = "You're offline",
  description = "We can't reach the network right now. Reconnect and try again.",
  icon = <WifiOff />,
  onRetry,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  layout,
  footer,
}: OfflineEmptyStateProps) {
  const primaryProps = onRetry
    ? { actionLabel: "Retry", onAction: onRetry }
    : { actionLabel, onAction };

  return (
    <EmptyState variant="offline" layout={layout}>
      <EmptyState.Icon>{icon}</EmptyState.Icon>
      <EmptyState.Title>{title}</EmptyState.Title>
      <EmptyState.Description>{description}</EmptyState.Description>
      <PresetActions
        {...primaryProps}
        secondaryLabel={secondaryLabel}
        onSecondary={onSecondary}
      />
      {footer && <EmptyState.Footer>{footer}</EmptyState.Footer>}
    </EmptyState>
  );
}
