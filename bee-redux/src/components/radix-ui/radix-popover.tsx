/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Popover from "@radix-ui/react-popover";
import {
  PopoverCloseProps,
  PopoverContentProps,
} from "@radix-ui/react-popover";
import { RefAttributes } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Root, Trigger, Anchor } from "@radix-ui/react-popover";

export const ContentWithPortal = (
  props: IntrinsicAttributes &
    PopoverContentProps &
    RefAttributes<HTMLDivElement>,
) => (
  <Popover.Portal>
    <Popover.Content
      {...props}
      className={classNames("PopoverContent", props.className)}
      side={props.side ?? "top"}
      avoidCollisions={props.avoidCollisions ?? true}
      collisionPadding={props.collisionPadding ?? 16}
    >
      {props.children}
      <Popover.Arrow className="PopoverArrow" width={12} height={8} />
    </Popover.Content>
  </Popover.Portal>
);

export const Close = (
  props: IntrinsicAttributes &
    PopoverCloseProps &
    RefAttributes<HTMLButtonElement>,
) => (
  <Popover.Close {...props} asChild>
    <button type="button" className="PopoverCloseButton">
      <Icon icon="mdi:close-thick" />
    </button>
  </Popover.Close>
);
