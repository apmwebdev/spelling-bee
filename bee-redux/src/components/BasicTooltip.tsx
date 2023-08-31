import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export interface TooltipProps {
  tooltipContent: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

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
