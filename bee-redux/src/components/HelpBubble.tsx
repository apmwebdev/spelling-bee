import * as Popover from "@/components/radix-ui/radix-popover";
import { ReactNode } from "react";

export function HelpBubble({ children }: { children: ReactNode }) {
  return (
    <Popover.Root>
      <Popover.Trigger className="HelpBubbleTrigger">?</Popover.Trigger>
      <Popover.ContentWithPortal className="HelpBubbleContent">
        {children}
      </Popover.ContentWithPortal>
    </Popover.Root>
  );
}
