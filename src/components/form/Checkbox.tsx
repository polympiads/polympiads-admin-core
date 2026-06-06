import React from "react";
import type { BooleanDeepKeys } from "./Layout";
import type { ReactFormApi } from "@tanstack/react-form";

export interface CheckboxProps {
  title : string;

  value : boolean;
  error : string;

  setValue : (value: boolean) => void;
};

export function Checkbox (props: CheckboxProps) {
    const id = React.useId();

    return (
        <div>
            <div className="flex gap-4">
                <input
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    type="checkbox"
                    checked={props.value}
                    id={id}
                    onChange={(e) => props.setValue(e.target.checked)}
                ></input>
                <label 
                    htmlFor={id}
                    className="block text-[11px] font-medium tracking-[0.07em] uppercase text-gray-500">
                    {props.title}
                </label>
            </div>
            {props.error && (
                <p className="text-[11.5px] text-red-600 mt-1">{props.error}</p>
            )}
        </div>
    )
}

interface FormCheckboxProps<TFormData> {
  fieldName: BooleanDeepKeys<TFormData>;
  
  form: ReactFormApi<TFormData, any, any, any, any, any, any, any, any, any, any, any>
  
  title: string
}

export function FormCheckboxField<TData> (props: FormCheckboxProps<TData>) {
    return <props.form.Field name={props.fieldName}
          children={(field) => {
              const handleChange = (value: boolean) => (field.handleChange as any)(value);
    
              return <Checkbox title={props.title} error={
                field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors.map(e => e?.message ?? e).join(',') : ""
              } setValue={handleChange} value={field.state.value as boolean} />;
          }}
      />
}
