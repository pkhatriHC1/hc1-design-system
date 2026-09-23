import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { Switch } from "../../components/switch";
import type { SwitchProps } from "../../components/switch";
import { FormField } from "./Form";

/**
 * Sugar wrapper: an HC1 Switch bound to a boolean RHF field.
 *
 * Same shape as FormCheckbox — Switch is Checkbox's toggle-style sibling
 * so the adapter is symmetric. Error state maps to `invalid` on the
 * switch (no inline error text, matching Switch's single-row layout).
 */

export type FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  SwitchProps,
  "checked" | "defaultChecked" | "onChange" | "onCheckedChange" | "name" | "invalid"
> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
};

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, defaultValue, ...switchProps }: FormSwitchProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Switch
          {...switchProps}
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
