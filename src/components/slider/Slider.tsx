import { forwardRef, useEffect, useId, useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "../../utils/cn";
import { Input } from "../input";
import type { SliderProps } from "./Slider.types";

/**
 * HC1 Slider — pick a number on a range by dragging, with optional exact entry.
 *
 * Same architectural choice as Checkbox / Radio / Switch: a real native
 * `<input type="range">` does the work (keyboard, pointer, form value,
 * screen-reader semantics) and sits invisibly on top of the painted track,
 * fill and thumb. No extra Radix dependency, so apps install nothing new.
 *
 * The painted thumb is positioned with the same geometry the browser uses
 * for the native thumb (centre travels from thumb/2 to width − thumb/2), so
 * pointer hits always land where the thumb is drawn.
 */

const THUMB = { sm: 14, md: 16 } as const;
const TRACK = { sm: 4, md: 6 } as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const snap = (v: number, min: number, step: number) => {
  const n = Math.round((v - min) / step) * step + min;
  return Number(n.toFixed(6));
};

/** Left offset for a point on the track, matching the native thumb travel. */
const at = (pct: number, thumb: number) => `calc(${pct}% + ${thumb / 2 - (pct / 100) * thumb}px)`;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    description,
    unit = "",
    showInput = false,
    marks,
    startLabel,
    endLabel,
    size = "md",
    disabled = false,
    invalid = false,
    formatValue,
    id: idProp,
    className,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `hc-slider-${autoId}`;
  const descId = `${id}-description`;
  const controlled = valueProp !== undefined;
  const [inner, setInner] = useState(() => clamp(defaultValue ?? min, min, max));
  const value = clamp(controlled ? (valueProp as number) : inner, min, max);
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);

  const set = (next: number) => {
    const v = clamp(snap(next, min, step), min, max);
    if (!controlled) setInner(v);
    onChange?.(v);
  };

  const span = max - min || 1;
  const pct = ((value - min) / span) * 100;
  const thumb = THUMB[size];
  const track = TRACK[size];
  const text = formatValue ? formatValue(value) : `${value}${unit}`;
  const hasCaptions = startLabel != null || endLabel != null;

  return (
    <div
      data-slot="slider"
      data-disabled={disabled || undefined}
      className={cn("flex min-w-0 flex-col gap-[var(--hc-space-8)]", disabled && "opacity-50", className)}
    >
      {(label || showInput) && (
        <div className="flex flex-col gap-[var(--hc-space-8)]">
          {label && (
            <div className="flex items-baseline justify-between gap-[var(--hc-space-8)]">
              <label htmlFor={id} className="text-[14px] font-medium text-[color:var(--hc-color-text-primary)]">{label}</label>
              {!showInput && (
                <span data-slot="slider-value" className="text-[14px] font-semibold tabular-nums text-[color:var(--hc-color-text-primary)]">{text}</span>
              )}
            </div>
          )}
          {description && <span id={descId} className="text-[12px] text-[color:var(--hc-color-text-supporting)]">{description}</span>}
          {showInput && (
            <div className="flex items-center gap-[var(--hc-space-8)]">
              <div className="w-[var(--hc-space-80)]">
                <Input
                  type="number"
                  size="sm"
                  aria-label={typeof label === "string" ? `${label} value` : "Value"}
                  value={draft}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  validation={invalid ? "error" : undefined}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    const n = parseFloat(e.target.value);
                    if (Number.isFinite(n) && n >= min && n <= max) set(n);
                  }}
                  onBlur={() => {
                    const n = parseFloat(draft);
                    if (Number.isFinite(n)) set(n); else setDraft(String(value));
                  }}
                />
              </div>
              {unit && <span className="text-[14px] text-[color:var(--hc-color-text-supporting)]">{unit}</span>}
            </div>
          )}
        </div>
      )}

      <div className="relative" style={{ height: thumb + 4 } as CSSProperties}>
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label ? undefined : ariaLabel}
          aria-valuetext={text}
          aria-invalid={invalid || undefined}
          aria-describedby={description ? descId : undefined}
          onChange={(e) => set(parseFloat(e.target.value))}
          className={cn(
            "peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0",
            "disabled:cursor-not-allowed",
            size === "sm"
              ? "[&::-webkit-slider-thumb]:size-[14px] [&::-moz-range-thumb]:size-[14px]"
              : "[&::-webkit-slider-thumb]:size-[16px] [&::-moz-range-thumb]:size-[16px]",
            "[&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:border-0",
          )}
          {...rest}
        />
        <span
          aria-hidden
          data-slot="slider-track"
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[color:var(--hc-color-bg-muted)]"
          style={{ height: track }}
        >
          <span
            data-slot="slider-fill"
            className={cn("absolute inset-y-0 left-0 rounded-full",
              invalid ? "bg-[color:var(--hc-color-status-error-fg)]" : "bg-[color:var(--hc-color-action-primary)]")}
            style={{ width: at(pct, thumb) }}
          />
        </span>
        <span
          aria-hidden
          data-slot="slider-thumb"
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[color:var(--hc-color-bg-surface)] shadow-sm",
            invalid ? "border-[color:var(--hc-color-status-error-fg)]" : "border-[color:var(--hc-color-action-primary)]",
            "peer-hover:scale-110 transition-transform duration-150 motion-reduce:transition-none",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[color:var(--hc-color-border-focus)]",
          )}
          style={{ left: at(pct, thumb), width: thumb, height: thumb }}
        />
      </div>

      {marks && marks.length > 0 && (
        <div data-slot="slider-marks" className="relative h-[var(--hc-space-24)]" aria-hidden>
          {marks.map((m) => {
            const mp = ((clamp(m.value, min, max) - min) / span) * 100;
            return (
              <span key={m.value} className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-[2px]" style={{ left: at(mp, thumb) }}>
                <span className="h-[8px] w-px bg-[color:var(--hc-color-status-info-fg)]" />
                <span className="whitespace-nowrap text-[12px] font-medium text-[color:var(--hc-color-status-info-fg)]">{m.label ?? `${m.value}${unit}`}</span>
              </span>
            );
          })}
        </div>
      )}

      {hasCaptions && (
        <div data-slot="slider-captions" className="flex justify-between gap-[var(--hc-space-8)] text-[12px] text-[color:var(--hc-color-text-supporting)]">
          <span>{startLabel}</span>
          <span className="text-right">{endLabel}</span>
        </div>
      )}
    </div>
  );
});
Slider.displayName = "Slider";
