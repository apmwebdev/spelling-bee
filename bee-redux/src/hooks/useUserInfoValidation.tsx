/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { EMAIL_REGEX } from "@/types/globalTypes";
import {
  useUserInfoFormField,
  validateField,
} from "@/hooks/useUserInfoFormField";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth";
import { usePasswordValidation } from "@/features/auth/hooks/usePasswordValidation";

const validateEmail = validateField({
  validationFn: (value: string) => EMAIL_REGEX.test(value),
  // validationFn: (value: string) => true,
})({ errorMessage: "Please enter a valid email address" });

const validateName = validateField({
  validationFn: (value: string) => value.length > 0,
  // validationFn: (value: string) => true,
})({ errorMessage: "Please enter a name" });

export function useUserInfoValidation({
  allowBlanks,
}: {
  allowBlanks: boolean;
}) {
  const user = useAppSelector(selectUser);
  const { passwordState, passwordConfirmState } = usePasswordValidation({
    allowBlanks,
  });
  const emailState = useUserInfoFormField({
    validator_needsMessageHook: validateEmail({ canBeBlank: allowBlanks }),
    existingValue: user?.email,
  });
  const nameState = useUserInfoFormField({
    validator_needsMessageHook: validateName({ canBeBlank: allowBlanks }),
    existingValue: user?.name,
  });

  return { emailState, nameState, passwordState, passwordConfirmState };
}
