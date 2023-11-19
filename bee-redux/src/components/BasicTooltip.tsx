/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type TooltipProps = {
  tooltipContent: ReactNode;
  children: ReactNode;
  disabled?: boolean;
};

export function BasicTooltip({
  tooltipContent,
  children,
  disabled,
}: TooltipProps) {
  if (disabled) {
    return children;
  }
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="TooltipContent"
          sideOffset={4}
          collisionPadding={8}
        >
          {tooltipContent}
          <Tooltip.Arrow height={7} className="TooltipArrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
