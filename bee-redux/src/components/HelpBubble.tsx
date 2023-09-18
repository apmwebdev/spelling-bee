import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";

export function HelpBubble({ children }: { children: ReactNode }) {
  return (
    <Popover.Root>
      <Popover.Trigger className="HelpBubbleTrigger">?</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="HelpBubbleContent PopoverContent"
          side="top"
          avoidCollisions={true}
          collisionPadding={16}
        >
          {children}
          <Popover.Arrow className="PopoverArrow" width={12} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
