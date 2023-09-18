import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { RefAttributes } from "react";
import { composeClasses } from "@/util";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes &
    ((ToggleGroupSingleProps | ToggleGroupMultipleProps) &
      RefAttributes<HTMLDivElement>),
) => (
  <ToggleGroup.Root
    {...props}
    className={composeClasses("ToggleGroup", props.className ?? "")}
  >
    {props.children}
  </ToggleGroup.Root>
);

export const Item = (
  props: IntrinsicAttributes &
    ToggleGroupItemProps &
    RefAttributes<HTMLButtonElement>,
) => <ToggleGroup.Item {...props}>{props.children}</ToggleGroup.Item>;
