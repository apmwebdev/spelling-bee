import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
  const [messageValue, setMessageValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    window.addEventListener("signupFormSubmitted", checkValidationEffect);

    return () => {
      window.removeEventListener("signupFormSubmitted", checkValidationEffect);
    };
  }, []);

  const inputId = `Signup_${name}Input`;

  const inputClassnames = classNames({
    Auth_textInput: true,
    TextInput___invalid: isInvalid,
  });

  const messageClassnames = classNames({
    Auth_fieldMessage: true,
    ErrorText: isInvalid,
    SuccessText: !isInvalid,
  });

  const checkValidation = (value: string) => {
    const isValid = validate(value);
    if (isValid) {
      setIsInvalid(false);
      setMessageValue("");
    } else {
      setIsInvalid(true);
      setMessageValue(errorMessage);
    }
  };

  const checkValidationEffect = () => {
    checkValidation(value);
  };

  const handleChange = (value: string) => {
    setValue(value);
    checkValidation(value);
  };

  return (
    <fieldset className="Auth_fieldset">
      <label htmlFor="Signup_nameInput">{label ?? capitalize(name)}:</label>
      <input
        type={inputType}
        className={inputClassnames}
        id={inputId}
        name={`signup-${name}`}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => checkValidation(value)}
      />
      <label htmlFor={`Signup_${name}Input`} className={messageClassnames}>
        {messageValue}
      </label>
      {children}
    </fieldset>
  );
}
