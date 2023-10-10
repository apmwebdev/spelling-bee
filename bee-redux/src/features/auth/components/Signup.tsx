import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSignupMutation } from "@/features/auth";
import { EMAIL_REGEX, isBasicError, PASSWORD_REGEX } from "@/types";
import { ValidatableFormInput } from "@/components/ValidatableFormInput";
import { ResendConfirmationButton } from "@/features/auth/components/headerAuth/ResendConfirmationButton";
import { useFormMessage } from "@/hooks/useFormMessage";
import { FormMessage } from "@/components/FormMessage";
import { useUserInfoValidation } from "@/hooks/useUserInfoValidation";

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
  const { emailState, nameState, passwordState, passwordConfirmState } =
    useUserInfoValidation({ allowBlanks: false });
  const message = useFormMessage();
  const [signup, { isLoading }] = useSignupMutation();

  const validateForm = () => {
    message.update("");
    const emailIsValid = emailState.validateCurrent();
    const nameIsValid = nameState.validateCurrent();
    const passwordIsValid = nameState.validateCurrent();
    const passwordConfirmIsValid = passwordConfirmState.validateCurrent();
    return (
      emailIsValid &&
      nameIsValid &&
      passwordIsValid &&
      passwordConfirmIsValid &&
      !isLoading
    );
  };

  const resetForm = () => {
    emailState.setValue("");
    nameState.setValue("");
    passwordState.setValue("");
    passwordConfirmState.setValue("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = {
        user: {
          email: emailState.value,
          name: nameState.value,
          password: passwordState.value,
          password_confirmation: passwordConfirmState.value,
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
      <FormMessage {...message.output} />
      <form id="Signup_form" className="Auth_form" onSubmit={handleSubmit}>
        <ValidatableFormInput
          name="email"
          inputType="email"
          cssBlock="Auth"
          {...emailState}
        />
        <ValidatableFormInput
          name="name"
          inputType="text"
          cssBlock="Auth"
          {...nameState}
        />
        <ValidatableFormInput
          name="password"
          inputType="password"
          cssBlock="Auth"
          {...passwordState}
        >
          <div className="Auth_fieldDescription">
            <div>Passwords must be at least 10 characters and contain</div>
            <div>1 capital, 1 lowercase, 1 number, and 1 symbol</div>
          </div>
        </ValidatableFormInput>
        <ValidatableFormInput
          name="passwordConfirm"
          label="Confirm password"
          inputType="password"
          cssBlock="Auth"
          {...passwordConfirmState}
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
