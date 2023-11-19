/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Toggle from "@radix-ui/react-toggle";
import { ToggleProps } from "@radix-ui/react-toggle";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes & ToggleProps & RefAttributes<HTMLButtonElement>,
) => (
  <Toggle.Root {...props} className={classNames("ToggleRoot", props.className)}>
    {props.children}
  </Toggle.Root>
);
