import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
} from "@radix-ui/react-dropdown-menu";
import { RefAttributes } from "react";
import { composeClasses } from "@/util";
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
  Trigger,
} from "@radix-ui/react-dropdown-menu";

export const ContentWithPortal = (
  props: IntrinsicAttributes &
    DropdownMenuContentProps &
    RefAttributes<HTMLDivElement>,
) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      {...props}
      className={composeClasses("UserMenuContent", props.className ?? "")}
      avoidCollisions={props.avoidCollisions ?? true}
      collisionPadding={props.collisionPadding ?? 24}
    >
      {props.children}
      <DropdownMenu.Arrow className="Arrow" width={10} height={5} />
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
    className={composeClasses("MenuItem", props.className ?? "")}
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
    className={composeClasses("Separator", props.className ?? "")}
  />
);
