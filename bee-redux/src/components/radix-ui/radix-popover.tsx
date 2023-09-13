import * as Popover from "@radix-ui/react-popover";
import {
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverContentProps,
} from "@radix-ui/react-popover";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { RefAttributes } from "react";
import { composeClasses } from "@/utils";
import { Icon } from "@iconify/react";

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
      avoidCollisions={true}
      collisionPadding={16}
    >
      {props.children}
    </Popover.Content>
  </Popover.Portal>
);

export const Arrow = (
  props: IntrinsicAttributes & PopoverArrowProps & RefAttributes<SVGSVGElement>,
) => (
  <Popover.Arrow
    {...props}
    className={composeClasses("PopoverArrow", props.className ?? "")}
  >
    {props.children}
  </Popover.Arrow>
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
