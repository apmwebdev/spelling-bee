/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as RadixSwitch from "@radix-ui/react-switch";
import { SwitchProps } from "@radix-ui/react-switch";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Switch = (
  props: IntrinsicAttributes & SwitchProps & RefAttributes<HTMLButtonElement>,
) => {
  return (
    <RadixSwitch.Root
      {...props}
      className={classNames("SwitchRoot", props.className)}
    >
      <RadixSwitch.Thumb className="SwitchThumb" />
    </RadixSwitch.Root>
  );
};
