import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  UserFieldValidator,
  Validator_NeedsSetMessage,
} from "@/hooks/useUserInfoValidation";

export type UserInfoFormFieldState = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  message: string;
  validate: UserFieldValidator;
  validateCurrent: () => boolean;
};

export function useUserInfoFormField({
  validator_needsSetMessage,
  passedInValue,
  passedInValueSetter,
  validationDependency,
}: {
  validator_needsSetMessage: Validator_NeedsSetMessage;
  passedInValue?: string;
  passedInValueSetter?: Dispatch<SetStateAction<string>>;
  validationDependency?: string;
}): UserInfoFormFieldState {
  const [localValue, setLocalValue] = useState("");
  const [message, setMessage] = useState("");
  const renders = useRef(0);

  const value = passedInValue ?? localValue;
  const setValue = passedInValueSetter ?? setLocalValue;

  /**
   * Note that this needs to be returned along with validateCurrent so that
   * field values can be validated directly on onChange events (using
   * event.target.value) without needing useEffect.
   */
  const validate = validator_needsSetMessage({ setMessage });

  /**
   * Validates the current value of the field. This is useful for validation on
   * form submission, but NOT on the field's onChange event. For that, the
   * event.target.value needs to be validated directly. Otherwise, the validator
   * will read the old value, as the state is not updated quickly enough for it
   * to read the newly changed value without using useEffect.
   */
  const validateCurrent = () => validate(value);

  useEffect(() => {
    if (validationDependency !== undefined) {
      validateCurrent();
    }
  }, [validationDependency]);

  return { value, setValue, message, validate, validateCurrent };
}
