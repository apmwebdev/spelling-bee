import { Dispatch, ReactNode, SetStateAction, useId } from "react";
import classNames from "classnames/dedupe";
import { capitalize } from "lodash";

export function ValidatableFormInput({
  name,
  inputType,
  cssBlock,
  value,
  setValue,
  validate,
  message,
  label,
  additionalValidationFn,
  children,
}: {
  name: string;
  inputType: "text" | "email" | "password";
  /** For determining what CSS classes to apply */
  cssBlock: "User" | "Auth";
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  validate: (value: string) => boolean;
  message: string;
  label?: string;
  additionalValidationFn?: () => () => boolean;
  children?: ReactNode;
}) {
  const inputId = useId();
  const inputClassnames = classNames({
    [`${cssBlock}_textInput`]: true,
    TextInput___invalid: message.length > 0,
  });
  const messageClassnames = classNames({
    [`${cssBlock}_fieldMessage`]: true,
    ErrorText: message.length > 0,
  });
  const handleChange = (localValue: string) => {
    setValue(localValue);
    validate(localValue);
    // if (additionalValidationFn) additionalValidationFn();
  };

  const handleBlur = () => {
    validate(value);
    if (additionalValidationFn) additionalValidationFn();
  };

  return (
    <fieldset className={`${cssBlock}_fieldset`}>
      <label className={`${cssBlock}_fieldLabel`} htmlFor={inputId}>
        {label ?? capitalize(name)}:
      </label>
      <input
        type={inputType}
        className={inputClassnames}
        id={inputId}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
      />
      <label htmlFor={inputId} className={messageClassnames}>
        {message}
      </label>
      {children}
    </fieldset>
  );
}
