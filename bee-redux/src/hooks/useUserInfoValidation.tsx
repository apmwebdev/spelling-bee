import { useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/types";
import {
  useUserInfoFormField,
  validateField,
} from "@/hooks/useUserInfoFormField";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth";

const validateEmail = validateField({
  validationFn: (value: string) => EMAIL_REGEX.test(value),
  // validationFn: (value: string) => true,
})({ errorMessage: "Please enter a valid email address" });

const validateName = validateField({
  validationFn: (value: string) => value.length > 0,
  // validationFn: (value: string) => true,
})({ errorMessage: "Please enter a name" });

export const validatePassword = validateField({
  validationFn: (value: string) => PASSWORD_REGEX.test(value),
  // validationFn: () => true
})({ errorMessage: "Please enter a valid password" });

const passwordsMatch = (comparisonValue: string) => (value: string) =>
  value === comparisonValue;

export function useUserInfoValidation({
  allowBlanks,
}: {
  allowBlanks: boolean;
}) {
  const user = useAppSelector(selectUser);
  // Needs to be set here so that it can be compared to confirmPassword
  const [passwordValue, setPasswordValue] = useState("");

  const passwordConfirmValidationFn = passwordsMatch(passwordValue);
  const validatePasswordConfirm = validateField({
    validationFn: passwordConfirmValidationFn,
    // validationFn: () => true,
  })({ errorMessage: "Please ensure that passwords match" });

  const emailState = useUserInfoFormField({
    validator_needsMessageHook: validateEmail({ canBeBlank: allowBlanks }),
    existingValue: user?.email,
  });
  const nameState = useUserInfoFormField({
    validator_needsMessageHook: validateName({ canBeBlank: allowBlanks }),
    existingValue: user?.name,
  });
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

  return { emailState, nameState, passwordState, passwordConfirmState };
}
