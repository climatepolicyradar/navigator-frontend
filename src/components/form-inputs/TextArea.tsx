import React from "react";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import FormFieldError from "../blocks/Error";

interface TextAreaProps {
  id?: string;
  name: string;
  label: string;
  classes?: string;
  required?: boolean;
  placeholder?: string;
  errors: {};
  register: any;
}

const TextArea = ({ id = "", name, label, required = false, placeholder = "", errors, classes = "", register }: TextAreaProps) => {
  return (
    <div className={`${classes}`}>
      <label htmlFor={id}>
        {label}
        {required ? <strong className="text-red-600"> *</strong> : null}
      </label>
      <textarea id={id} className={`border ${errors[name] ? "border-red-600" : "border-gray-300"}`} placeholder={placeholder} {...register(name)} />
      {errors[name] && <FormFieldError message={errors[name].message} />}
    </div>
  );
};

export default TextArea;
