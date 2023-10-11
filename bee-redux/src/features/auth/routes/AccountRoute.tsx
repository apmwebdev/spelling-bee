import { FormMessage } from "@/components/FormMessage";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { useUserInfoValidation } from "@/hooks/useUserInfoValidation";
import { FormEvent } from "react";
import { ValidatableFormInput } from "@/components/ValidatableFormInput";
import { useAppSelector } from "@/app/hooks";
import {
  AuthUpdateData,
  selectUser,
  User,
  useUpdateAccountMutation,
} from "@/features/auth";
import {
  useUserInfoFormField,
  validateField,
} from "@/hooks/useUserInfoFormField";
import { Navigate } from "react-router-dom";
import { isBasicError } from "@/types";

export function AccountRoute() {
  const { emailState, nameState, passwordState, passwordConfirmState } =
    useUserInfoValidation({ allowBlanks: true });
  const user = useAppSelector(selectUser);
  const message = useStatusMessage({
    baseClass: "Auth_message",
  });
  const [updateAccount, { isLoading }] = useUpdateAccountMutation();

  const currentPasswordState = useUserInfoFormField({
    validator_needsMessageHook: validateField({
      validationFn: (value: string) => value.length > 0,
    })({
      errorMessage: "Please enter your current password",
    })({
      canBeBlank: passwordState.value === "",
    }),
    validationDependency: passwordState.value,
  });

  const resetForm = (updatedUser: User) => {
    emailState.setValue(updatedUser.email);
    nameState.setValue(updatedUser.name);
    currentPasswordState.setValue("");
    passwordState.setValue("");
    passwordConfirmState.setValue("");
  };

  const validateIfChanged = () => {
    const didChange =
      emailState.hasChanged || nameState.hasChanged || passwordState.hasChanged;
    if (!didChange) message.update("Nothing to update", "Warning");
    return didChange;
  };

  /** Returns true if *all* fields are valid and *any* fields have been changed.
   */
  const canSubmit = () => {
    message.update("");
    const emailIsValid = emailState.validateCurrent();
    const nameIsValid = nameState.validateCurrent();
    const passwordIsValid = nameState.validateCurrent();
    const passwordConfirmIsValid = passwordConfirmState.validateCurrent();
    const didChange = validateIfChanged();
    return (
      emailIsValid &&
      nameIsValid &&
      passwordIsValid &&
      passwordConfirmIsValid &&
      didChange &&
      !isLoading
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    if (canSubmit()) {
      const formData: AuthUpdateData = {
        user: {
          email: emailState.value,
          name: nameState.value,
          current_password: currentPasswordState.value,
          password: passwordState.value,
          password_confirmation: passwordConfirmState.value,
        },
      };
      try {
        const response = await updateAccount(formData).unwrap();
        message.update("Successfully updated", "Success");
        resetForm(response);
      } catch (err) {
        console.error("Failed to update: ", err);
        if (isBasicError(err)) {
          message.update(err.data.error, "Error");
        } else {
          message.update("Failed to update", "Error");
        }
      }
    }
  };

  if (!user) return <Navigate to="/auth/login" />;
  return (
    <div className="User_formContainer">
      <h2>Edit Account</h2>
      <h3>Note: Blank fields will not be updated</h3>
      <FormMessage {...message.output} />
      <div className="spacer"></div>
      <form className="User_form" onSubmit={handleSubmit}>
        <ValidatableFormInput
          name="email"
          inputType="email"
          cssBlock="User"
          {...emailState}
        />
        <ValidatableFormInput
          name="name"
          inputType="text"
          cssBlock="User"
          {...nameState}
        />
        <hr className="Hr" />
        <ValidatableFormInput
          name="currentPassword"
          inputType="password"
          label="Current password"
          cssBlock="User"
          {...currentPasswordState}
        >
          <div className="Auth_fieldDescription">
            <div>You only need to submit your current password</div>
            <div>if changing your password</div>
          </div>
        </ValidatableFormInput>
        <ValidatableFormInput
          name="password"
          inputType="password"
          label="New password"
          cssBlock="User"
          {...passwordState}
        >
          <div className="Auth_fieldDescription">
            <div>Passwords must be at least 10 characters and contain</div>
            <div>1 capital, 1 lowercase, 1 number, and 1 symbol</div>
          </div>
        </ValidatableFormInput>
        <ValidatableFormInput
          name="passwordConfirm"
          inputType="password"
          label="Confirm new password"
          cssBlock="User"
          {...passwordConfirmState}
        />
        <div className="User_actions">
          <button type="submit" className="standardButton Auth_submit">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
