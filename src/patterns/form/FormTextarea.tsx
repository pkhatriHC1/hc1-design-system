import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { Textarea } from "../../components/textarea";
import type { TextareaProps } from "../../components/textarea";
import { FormField } from "./Form";

/**
 * Sugar wrapper: an HC1 Textarea bound to an RHF field.
 *
 * Mirrors FormInput exactly — forwards every Textarea prop, injects
 * RHF's `field` bindings, maps `fieldState.error?.message` into
 * `Textarea.errorMessage` so validation styling + aria-invalid land
 * without wiring.
 */

export type FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextareaProps,
  "value" | "onChange" | "onBlur" | "name" | "defaultValue" | "errorMessage"
> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
};

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, defaultValue, ...textareaProps }: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Textarea
          {...textareaProps}
          name={field.name}
          value={(field.value ?? "") as string}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
