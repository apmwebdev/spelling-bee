/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
