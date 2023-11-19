/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  useUserInfoFormField,
  validateField,
} from "@/hooks/useUserInfoFormField";
import { PASSWORD_REGEX } from "@/types";
import { useState } from "react";

export const validatePassword = validateField({
  validationFn: (value: string) => PASSWORD_REGEX.test(value),
  // validationFn: () => true
})({ errorMessage: "Please enter a valid password" });

const passwordsMatch = (comparisonValue: string) => (value: string) =>
  value === comparisonValue;

export function usePasswordValidation({
  allowBlanks,
}: {
  allowBlanks: boolean;
}) {
  // Needs to be set here so that it can be compared to confirmPassword
  const [passwordValue, setPasswordValue] = useState("");

  const passwordConfirmValidationFn = passwordsMatch(passwordValue);
  const validatePasswordConfirm = validateField({
    validationFn: passwordConfirmValidationFn,
    // validationFn: () => true,
  })({ errorMessage: "Please ensure that passwords match" });

  const passwordState = useUserInfoFormField({
    validator_needsMessageHook: validatePassword({ canBeBlank: allowBlanks }),
    passedInValue: passwordValue,
    passedInValueSetter: setPasswordValue,
  });
  const passwordConfirmState = useUserInfoFormField({
    validator_needsMessageHook: validatePasswordConfirm({
      canBeBlank: allowBlanks && passwordState.value === "",
    }),
    validationDependency: passwordState.value,
  });

  return { passwordState, passwordConfirmState };
}
