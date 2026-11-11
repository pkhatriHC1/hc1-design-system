import { useState } from "react";
import type { ReactNode } from "react";
import { Maximize2, SendHorizontal, Sparkles, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Drawer } from "../../components/drawer";

/**
 * AssistantPanel — the IQ Assistant panel, shared by every hc1 product.
 *
 * SourceIQ standard (2026-11-11):
 *   - Opens in the standard 640px drawer (one width for every drawer).
 *   - Solid header in the AI colour (amber) with the assistant's name;
 *     no gradient, white text at full contrast.
 *   - User messages: dark teal bubbles on the right. Assistant messages:
 *     white bordered bubbles on the left with the AI mark.
 *   - Composer pinned to the bottom, with an optional footnote.
 *
 * The launcher is NOT part of this panel: it is the amber CTA in
 * AppShell.TopBar (`assistant` slot). Products supply the messages and
 * a send handler; conversation logic and data stay in the product.
 *
 *   <AssistantPanel
 *     open={open}
 *     onOpenChange={setOpen}
 *     subtitle="Your AI lab supply expert"
 *     messages={messages}
 *     onSend={(text) => ask(text)}
 *     footnote="IQ can analyze data, negotiate with vendors and more"
 *   />
 */
export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  /** Message body — text or rich content (tables, cards) built from DS parts. */
  content: ReactNode;
  /** Pre-formatted time, e.g. "10:31 AM". */
  time?: string;
};

export type AssistantPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** @default "IQ Assistant" */
  title?: string;
  subtitle?: string;
  messages: AssistantMessage[];
  onSend: (text: string) => void;
  /** Shows a typing indicator after the last message. */
  thinking?: boolean;
  /** @default "Ask IQ anything…" */
  placeholder?: string;
  /** Small line under the composer. */
  footnote?: ReactNode;
  /** Shows an expand button that hands off to a full-screen view. */
  onExpand?: () => void;
};

export function AssistantPanel({
  open,
  onOpenChange,
  title = "IQ Assistant",
  subtitle,
  messages,
  onSend,
  thinking = false,
  placeholder = "Ask IQ anything…",
  footnote,
  onExpand,
}: AssistantPanelProps) {
  const [draft, setDraft] = useState("");
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content showCloseButton={false} className="flex flex-col">
        {/* Header — solid AI colour */}
        <div
          data-slot="assistant-panel-header"
          className={cn(
            "flex shrink-0 items-center gap-[var(--hc-space-12)] px-[var(--hc-space-24)] py-[var(--hc-space-16)]",
            "bg-[color:var(--hc-color-ai-default)] text-[color:var(--hc-color-text-on-solid)]",
          )}
        >
          <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--hc-radius-control)] bg-white/15">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <Drawer.Title className="m-0 text-[18px] font-bold leading-tight text-white">{title}</Drawer.Title>
            {subtitle && <p className="m-0 text-[12px] text-white/85">{subtitle}</p>}
          </div>
          {onExpand && (
            <button type="button" aria-label="Expand" onClick={onExpand} className={headerButton}>
              <Maximize2 className="size-[var(--hc-space-16)]" />
            </button>
          )}
          <button type="button" aria-label="Close" onClick={() => onOpenChange(false)} className={headerButton}>
            <X className="size-[var(--hc-space-16)]" />
          </button>
        </div>

        {/* Messages */}
        <div
          data-slot="assistant-panel-messages"
          role="log"
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-[var(--hc-space-16)] overflow-y-auto bg-[color:var(--hc-color-bg-page)] p-[var(--hc-space-24)]"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {thinking && (
            <div className="flex items-center gap-[var(--hc-space-8)] text-[14px] text-[color:var(--hc-color-ai-text)]">
              <Sparkles aria-hidden="true" className="size-[var(--hc-space-16)] animate-pulse motion-reduce:animate-none" />
              Thinking…
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          data-slot="assistant-panel-composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="shrink-0 border-t border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-surface)] px-[var(--hc-space-24)] py-[var(--hc-space-16)]"
        >
          <div className="flex items-center gap-[var(--hc-space-8)] rounded-[var(--hc-radius-control)] border border-[color:var(--hc-color-border-default)] pl-[var(--hc-space-12)] pr-[var(--hc-space-4)] focus-within:border-[color:var(--hc-color-border-focus)]">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="h-[var(--hc-field-height)] min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[color:var(--hc-color-text-primary)] outline-none placeholder:text-[color:var(--hc-color-text-tertiary)]"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!draft.trim()}
              className={cn(
                "inline-flex size-[var(--hc-space-32)] items-center justify-center rounded-[var(--hc-radius-control)]",
                "bg-[color:var(--hc-color-action-primary)] text-[color:var(--hc-color-text-on-solid)]",
                "disabled:bg-[color:var(--hc-color-action-primary-disabled)] disabled:text-[color:var(--hc-color-text-disabled)]",
              )}
            >
              <SendHorizontal className="size-[var(--hc-space-16)]" aria-hidden="true" />
            </button>
          </div>
          {footnote && (
            <p className="m-0 mt-[var(--hc-space-8)] text-center text-[12px] text-[color:var(--hc-color-text-tertiary)]">{footnote}</p>
          )}
        </form>
      </Drawer.Content>
    </Drawer>
  );
}

const headerButton = cn(
  "inline-flex size-[var(--hc-space-32)] shrink-0 items-center justify-center rounded-[var(--hc-radius-control)]",
  "text-white hover:bg-white/15",
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
);

function MessageBubble({ message }: { message: AssistantMessage }) {
  const user = message.role === "user";
  return (
    <div className={cn("flex gap-[var(--hc-space-8)]", user ? "flex-row-reverse" : "flex-row")}>
      {!user && (
        <span aria-hidden="true" className="mt-[2px] inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--hc-color-ai-subtle-bg)] text-[color:var(--hc-color-ai-text)]">
          <Sparkles className="size-[var(--hc-space-16)]" />
        </span>
      )}
      <div className={cn("flex max-w-[80%] flex-col gap-[var(--hc-space-4)]", user ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-[var(--hc-radius-surface)] p-[var(--hc-space-16)] text-[14px] leading-[1.5]",
            user
              ? "bg-[color:var(--hc-color-brand-800)] text-[color:var(--hc-color-text-on-solid)]"
              : "border border-[color:var(--hc-color-border-default)] bg-[color:var(--hc-color-bg-surface)] text-[color:var(--hc-color-text-primary)]",
          )}
        >
          {message.content}
        </div>
        {message.time && <span className="text-[12px] text-[color:var(--hc-color-text-tertiary)]">{message.time}</span>}
      </div>
    </div>
  );
}
