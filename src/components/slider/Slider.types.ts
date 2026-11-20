import type { InputHTMLAttributes, ReactNode } from "react";

export type SliderSize = "sm" | "md";

/** A reference point shown under the track, e.g. a benchmark ("AABB 90%"). */
export type SliderMark = {
  value: number;
  /** Text under the tick. Defaults to the value with the unit. */
  label?: ReactNode;
};

export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "size" | "min" | "max" | "step"
> & {
  /** Controlled value. Pair with `onChange`. */
  value?: number;
  /** Uncontrolled initial value. Ignored when `value` is set. @default min */
  defaultValue?: number;
  /** Called with the new number whenever the value changes (drag, keys or the number box). */
  onChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;

  /** Visible label above the slider. Also names the control for screen readers. */
  label?: ReactNode;
  /** Muted helper text under the label. */
  description?: ReactNode;
  /** Unit after the value, e.g. "%" or "g/dL". */
  unit?: string;
  /**
   * Show an editable number box beside the label so people can type an exact value.
   * When false, the current value is shown as read-only text on the label row.
   * @default false
   */
  showInput?: boolean;

  /** Reference points under the track (benchmarks, targets, defaults). */
  marks?: SliderMark[];
  /** Caption under the left end of the track, e.g. "Liberal". */
  startLabel?: ReactNode;
  /** Caption under the right end of the track, e.g. "Restrictive". */
  endLabel?: ReactNode;

  /** @default "md" */
  size?: SliderSize;
  disabled?: boolean;
  /** Error styling, for a value that fails validation. */
  invalid?: boolean;
  /** Text read by screen readers for a value. @default `${value}${unit}` */
  formatValue?: (value: number) => string;
  id?: string;
};
