import { Dispatch, SetStateAction, useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/types";
import { useUserInfoFormField } from "@/hooks/useUserInfoFormField";

/**
 * Step 5: Pass in the actual value to be validated. Returns a boolean
 * indicating whether value is valid or not and sets or removes the error
 * message, as needed.
 */
export type UserFieldValidator = (value: string) => boolean;

/**
 * Step 4: Bind the setMessage function (a SetStateAction). Set in
 * useUserInfoFormField hook since it is unique to individual fields. Since the
 * input fields have associated message fields for displaying validation errors,
 * setting this function allows validation error messages to be displayed on
 * individual fields.
 */
export type Validator_NeedsSetMessage = ({
  setMessage,
}: {
  setMessage: Dispatch<SetStateAction<string>>;
}) => UserFieldValidator;

/**
 * Step 3: Bind canBeBlank flag. Set here, but inside of hook, since canBeBlank
 * is not static. Fields can't be blank in signup form, but can be blank in
 * update form. This is determined by the allowBlanks argument that is passed
 * to the hook when it is called.
 */
export type Validator_NeedsCanBeBlank = ({
  canBeBlank,
}: {
  canBeBlank: boolean;
}) => Validator_NeedsSetMessage;

/**
 * Step 2: Bind errorMessage. Set here, outside of hook, since this info is
 * static.
 */
export type Validator_NeedsErrorMessage = ({
  errorMessage,
}: {
  errorMessage: string;
}) => Validator_NeedsCanBeBlank;

/**
 * Step 1: Bind validation function. Set here, outside of hook, since this info
 * is static (although unique to each type of field).
 */
export type Validator_NeedsValidationFn = ({
  validationFn,
}: {
  validationFn: (value: string) => boolean;
}) => Validator_NeedsErrorMessage;

/**
 * Creates a validator function. Currying is used so that the function can be
 * partially applied while maintaining state, with static pieces set initially
 * and dynamic pieces set when and where they become known.
 * The pipeline goes:
 * validationFn => errorMessage => canBeBlank => setMessageFn => value => boolean
 * @param validationFn
 */
export const validateField: Validator_NeedsValidationFn =
  ({ validationFn }: { validationFn: (value: string) => boolean }) =>
  ({ errorMessage }: { errorMessage: string }) =>
  ({ canBeBlank }: { canBeBlank: boolean }) =>
  ({ setMessage }: { setMessage: Dispatch<SetStateAction<string>> }) =>
  (value: string) => {
    if (value === "" && canBeBlank) {
      setMessage("");
      return true;
    }
    if (validationFn(value)) {
      setMessage("");
      return true;
    }
    setMessage(errorMessage);
    return false;
  };

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
  // Needs to be set here so that it can be compared to confirmPassword
  const [passwordValue, setPasswordValue] = useState("");

  const passwordConfirmValidationFn = passwordsMatch(passwordValue);
  const validatePasswordConfirm = validateField({
    validationFn: passwordConfirmValidationFn,
    // validationFn: () => true,
  })({ errorMessage: "Please ensure that passwords match" });

  const emailState = useUserInfoFormField({
    validator_needsSetMessage: validateEmail({ canBeBlank: allowBlanks }),
  });
  const nameState = useUserInfoFormField({
    validator_needsSetMessage: validateName({ canBeBlank: allowBlanks }),
  });
  const passwordState = useUserInfoFormField({
    validator_needsSetMessage: validatePassword({ canBeBlank: allowBlanks }),
    passedInValue: passwordValue,
    passedInValueSetter: setPasswordValue,
  });
  const passwordConfirmState = useUserInfoFormField({
    validator_needsSetMessage: validatePasswordConfirm({
      canBeBlank: allowBlanks && passwordState.value === "",
    }),
    validationDependency: passwordState.value,
  });

  return { emailState, nameState, passwordState, passwordConfirmState };
}
