/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Dispatch, ReactNode, SetStateAction, useId } from "react";
import classNames from "classnames/dedupe";
import { capitalize } from "lodash";
import { AuthMessageHook } from "@/features/auth";
import { UserFieldValidator } from "@/hooks/useUserInfoFormField";

export function ValidatableFormInput({
  name,
  inputType,
  cssBlock,
  value,
  setValue,
  validate,
  messageHook,
  existingValue,
  label,
  children,
}: {
  /** Field name for the form */
  name: string;
  /** What type of text input field to render */
  inputType: "text" | "email" | "password";
  /** For determining what CSS classes to apply */
  cssBlock: "User" | "Auth";
  /** Value is controlled in a hook, so it and its setter are passed in */
  value: string;
  /** Value is controlled in a hook, so the setter is passed in */
  setValue: Dispatch<SetStateAction<string>>;
  /** Function used to validate the field's value. May fail if empty and can
   * depend on other form values */
  validate: UserFieldValidator;
  /** The message state for the field based on validation */
  messageHook: AuthMessageHook;
  /** Current value for the field. Used for validation */
  existingValue?: string;
  /** The field's label text, if different from name */
  label?: string;
  /** Used for a field description, if needed */
  children?: ReactNode;
}) {
  const inputId = useId();
  const inputClassnames = classNames({
    Auth_textInput: true,
    TextInput___invalid: messageHook.output.status === "Error",
  });
  const handleChange = (localValue: string) => {
    setValue(localValue);
    validate(localValue, existingValue);
  };
  const handleBlur = () => {
    validate(value, existingValue);
  };

  return (
    <fieldset className={`${cssBlock}_fieldset`}>
      <label className={`${cssBlock}_fieldLabel`} htmlFor={inputId}>
        {label ?? capitalize(name)}:
      </label>
      <input
        type={inputType}
        className={inputClassnames}
        id={inputId}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
      />
      <label htmlFor={inputId} className={messageHook.output.classes}>
        {messageHook.output.value}
      </label>
      {children}
    </fieldset>
  );
}
