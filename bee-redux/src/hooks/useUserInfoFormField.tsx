/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { AuthMessageHook } from "@/features/auth";

export type UserFieldValidator = (
  value: string,
  existingValue?: string,
) => boolean;

export type Validator_NeedsMessageHook = ({
  messageHook,
}: {
  messageHook: AuthMessageHook;
}) => UserFieldValidator;

export type Validator_NeedsCanBeBlank = ({
  canBeBlank,
}: {
  canBeBlank: boolean;
}) => Validator_NeedsMessageHook;

export type Validator_NeedsErrorMessage = ({
  errorMessage,
}: {
  errorMessage: string;
}) => Validator_NeedsCanBeBlank;

export type Validator_NeedsValidationFn = ({
  validationFn,
}: {
  validationFn: (value: string) => boolean;
}) => Validator_NeedsErrorMessage;

/** Creates a validator function. Currying is used so that the function can be
 * partially applied while maintaining state, with static pieces set initially
 * and dynamic pieces set when and where they become known.
 * The pipeline goes:
 * validationFn => errorMessage => canBeBlank => messageHook => value => boolean
 * @param validationFn
 */
export const validateField: Validator_NeedsValidationFn =
  ({ validationFn }: { validationFn: (value: string) => boolean }) =>
  ({ errorMessage }: { errorMessage: string }) =>
  ({ canBeBlank }: { canBeBlank: boolean }) =>
  ({ messageHook }: { messageHook: AuthMessageHook }) =>
  (value: string, existingValue?: string) => {
    if (existingValue && value === existingValue) {
      messageHook.update("Nothing to update", "Disabled");
      return true;
    }
    if (value === "" && canBeBlank) {
      messageHook.update("");
      return true;
    }
    if (validationFn(value)) {
      messageHook.update("");
      return true;
    }
    messageHook.update(errorMessage, "Error");
    return false;
  };

export type UserInfoFormFieldState = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  messageHook: AuthMessageHook;
  validate: UserFieldValidator;
  validateCurrent: () => boolean;
  hasChanged: boolean;
  existingValue: string | undefined;
};

export function useUserInfoFormField({
  validator_needsMessageHook,
  existingValue,
  passedInValue,
  passedInValueSetter,
  validationDependency,
}: {
  /** Partially applied validator function, to be passed the messageHook here */
  validator_needsMessageHook: Validator_NeedsMessageHook;
  /** If the input should initially display the current value of the field
   * instead of blank, pass it in here. */
  existingValue?: string;
  /** If the parent component needs access to the input value state, that can be
   * controlled there and passed in instead of being set here. */
  passedInValue?: string;
  /** If the parent component needs access to the input value state, that can be
   * controlled there and passed in instead of being set here. */
  passedInValueSetter?: Dispatch<SetStateAction<string>>;
  /** For validating the field when another field changes. */
  validationDependency?: string;
}): UserInfoFormFieldState {
  const [localValue, setLocalValue] = useState(existingValue ?? "");
  const messageHook = useStatusMessage({
    baseClass: "Auth_fieldMessage",
  });
  const value = passedInValue ?? localValue;
  const setValue = passedInValueSetter ?? setLocalValue;

  /** Note that this needs to be returned along with validateCurrent so that
   * field values can be validated directly on onChange events (using
   * event.target.value) without needing useEffect.
   */
  const validate = validator_needsMessageHook({ messageHook });

  const validateCurrent = () => validate(value);

  /** Used for determining if the form needs to be submitted at all */
  const hasChanged =
    value !== "" && (existingValue === undefined || value !== existingValue);

  useEffect(() => {
    if (validationDependency !== undefined) {
      validateCurrent();
    }
  }, [validationDependency]);

  return {
    value,
    setValue,
    messageHook,
    validate,
    validateCurrent,
    hasChanged,
    existingValue,
  };
}
