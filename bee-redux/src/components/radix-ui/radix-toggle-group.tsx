/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Item } from "@radix-ui/react-toggle-group";

export const Root = (
  props: IntrinsicAttributes &
    ((ToggleGroupSingleProps | ToggleGroupMultipleProps) &
      RefAttributes<HTMLDivElement>),
) => (
  <ToggleGroup.Root
    {...props}
    className={classNames("ToggleGroup", props.className)}
  >
    {props.children}
  </ToggleGroup.Root>
);
