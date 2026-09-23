import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Dialog } from "../../components/dialog";
import { Button } from "../../components/button";
import { Input } from "../../components/input";

/**
 * ConfirmDialog — the canonical HC1 confirmation preset.
 *
 * Wraps Dialog with a small (sm) panel, a title + description, and a
 * Cancel + Confirm action row. Optional typed-name guard requires the
 * user to type an exact string (project name, resource id, etc.) before
 * the Confirm button unlocks — mirrors the pattern most cloud consoles
 * (Vercel, GitHub, AWS) use for irreversible actions.
 *
 * `onConfirm` may return a Promise. While it's pending the Confirm
 * button shows `loading` and both actions disable so the user can't
 * fire twice or bail mid-flight. The dialog closes on resolve and
 * stays open on reject — the caller catches the error and surfaces
 * whatever feedback (toast / inline alert) fits the context.
 *
 * Variant defaults to `default`. Set `variant="destructive"` for
 * delete / remove / discard confirmations — Confirm renders in the red
 * destructive style so the affordance reads correctly at a glance.
 */

export type ConfirmDialogVariant = "default" | "destructive";

export type ConfirmDialogProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Fires when the dialog wants to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Dialog heading — 1–5 words, sentence case ("Delete project"). */
  title: ReactNode;
  /** Optional paragraph under the title explaining consequences. */
  description?: ReactNode;

  /** Confirm button label. @default "Confirm" */
  confirmLabel?: string;
  /** Cancel button label. @default "Cancel" */
  cancelLabel?: string;

  /**
   * Visual variant.
   *   default     — brand fill on Confirm. Generic confirmations.
   *   destructive — red-toned Confirm. Delete / remove / discard.
   * @default "default"
   */
  variant?: ConfirmDialogVariant;

  /**
   * When set, an Input appears under the description and the user must
   * type this exact string before Confirm unlocks. Use for irreversible
   * actions (delete resource, publish release) so the user can't
   * misclick their way to disaster.
   */
  typedGuard?: string;
  /**
   * Label shown above the typed-guard Input. Defaults to a sensible
   * "Type <value> to confirm." string using the guard value.
   */
  typedGuardLabel?: ReactNode;

  /**
   * Called when the user clicks Confirm (and passes the typed guard, if
   * set). May be async — the button shows `loading` while pending, and
   * the dialog auto-closes on success. Rejections keep the dialog open.
   */
  onConfirm: () => void | Promise<void>;
  /** Optional cancel handler — fires when the user clicks Cancel. */
  onCancel?: () => void;

  /**
   * Extra body content rendered between the description and the typed
   * guard (or between description and actions if no guard). Use for a
   * bulleted list of what will be affected, an inline preview, etc.
   */
  children?: ReactNode;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  typedGuard,
  typedGuardLabel,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);
  const [typedValue, setTypedValue] = useState("");

  const guardActive = typeof typedGuard === "string" && typedGuard.length > 0;
  const guardPassed = !guardActive || typedValue === typedGuard;
  const confirmDisabled = pending || !guardPassed;

  const handleConfirm = useCallback(async () => {
    if (confirmDisabled) return;
    try {
      setPending(true);
      await onConfirm();
      setTypedValue("");
      onOpenChange?.(false);
    } catch {
      /* Caller handles the error (toast / inline alert). Dialog stays open. */
    } finally {
      setPending(false);
    }
  }, [confirmDisabled, onConfirm, onOpenChange]);

  const handleCancel = useCallback(() => {
    if (pending) return;
    onCancel?.();
    setTypedValue("");
    onOpenChange?.(false);
  }, [pending, onCancel, onOpenChange]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (pending && !next) return;
      if (!next) setTypedValue("");
      onOpenChange?.(next);
    },
    [pending, onOpenChange],
  );

  const resolvedGuardLabel =
    typedGuardLabel ?? (guardActive ? `Type "${typedGuard}" to confirm.` : undefined);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content
        size="sm"
        closeOnOverlayClick={!pending}
        closeOnEscape={!pending}
      >
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {description && <Dialog.Description>{description}</Dialog.Description>}
        </Dialog.Header>
        {(children || guardActive) && (
          <Dialog.Body>
            {children}
            {guardActive && (
              <Input
                size="md"
                label={resolvedGuardLabel}
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                autoComplete="off"
                autoFocus
              />
            )}
          </Dialog.Body>
        )}
        <Dialog.Footer>
          <Dialog.Actions>
            <Button variant="outline" onClick={handleCancel} disabled={pending}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={confirmDisabled}
              loading={pending}
            >
              {confirmLabel}
            </Button>
          </Dialog.Actions>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
