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
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes &
    ((ToggleGroupSingleProps | ToggleGroupMultipleProps) &
      RefAttributes<HTMLDivElement>),
) => {
  const { className, children, ...otherProps } = props;
  return (
    <ToggleGroup.Root
      {...otherProps}
      className={classNames("ToggleGroupRoot", className)}
    >
      {children}
    </ToggleGroup.Root>
  );
};

export const Item = (
  props: IntrinsicAttributes &
    ToggleGroupItemProps &
    RefAttributes<HTMLButtonElement>,
) => {
  const { className, children, ...otherProps } = props;

  return (
    <ToggleGroup.Item
      {...otherProps}
      className={classNames("ToggleGroupItem", className)}
    >
      {children}
    </ToggleGroup.Item>
  );
};
