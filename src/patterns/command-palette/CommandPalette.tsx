import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Search } from "lucide-react";
import { Dialog } from "../../components/dialog";
import { cn } from "../../utils/cn";

/**
 * CommandPalette — the canonical ⌘K / Ctrl+K palette pattern.
 *
 * Wraps Dialog with a search input at the top and a filterable list of
 * commands below. Commands are a flat config array; the palette groups
 * by `group` field, filters against label + description + keywords, and
 * fires `action` on Enter or click. Keyboard: type-to-search, ArrowUp/
 * Down navigate, Home/End jump, Enter runs the highlighted command,
 * Escape closes.
 *
 * Consumers control the open state and pass the commands. Recent items
 * or per-context command sets are the consumer's responsibility — the
 * DS doesn't remember anything across sessions.
 *
 *   <CommandPalette
 *     open={open}
 *     onOpenChange={setOpen}
 *     commands={[
 *       { id: 'goto-dashboard', label: 'Go to dashboard', icon: <Home />, action: () => navigate('/'), group: 'Navigation', shortcut: '⌘1' },
 *       { id: 'create-batch', label: 'Create new batch', action: () => openBatch(), group: 'Actions' },
 *     ]}
 *   />
 */

/* ══════ Types ═════════════════════════════════════════════════════ */

export type CommandItem = {
  /** Stable identifier — React key + selection tracking. */
  id: string;
  /** Human-readable label — the primary searchable string. */
  label: string;
  /** Secondary line under the label. Also matched by the search filter. */
  description?: string;
  /** Optional leading icon (typically a lucide icon). */
  icon?: ReactNode;
  /** Right-aligned shortcut hint (e.g. "⌘K"). Purely visual. */
  shortcut?: ReactNode;
  /**
   * Group heading this command belongs to. Commands with the same group
   * render together under a small uppercase strap. Use for organizing
   * long command lists ("Navigation", "Actions", "Preferences").
   */
  group?: string;
  /**
   * Extra search terms — the DS matches the query against these in
   * addition to label + description. Use for aliases ("dark mode",
   * "night mode") without cluttering the visible label.
   */
  keywords?: string[];
  /** Disable the command — visible, unselectable, skipped by keyboard nav. */
  disabled?: boolean;
  /** Fires when the user activates the command. Palette closes automatically. */
  action: () => void;
};

export type CommandPaletteProps = {
  /** Controlled open state. Pair with onOpenChange. */
  open?: boolean;
  /** Fires when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Command definitions. Order determines group order (first-seen). */
  commands: CommandItem[];
  /** Search input placeholder. @default 'What do you want to do?' */
  placeholder?: string;
  /** Message shown when no commands match. @default 'No commands found.' */
  emptyMessage?: ReactNode;
  /**
   * Custom filter — return true to keep the command in the visible
   * list. Default: case-insensitive substring on label + description +
   * keywords.
   */
  filter?: (command: CommandItem, query: string) => boolean;
};

/* ══════ Default filter ════════════════════════════════════════════ */

