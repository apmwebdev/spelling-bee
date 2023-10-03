import { FormEvent, useState } from "react";
import { useSignupMutation } from "./authApiSlice";
import { EMAIL_REGEX, isSignupError, PASSWORD_REGEX } from "@/types";
import { composeClasses } from "@/util";
import { SignupFormInput } from "@/features/auth/SignupFormInput";

type MessageStatuses = "success" | "error";
const composeMessageClasses = (messageStatus: MessageStatuses) => {
  if (messageStatus === "success") {
    return composeClasses("Auth_message", "SuccessText");
  } else if (messageStatus === "error") {
    return composeClasses("Auth_message", "ErrorText");
  }
  return "Auth_message";
};

// This allows validation to run for the individual form fields when the form is
// submitted without needing to control it from here.
const signupFormSubmittedEvent = new Event("signupFormSubmitted");

export function Signup() {
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [messageStatus, setMessageStatus] =
    useState<MessageStatuses>("success");
  const [signup, { isLoading }] = useSignupMutation();

  const emailIsValid = (value: string) => EMAIL_REGEX.test(value);
  const nameIsValid = (value: string) => value.length > 0;
  const passwordIsValid = (value: string) => PASSWORD_REGEX.test(value);
  const passwordsMatch = (comparisonValue: string) => (value: string) =>
    value === comparisonValue && value.length > 0;
  const passwordConfirmIsValid = passwordsMatch(passwordValue);

  const canSubmit = () =>
    emailIsValid(emailValue) &&
    nameIsValid(nameValue) &&
    passwordIsValid(passwordValue) &&
    passwordsMatch(passwordValue)(passwordConfirmValue) &&
    !isLoading;

  const setMessage = (message: string, status: MessageStatuses) => {
    setMessageValue(message);
    setMessageStatus(status);
  };

  const resetForm = () => {
    setEmailValue("");
    setNameValue("");
    setPasswordValue("");
    setPasswordConfirmValue("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.dispatchEvent(signupFormSubmittedEvent);
    if (canSubmit()) {
      const formData = {
        user: {
          email: emailValue,
          name: nameValue,
          password: passwordValue,
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
          inputType="email"
          validate={emailIsValid}
          errorMessage="Please enter a valid email address"
        />
        <SignupFormInput
          value={nameValue}
          setValue={setNameValue}
          name="name"
          inputType="text"
          validate={nameIsValid}
          errorMessage="Please enter a name"
        />
        <hr className="Hr" />
        <SignupFormInput
          value={passwordValue}
          setValue={setPasswordValue}
          name="password"
          inputType="password"
          validate={passwordIsValid}
          errorMessage="Please enter a valid password"
        >
          <div className="Auth_fieldDescription">
            <div>Must be 10-128 characters and contain at least:</div>
            <div>1 capital letter, 1 lowercase letter, 1 number, 1 symbol</div>
          </div>
        </SignupFormInput>
        <SignupFormInput
          value={passwordConfirmValue}
          setValue={setPasswordConfirmValue}
          name="passwordConfirm"
          label="Confirm password"
          inputType="password"
          validate={passwordConfirmIsValid}
          errorMessage="Please ensure passwords match and are valid"
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
