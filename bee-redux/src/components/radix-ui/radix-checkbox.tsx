/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { RefAttributes } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Checkbox = (
  props: IntrinsicAttributes & CheckboxProps & RefAttributes<HTMLButtonElement>,
) => (
  <RadixCheckbox.Root
    {...props}
    className={classNames("CheckboxRoot", props.className)}
  >
    <RadixCheckbox.Indicator className="CheckboxIndicator">
      <Icon icon="mdi:check-bold" />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
);
