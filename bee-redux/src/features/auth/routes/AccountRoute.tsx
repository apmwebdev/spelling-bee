import { FormMessage } from "@/components/FormMessage";
import { useFormMessage } from "@/hooks/useFormMessage";
import {
  useUserInfoValidation,
  validateField,
} from "@/hooks/useUserInfoValidation";
import { FormEvent } from "react";
import { ValidatableFormInput } from "@/components/ValidatableFormInput";
import { useAppSelector } from "@/app/hooks";
import {
  AuthUpdateData,
  selectUser,
  useUpdateAccountMutation,
} from "@/features/auth";
import { useUserInfoFormField } from "@/hooks/useUserInfoFormField";
import { Navigate } from "react-router-dom";
import { isBasicError } from "@/types";

export function AccountRoute() {
  const { emailState, nameState, passwordState, passwordConfirmState } =
    useUserInfoValidation({ allowBlanks: true });
  const user = useAppSelector(selectUser);
  const message = useFormMessage();
  const [updateAccount, { isLoading }] = useUpdateAccountMutation();

  const currentPasswordState = useUserInfoFormField({
    validator_needsSetMessage: validateField({
      validationFn: (value: string) => value.length > 0,
    })({
      errorMessage: "Please enter your current password",
    })({
      canBeBlank: passwordState.value === "",
    }),
    validationDependency: passwordState.value,
  });

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
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
        console.log("Response:", response);
        message.update("Successfully updated", "success");
      } catch (err) {
        console.error("Failed to save user: ", err);
        if (isBasicError(err)) {
          message.update(err.data.error, "error");
        } else {
          message.update("Error", "error");
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
