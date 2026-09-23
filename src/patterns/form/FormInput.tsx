import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { Input } from "../../components/input";
import type { InputProps } from "../../components/input";
import { FormField } from "./Form";

/**
 * Sugar wrapper: an HC1 Input bound to an RHF field.
 *
 * Forwards every Input prop the consumer passes (label / size / leadingIcon /
 * helperText / etc.) while automatically injecting the RHF field bindings
 * (`value`, `onChange`, `onBlur`, `name`, `ref`) and mapping the field's
 * error to `Input.errorMessage` — so validation just works without the
 * consumer wiring anything.
 *
 * When to reach for FormField directly instead:
 *   - You need to render a custom control (not Input).
 *   - You want to observe `fieldState.isDirty` / `isTouched` for logic
 *     the Input surface doesn't cover.
 *   - You need to intercept `field.onChange` before it reaches the input
 *     (e.g., to normalize a phone number as the user types).
 */

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  InputProps,
  "value" | "onChange" | "onBlur" | "name" | "defaultValue" | "errorMessage"
> & {
  /** RHF control from `useForm().control`. */
  control: Control<TFieldValues>;
  /** Field path inside the form schema. */
  name: TName;
  /** Initial value passed to `useController`. */
  defaultValue?: PathValue<TFieldValues, TName>;
};

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, defaultValue, ...inputProps }: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Input
          {...inputProps}
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
