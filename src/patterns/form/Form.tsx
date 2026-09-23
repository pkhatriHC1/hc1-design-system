import type { ReactElement } from "react";
import {
  FormProvider,
  useController,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from "react-hook-form";

/**
 * HC1 Form pattern — thin react-hook-form adapter.
 *
 * `Form` is `FormProvider` re-exported so consumers write `<Form {...form}>`
 * where `form = useForm(...)`. `FormField` is the headless render-prop
 * primitive: it subscribes to a single field via `useController` and
 * hands back the RHF `field` + `fieldState` so the caller wires them
 * into any control — HC1 primitives, third-party inputs, custom canvases.
 *
 * Sugar wrappers (`FormInput` today; more to come) sit on top of
 * `FormField` and skip the render-prop boilerplate for the common
 * "field bound to a DS primitive" case.
 *
 * Why RHF as a peer dep, not headless-with-optional-adapter:
 *   At HC1 scale the DS is a single-source-of-truth for a small number
 *   of products. Standardizing on one form library means shared bugfixes,
 *   consistent DevTools, and one canonical way to write forms across
 *   ClinicalIQ / SourceIQ / HerCare / future modules. Consumers who
 *   don't reach for `<Form>` still use bare `<Input>` etc. without
 *   pulling RHF into their bundle.
 */

/** Re-export of react-hook-form's FormProvider. */
export const Form = FormProvider;

/**
 * Props for the headless FormField primitive.
 *
 * Preserves RHF's generics so `name` gets full autocomplete against
 * the shape of `TFieldValues`, and `defaultValue` is type-checked
 * against the resolved field type.
 */
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /**
   * The RHF `control` object, typically `form.control` where
   * `form = useForm<TFieldValues>()`.
   */
  control: Control<TFieldValues>;
  /**
   * Path to the field inside `TFieldValues` — dot-notation is supported
   * ("address.city") and typed against the schema.
   */
  name: TName;
  /**
   * Initial value passed to `useController`. Only takes effect on mount.
   */
  defaultValue?: PathValue<TFieldValues, TName>;
  /**
   * Render prop. Receives RHF's `field` (value + onChange + onBlur + ref)
   * and `fieldState` (invalid + isTouched + isDirty + error). Return a
   * single React element with `field` spread onto whatever control you're
   * rendering.
   */
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
  }) => ReactElement;
};

/**
 * Headless RHF adapter. Subscribes to a single field and forwards its
 * state to the `render` prop. Consumers use this when they need to bind
 * a custom control that no sugar wrapper covers, or when they want full
 * control over what happens with `fieldState`.
 *
 * @example
 * <FormField
 *   control={form.control}
 *   name="email"
 *   render={({ field, fieldState }) => (
 *     <Input {...field} label="Email" errorMessage={fieldState.error?.message} />
 *   )}
 * />
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, defaultValue, render }: FormFieldProps<TFieldValues, TName>) {
  const controller = useController({ control, name, defaultValue });
  return render({ field: controller.field, fieldState: controller.fieldState });
}
