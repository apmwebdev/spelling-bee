/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from "@radix-ui/react-dropdown-menu";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import { InlineIcon } from "@iconify/react";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export {
  CheckboxItem,
  Group,
  ItemIndicator,
  Label,
  RadioGroup,
  RadioItem,
  Root,
  Sub,
  SubContent,
  SubTrigger,
} from "@radix-ui/react-dropdown-menu";

export const ContentWithPortal = (
  props: IntrinsicAttributes &
    DropdownMenuContentProps &
    RefAttributes<HTMLDivElement>,
) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      {...props}
      className={classNames("DropdownMenuContent", props.className)}
      avoidCollisions={props.avoidCollisions ?? true}
      collisionPadding={props.collisionPadding ?? 24}
    >
      {props.children}
      <DropdownMenu.Arrow className="DropdownMenuArrow" width={10} height={5} />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
);

export const Item = (
  props: IntrinsicAttributes &
    DropdownMenuItemProps &
    RefAttributes<HTMLDivElement>,
) => (
  <DropdownMenu.Item
    {...props}
    className={classNames("DropdownMenuItem", props.className)}
  >
    {props.children}
  </DropdownMenu.Item>
);

export const Separator = (
  props: IntrinsicAttributes &
    DropdownMenuSeparatorProps &
    RefAttributes<HTMLDivElement>,
) => (
  <DropdownMenu.Separator
    {...props}
    className={classNames("DropdownMenuSeparator", props.className)}
  />
);

export const Trigger = (
  props: IntrinsicAttributes &
    DropdownMenuTriggerProps &
    RefAttributes<HTMLButtonElement> & { showIcon?: boolean },
) => {
  const { showIcon, children, ...rest } = props;
  const validatedShowIcon = showIcon ?? true;
  return (
    <DropdownMenu.Trigger
      {...rest}
      className={classNames("DropdownMenuTrigger", props.className, {
        DropdownMenuTrigger___withChevron: showIcon,
      })}
    >
      {validatedShowIcon ? <InlineIcon icon="mdi:chevron-down" /> : null}
      {children}
    </DropdownMenu.Trigger>
  );
};
