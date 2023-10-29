import { FormEvent, useId } from "react";
import { SignupData, useSignupMutation } from "@/features/auth";
import { isBasicError } from "@/types";
import { ValidatableFormInput } from "@/components/ValidatableFormInput";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { useUserInfoValidation } from "@/hooks/useUserInfoValidation";
import { MoreActions } from "@/features/auth/components/MoreActions";
import { PasswordFields } from "@/features/auth/components/PasswordFields";
import { devLog } from "@/util";

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
  const message = useStatusMessage({
    baseClass: "Auth_message",
  });
  const [signup, { isLoading }] = useSignupMutation();
  const formId = useId();

  const validateForm = () => {
    message.update("");
    const emailIsValid = emailState.validateCurrent();
    const nameIsValid = nameState.validateCurrent();
    const passwordIsValid = passwordState.validateCurrent();
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
      const formData: SignupData = {
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
        message.update(response.success, "Success");
      } catch (err) {
        devLog("Failed to save user: ", err);
        if (isBasicError(err)) {
          message.update(err.data.error, "Error");
        } else {
          message.update("Error", "Error");
        }
      }
    }
  };

  return (
    <div className="Auth_container">
      <FormMessage {...message.output} />
      <form id={formId} className="Auth_form" onSubmit={handleSubmit}>
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
        <PasswordFields
          passwordState={passwordState}
          passwordConfirmState={passwordConfirmState}
        />
      </form>
      <div className="Auth_actions">
        <MoreActions />
        <button
          type="submit"
          form={formId}
          className="standardButton Auth_submit"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
