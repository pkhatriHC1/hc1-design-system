import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { RadioGroup } from "../../components/radio";
import type { RadioGroupProps } from "../../components/radio";
import { FormField } from "./Form";

/**
 * Sugar wrapper: an HC1 RadioGroup bound to a string RHF field.
 *
 * RadioGroup already models a single-value control (its `value` +
 * `onValueChange` shape maps 1:1 to RHF's `field.value` + `field.onChange`).
 * Field-level error routes through the group's `errorMessage` slot so the
 * error text renders under the radios, and the group emits `aria-invalid`
 * as expected. Children are the `<Radio value="…">…</Radio>` list.
 */

export type FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  RadioGroupProps,
  "value" | "defaultValue" | "onValueChange" | "name" | "errorMessage"
> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
};

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  children,
  ...groupProps
}: FormRadioGroupProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <RadioGroup
          {...groupProps}
          name={field.name}
          value={(field.value ?? undefined) as string | undefined}
          onValueChange={(value) => field.onChange(value)}
          errorMessage={fieldState.error?.message}
        >
          {children}
        </RadioGroup>
      )}
    />
  );
}
