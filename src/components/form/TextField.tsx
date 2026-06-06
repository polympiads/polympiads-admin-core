import type { ReactFormApi } from "@tanstack/react-form";
import type { KeyboardEventHandler } from "react";
import type { StringDeepKeys } from "./Layout";

const inputBase =
  "w-full h-[38px] px-3 text-[13.5px] border outline-none transition-all duration-150 rounded-none";
const inputIdle =
  "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#1a7fbb] focus:bg-white focus:ring-2 focus:ring-[#1a7fbb]/10 hover:border-gray-400";
const inputError =
  "bg-red-50 border-red-400 text-gray-900 ring-2 ring-red-200";

export interface TextFieldProps {
  ref ?: React.RefObject<null>;

  type        : string;
  title       : string;
  placeholder : string;

  autoComplete ?: string;

  value    : string;
  error    : string;
  setValue : (value: string) => void;
  setError : (error: string) => void;

  handleKeyDown ?: KeyboardEventHandler<HTMLInputElement>;
};

export function TextField (props: TextFieldProps) {
  return (
    <>
      <label className="block text-[11px] font-medium tracking-[0.07em] uppercase text-gray-500 mb-1.5">
        {props.title}
      </label>
      <input
        ref={props.ref}
        type={props.type}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        spellCheck={false}
        value={props.value}
        onKeyDown={props.handleKeyDown}
        onChange={(e) => {
          props.setValue(e.target.value);
          props.setError("");
        }}
        className={`${inputBase} ${props.error ? inputError : inputIdle}`}
      />
      {props.error && (
        <p className="text-[11.5px] text-red-600 mt-1">{props.error}</p>
      )}
    </>
  );
}

interface FormTextFieldProps<TFormData> {
  fieldName: StringDeepKeys<TFormData>;
  
  form: ReactFormApi<TFormData, any, any, any, any, any, any, any, any, any, any, any>
  
  title: string
  placeholder: string
  type: string
}

export function FormTextField<TFormData> (props: FormTextFieldProps<TFormData>) {
  return <props.form.Field name={props.fieldName}
      children={(field) => {
          const handleChange = (value: string) => (field.handleChange as any)(value);

          return <TextField type={props.type} title={props.title} error={
            field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors.map(e => e?.message ?? e).join(',') : ""
          } placeholder={props.placeholder}
              setValue={handleChange} setError={() => {}} value={field.state.value as string} />;
      }}
  />
}
