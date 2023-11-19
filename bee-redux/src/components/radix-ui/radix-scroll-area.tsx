/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ScrollAreaScrollbarProps } from "@radix-ui/react-scroll-area";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Root, Viewport } from "@radix-ui/react-scroll-area";

export const Scrollbar = (
  props: IntrinsicAttributes &
    ScrollAreaScrollbarProps &
    RefAttributes<HTMLDivElement>,
) => (
  <ScrollArea.Scrollbar
    {...props}
    className={classNames("ScrollAreaScrollbar", props.className)}
  >
    <ScrollArea.Thumb className="ScrollAreaThumb" />
  </ScrollArea.Scrollbar>
);
