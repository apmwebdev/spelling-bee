import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSignupMutation } from "@/features/auth";
import { EMAIL_REGEX, isSignupError, PASSWORD_REGEX } from "@/types";
import { SignupFormInput } from "@/features/auth/components/SignupFormInput";
import classNames from "classnames/dedupe";

type MessageStatuses = "success" | "error";
const composeMessageClasses = (messageStatus: MessageStatuses) =>
  classNames({
    Auth_message: true,
    SuccessText: messageStatus === "success",
    ErrorText: messageStatus === "error",
  });

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
  const [messageValue, setMessageValue] = useState("");
  const [messageStatus, setMessageStatus] =
    useState<MessageStatuses>("success");
  const [signup, { isLoading }] = useSignupMutation();
  const passwordConfirmValidationFn = passwordsMatch(passwordValue);

  const setMessage = (message: string, status?: MessageStatuses) => {
    setMessageValue(message);
    setMessageStatus(status ?? "success");
  };

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
    errorMessage: "Please enter a valid email address",
    setErrorMessage: setEmailMessage,
  });

  const validateName = validateField({
    validationFn: (value: string) => value.length > 0,
    errorMessage: "Please enter a name",
    setErrorMessage: setNameMessage,
  });

  const validatePassword = validateField({
    validationFn: (value: string) => PASSWORD_REGEX.test(value),
    errorMessage: "Please enter a valid password",
    setErrorMessage: setPasswordMessage,
  });

  const validatePasswordConfirm = validateField({
    validationFn: passwordConfirmValidationFn,
    errorMessage: "Please ensure passwords match and are valid",
    setErrorMessage: setPasswordConfirmMessage,
  });

  const validateForm = () => {
    setMessage("");
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
        setMessage(response.success, "success");
      } catch (error) {
        console.error("Failed to save user: ", error);
        if (isSignupError(error)) {
          setMessage(error.data.error, "error");
        } else {
          setMessage("Error", "error");
        }
      }
    }
  };

  return (
    <div className="Auth_container">
      <div className={composeMessageClasses(messageStatus)}>{messageValue}</div>
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
        <button type="button" className="standardButton">
          Resend confirmation email
        </button>
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