function defaultFilter(cmd: CommandItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (cmd.label.toLowerCase().includes(q)) return true;
  if (cmd.description?.toLowerCase().includes(q)) return true;
  if (cmd.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
  return false;
}

/* ══════ Component ═════════════════════════════════════════════════ */

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = "What do you want to do?",
  emptyMessage = "No commands found.",
  filter = defaultFilter,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => commands.filter((c) => filter(c, query)),
    [commands, query, filter],
  );

  /* Group the filtered set while preserving the first-seen order. */
  const groups = useMemo(() => groupCommands(filtered), [filtered]);
  /* Flat list matching visual order, for keyboard nav indexing. */
  const flat = useMemo(() => groups.flatMap((g) => g.commands), [groups]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    setQuery("");
    setHighlightedIndex(0);
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [flat.length]);

  const run = useCallback(
    (cmd: CommandItem) => {
      if (cmd.disabled) return;
      cmd.action();
      onOpenChange?.(false);
    },
    [onOpenChange],
  );

  const move = useCallback(
    (delta: number) => {
      if (flat.length === 0) return;
      let next = highlightedIndex;
      for (let i = 0; i < flat.length; i++) {
        next = (next + delta + flat.length) % flat.length;
        if (!flat[next]!.disabled) break;
      }
      setHighlightedIndex(next);
    },
    [flat, highlightedIndex],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setHighlightedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setHighlightedIndex(flat.length - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = flat[highlightedIndex];
        if (cmd) run(cmd);
      }
      /* Escape falls through to Dialog which closes on its own. */
    },
    [move, flat, highlightedIndex, run],
  );

  let flatIndex = 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        size="md"
        showCloseButton={false}
        className="p-0"
      >
        <div className="flex items-center gap-2 border-b border-[color:var(--hc-color-border-subtle)] px-4 py-3">
          <Search
            aria-hidden="true"
            className="size-4 shrink-0 text-[color:var(--hc-color-text-tertiary)]"
          />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search commands"
            className={cn(
              "w-full border-0 bg-transparent p-0 outline-none",
              "text-[15px] leading-tight text-[color:var(--hc-color-text-primary)]",
              "placeholder:text-[color:var(--hc-color-text-tertiary)]",
            )}
          />
        </div>

        <div
          role="listbox"
          aria-label="Commands"
          className="max-h-[360px] overflow-y-auto p-2"
        >
          {flat.length === 0 && (
            <div className="px-3 py-6 text-center text-[13px] text-[color:var(--hc-color-text-tertiary)]">
              {emptyMessage}
            </div>
          )}

          {groups.map((group, gi) => (
            <div key={group.name ?? `__ungrouped-${gi}`} className="mb-1 last:mb-0">
              {group.name && (
                <div
                  className={cn(
                    "px-3 py-1",
                    "text-[11px] font-semibold uppercase tracking-widest",
                    "text-[color:var(--hc-color-text-tertiary)]",
                  )}
                >
                  {group.name}
                </div>
              )}
              {group.commands.map((cmd) => {
                const index = flatIndex++;
                const highlighted = index === highlightedIndex;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    role="option"
                    aria-selected={highlighted}
                    aria-disabled={cmd.disabled || undefined}
                    disabled={cmd.disabled}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => run(cmd)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-[var(--hc-radius-8)] px-3 py-2 text-left",
                      "text-[14px] leading-tight text-[color:var(--hc-color-text-primary)]",
                      "transition-colors duration-150 ease-standard motion-reduce:duration-0",
                      "outline-none focus:outline-none",
                      cmd.disabled && "opacity-50",
                      highlighted && !cmd.disabled && "bg-[color:var(--hc-color-brand-50)]",
                      "[&>svg]:size-4 [&>svg]:shrink-0",
                    )}
                  >
                    {cmd.icon}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{cmd.label}</span>
                      {cmd.description && (
                        <span className="truncate text-[12px] text-[color:var(--hc-color-text-tertiary)]">
                          {cmd.description}
                        </span>
                      )}
                    </span>
                    {cmd.shortcut && (
                      <span
                        className={cn(
                          "ml-auto shrink-0",
                          "text-[12px] tracking-widest text-[color:var(--hc-color-text-tertiary)]",
                        )}
                      >
                        {cmd.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

/* ══════ Grouping ══════════════════════════════════════════════════ */

type Group = { name: string | undefined; commands: CommandItem[] };

function groupCommands(commands: CommandItem[]): Group[] {
  const map = new Map<string | undefined, CommandItem[]>();
  const order: (string | undefined)[] = [];
  for (const cmd of commands) {
    if (!map.has(cmd.group)) {
      map.set(cmd.group, []);
      order.push(cmd.group);
    }
    map.get(cmd.group)!.push(cmd);
  }
  return order.map((name) => ({ name, commands: map.get(name)! }));
}
