import { UserInfoFormFieldState } from "@/hooks/useUserInfoFormField";
import { ValidatableFormInput } from "@/components/ValidatableFormInput";

export function PasswordFields({
  passwordState,
  passwordConfirmState,
}: {
  passwordState: UserInfoFormFieldState;
  passwordConfirmState: UserInfoFormFieldState;
}) {
  return (
    <>
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
    </>
  );
}
