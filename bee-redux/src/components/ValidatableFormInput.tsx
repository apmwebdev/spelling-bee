import { Dispatch, ReactNode, SetStateAction, useId } from "react";
import classNames from "classnames/dedupe";
import { capitalize } from "lodash";
import { AuthMessageHook } from "@/features/auth";
import { UserFieldValidator } from "@/hooks/useUserInfoFormField";

export function ValidatableFormInput({
  name,
  inputType,
  cssBlock,
  value,
  setValue,
  validate,
  messageHook,
  existingValue,
  label,
  children,
}: {
  /** Field name for the form */
  name: string;
  inputType: "text" | "email" | "password";
  /** For determining what CSS classes to apply */
  cssBlock: "User" | "Auth";
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  /** Validation fn. Will fail on empty value, which is handled elsewhere */
  validate: UserFieldValidator;
  /** Validation/error message for the input field based on validation fn */
  messageHook: AuthMessageHook;
  existingValue?: string;
  /** Field label, if different from name */
  label?: string;
  /** Used for a field description, if needed */
  children?: ReactNode;
}) {
  const inputId = useId();
  const inputClassnames = classNames({
    Auth_textInput: true,
    TextInput___invalid: messageHook.output.status === "Error",
  });
  const handleChange = (localValue: string) => {
    setValue(localValue);
    validate(localValue, existingValue);
  };
  const handleBlur = () => {
    validate(value, existingValue);
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
      <label htmlFor={inputId} className={messageHook.output.classes}>
        {messageHook.output.value}
      </label>
      {children}
    </fieldset>
  );
}
