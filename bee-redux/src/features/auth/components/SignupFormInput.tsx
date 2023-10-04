import { Dispatch, ReactNode, SetStateAction } from "react";
import classNames from "classnames/dedupe";
import { capitalize } from "lodash";

export function SignupFormInput({
  value,
  setValue,
  name,
  label,
  inputType,
  validate,
  errorMessage,
  children,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  name: string;
  label?: string;
  inputType: "text" | "email" | "password";
  validate: (value: string) => boolean;
  errorMessage: string;
  children?: ReactNode;
}) {
  const inputId = `Signup_${name}Input`;

  const inputClassnames = classNames({
    Auth_textInput: true,
    TextInput___invalid: errorMessage.length > 0,
  });

  const messageClassnames = classNames({
    Auth_fieldMessage: true,
    ErrorText: errorMessage.length > 0,
  });

  const handleChange = (value: string) => {
    setValue(value);
    validate(value);
  };

  return (
    <fieldset className="Auth_fieldset">
      <label className="Auth_fieldLabel" htmlFor="Signup_nameInput">
        {label ?? capitalize(name)}:
      </label>
      <input
        type={inputType}
        className={inputClassnames}
        id={inputId}
        name={`signup-${name}`}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => validate(value)}
      />
      <label htmlFor={`Signup_${name}Input`} className={messageClassnames}>
        {errorMessage}
      </label>
      {children}
    </fieldset>
  );
}
