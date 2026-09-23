import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { Select } from "../../components/select";
import type { SelectProps, SelectOption } from "../../components/select";
import { FormField } from "./Form";

/**
 * Sugar wrapper: an HC1 Select bound to an RHF field.
 *
 * Adapts Select's `(value, option) => void` onChange signature to RHF's
 * `field.onChange(value)`. RHF only cares about the primitive value; the
 * option object is discarded (consumers who need the full option can drop
 * to FormField + Select directly).
 */

export type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  SelectProps,
  "value" | "onChange" | "defaultValue" | "errorMessage"
> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
  /**
   * Optional secondary onChange for consumers that need the full option
   * object alongside the raw value. RHF sees the value; this fires after.
   */
  onChange?: (value: string, option: SelectOption) => void;
};

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  onChange: onChangeExtra,
  ...selectProps
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Select
          {...selectProps}
          name={field.name}
          value={(field.value ?? undefined) as string | undefined}
          onChange={(value, option) => {
            field.onChange(value);
            onChangeExtra?.(value, option);
          }}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
