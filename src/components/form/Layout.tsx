import type { DeepKeys, DeepValue, ReactFormApi } from "@tanstack/react-form";
import { Button, type ButtonVariant } from "./Button";
import { FormTextField } from "./TextField";
import { FormCheckboxField } from "./Checkbox";

export type XDeepKeys<TData, X> = {
    [K in DeepKeys<TData>]: DeepValue<TData, K> extends X ? K : never
}[DeepKeys<TData>];
export type StringDeepKeys<TData>  = XDeepKeys<TData, string>;
export type BooleanDeepKeys<TData> = XDeepKeys<TData, boolean>;

export type TextInputField<TData> = {
    input: "text";
    field: StringDeepKeys<TData>;

    title: string;
    /* Placeholder of text field, defaults to title */
    placeholder ?: string;

    /* Type of text field, defaults to "text" */
    type ?: string;
};
export type CheckboxField<TData> = {
    input: "check";
    field: BooleanDeepKeys<TData>;
    title: string;
};
export type MultiLayout<TData> = {
    input: "multi";
    childs: LeafLayout<TData>[];
}
export type SubmitButton = {
    input: "submit";
    text: string;
    variant ?: ButtonVariant;
};
export type LeafLayout<TData> = TextInputField<TData> | CheckboxField<TData>;
export type AllLayout<TData>  = LeafLayout<TData> | MultiLayout<TData> | SubmitButton;

export type FormLayout<TData> = AllLayout<TData>[];

export type Form<TFormData> = ReactFormApi<TFormData, any, any, any, any, any, any, any, any, any, any, any> & { handleSubmit: () => void };

function FormInternalRenderer<TData> (props: { form: Form<TData>, layout: AllLayout<TData>, className: string }) {
    const { form, layout, className } = props;

    console.log(layout.input)

    if (layout.input === "text") {
        return <div className={className}>
            <FormTextField
                form={form}
                fieldName={layout.field}
                title={layout.title}
                placeholder={layout.placeholder ?? layout.title}
                type={layout.type ?? "text"} />
        </div>
    } else if (layout.input === "check") {
        return  <div className={className}>
            <FormCheckboxField
                form={form}
                fieldName={layout.field}
                title={layout.title} />
        </div>
    } else if (layout.input === "multi") {
        return <div className={className + " flex gap-4"}>
            {...layout.childs.map((child, index) => (
                <FormInternalRenderer
                    key={index}
                    form={form}
                    layout={child}
                    className={"flex-1"} />
            ))}
        </div>
    } else if (layout.input === "submit") {
        return <div className={className}>
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([_canSubmit, isSubmitting]) => (
                    <Button onClick={() => { form.handleSubmit() }} loading={isSubmitting}
                    text={layout.text}
                    variant={layout.variant ?? "primary"}/>
                )}
            />
        </div>
    }
}
export function FormRenderer<TData> (props: { form: Form<TData>, layout: FormLayout<TData> }) {
    console.log(props.layout)
    return <>
        {...props.layout.map((layout, index) => 
            <FormInternalRenderer key={index} form={props.form} layout={layout} className="" />
        )}
    </>
}
