import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSignupMutation } from "@/features/auth";
import { EMAIL_REGEX, isBasicError, PASSWORD_REGEX } from "@/types";
import { SignupFormInput } from "@/features/auth/components/SignupFormInput";
import { ResendConfirmationButton } from "@/features/auth/components/headerAuth/ResendConfirmationButton";
import { useMessage } from "@/features/auth/hooks/useMessage";
import { Message } from "@/features/auth/components/Message";

const passwordsMatch = (comparisonValue: string) => (value: string) =>
  value === comparisonValue && value.length > 0;

/**
 * @name Signup
 * @constructor
 * Controls the signup form validation and submission logic.
 * The data and validation need to be defined here rather than in individual
 * SignupFormInput components (the form fields) so that a field can be
 * validated both on events affecting only that field (e.g., onChange, onBlur)
 * and on events affecting the form as a whole, namely form submission.
 */
export function Signup() {
  const [emailValue, setEmailValue] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [signup, { isLoading }] = useSignupMutation();
  const passwordConfirmValidationFn = passwordsMatch(passwordValue);
  const message = useMessage();

  const validateField =
    ({
      validationFn,
      errorMessage,
      setErrorMessage,
    }: {
      validationFn: (value: string) => boolean;
      errorMessage: string;
      setErrorMessage: Dispatch<SetStateAction<string>>;
    }) =>
    (value: string) => {
      if (validationFn(value)) {
        setErrorMessage("");
        return true;
      }
      setErrorMessage(errorMessage);
      return false;
    };

  const validateEmail = validateField({
    validationFn: (value: string) => EMAIL_REGEX.test(value),
    // validationFn: (value: string) => true,
    errorMessage: "Please enter a valid email address",
    setErrorMessage: setEmailMessage,
  });

  const validateName = validateField({
    validationFn: (value: string) => value.length > 0,
    // validationFn: (value: string) => true,
    errorMessage: "Please enter a name",
    setErrorMessage: setNameMessage,
  });

  const validatePassword = validateField({
    validationFn: (value: string) => PASSWORD_REGEX.test(value),
    // validationFn: () => true
    errorMessage: "Please enter a valid password",
    setErrorMessage: setPasswordMessage,
  });

  const validatePasswordConfirm = validateField({
    validationFn: passwordConfirmValidationFn,
    // validationFn: () => true,
    errorMessage: "Please ensure passwords match and are valid",
    setErrorMessage: setPasswordConfirmMessage,
  });

  const validateForm = () => {
    message.update("");
    const emailIsValid = validateEmail(emailValue);
    const nameIsValid = validateName(nameValue);
    const passwordIsValid = validatePassword(passwordValue);
    const passwordConfirmIsValid =
      validatePasswordConfirm(passwordConfirmValue);
    return (
      emailIsValid &&
      nameIsValid &&
      passwordIsValid &&
      passwordConfirmIsValid &&
      !isLoading
    );
  };

  const resetForm = () => {
    setEmailValue("");
    setNameValue("");
    setPasswordValue("");
    setPasswordConfirmValue("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = {
        user: {
          email: emailValue,
          name: nameValue,
          password: passwordValue,
          password_confirmation: passwordConfirmValue,
        },
      };
      try {
        const response = await signup(formData).unwrap();
        resetForm();
        message.update(response.success, "success");
      } catch (error) {
        console.error("Failed to save user: ", error);
        if (isBasicError(error)) {
          message.update(error.data.error, "error");
        } else {
          message.update("Error", "error");
        }
      }
    }
  };

  return (
    <div className="Auth_container">
      <Message {...message.output} />
      <form id="Signup_form" className="Auth_form" onSubmit={handleSubmit}>
        <SignupFormInput
          value={emailValue}
          setValue={setEmailValue}
          name="email"
          inputType="text"
          validate={validateEmail}
          errorMessage={emailMessage}
        />
        <SignupFormInput
          value={nameValue}
          setValue={setNameValue}
          name="name"
          inputType="text"
          validate={validateName}
          errorMessage={nameMessage}
        />
        {/*<hr className="Hr" />*/}
        <SignupFormInput
          value={passwordValue}
          setValue={setPasswordValue}
          name="password"
          inputType="password"
          validate={validatePassword}
          errorMessage={passwordMessage}
        >
          <div className="Auth_fieldDescription">
            <div>Passwords must be at least 10 characters and contain</div>
            <div>1 capital, 1 lowercase, 1 number, and 1 symbol</div>
          </div>
        </SignupFormInput>
        <SignupFormInput
          value={passwordConfirmValue}
          setValue={setPasswordConfirmValue}
          name="passwordConfirm"
          label="Confirm password"
          inputType="password"
          validate={validatePasswordConfirm}
          errorMessage={passwordConfirmMessage}
        />
      </form>
      <div className="Auth_actions">
        <ResendConfirmationButton />
        <button
          type="submit"
          form="Signup_form"
          className="standardButton Auth_submit"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
