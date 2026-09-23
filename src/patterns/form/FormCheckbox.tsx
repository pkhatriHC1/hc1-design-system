import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { Checkbox } from "../../components/checkbox";
import type { CheckboxProps } from "../../components/checkbox";
import { FormField } from "./Form";

/**
 * Sugar wrapper: an HC1 Checkbox bound to a boolean RHF field.
 *
 * Adapts Checkbox's `onCheckedChange(checked, event)` to RHF's
 * `field.onChange(checked)`. Field-level error toggles `invalid` on the
 * checkbox — Checkbox doesn't render inline error text (that's Radio's
 * job at the group level), so consumers who need a visible error message
 * for a single checkbox should render it themselves under the row.
 */

export type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  CheckboxProps,
  "checked" | "defaultChecked" | "onChange" | "onCheckedChange" | "name" | "invalid"
> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
};

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, defaultValue, ...checkboxProps }: FormCheckboxProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Checkbox
          {...checkboxProps}
          name={field.name}
          checked={!!field.value}
          onCheckedChange={(checked) => field.onChange(checked)}
          onBlur={field.onBlur}
          ref={field.ref}
          invalid={!!fieldState.error}
        />
      )}
    />
  );
}
