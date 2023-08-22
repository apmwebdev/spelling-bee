import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function BasicTooltip({ text, children }: TooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="TooltipContent"
          sideOffset={4}
          collisionPadding={8}
        >
          {text}
          <Tooltip.Arrow height={7} className="TooltipArrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
