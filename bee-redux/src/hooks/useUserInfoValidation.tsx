import { EMAIL_REGEX } from "@/types";
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
