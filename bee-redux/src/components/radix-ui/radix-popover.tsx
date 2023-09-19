import * as Popover from "@radix-ui/react-popover";
import {
  PopoverCloseProps,
  PopoverContentProps,
} from "@radix-ui/react-popover";
import { RefAttributes } from "react";
import { composeClasses } from "@/util";
import { Icon } from "@iconify/react";
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
      className={composeClasses("PopoverContent", props.className ?? "")}
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
