import { FormEvent, useState } from "react";
import { useSignupMutation } from "./authApiSlice";
import { isSignupError } from "@/types";
import { composeClasses } from "@/util";

type MessageStatuses = "success" | "error";
const composeMessageClasses = (messageStatus: MessageStatuses) => {
  if (messageStatus === "success") {
    return composeClasses("Auth_message", "SuccessText");
  } else if (messageStatus === "error") {
    return composeClasses("Auth_message", "ErrorText");
  }
  return "Auth_message";
};

export function Signup() {
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [messageStatus, setMessageStatus] =
    useState<MessageStatuses>("success");
  const [signup, { isLoading }] = useSignupMutation();

  const canSubmit = () => {
    if (
      !(
        emailValue &&
        nameValue &&
        passwordValue &&
        passwordConfirmValue &&
        !isLoading
      )
    ) {
      return false;
    }
    return passwordValue === passwordConfirmValue;
  };

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
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_emailInput">Email:</label>
          <input
            type="email"
            id="Signup_emailInput"
            name="signup-email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </fieldset>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_nameInput">Name:</label>
          <input
            type="text"
            className="Auth_textInput"
            id="Signup_nameInput"
            name="signup-name"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            required
          />
        </fieldset>
        <hr className="Hr" />
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_passwordInput">Password:</label>
          <input
            type="password"
            className="Auth_textInput"
            id="Signup_passwordInput"
            name="signup-password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
          />
          <label
            htmlFor="Signup_passwordInput"
            className="Auth_fieldDescription"
          >
            Must be 10 characters or more
          </label>
        </fieldset>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_passwordConfirmInput">Confirm password:</label>
          <input
            type="password"
            className="Auth_textInput"
            id="Signup_passwordConfirmInput"
            name="signup-password-confirm"
            value={passwordConfirmValue}
            onChange={(e) => setPasswordConfirmValue(e.target.value)}
            required
          />
        </fieldset>
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
