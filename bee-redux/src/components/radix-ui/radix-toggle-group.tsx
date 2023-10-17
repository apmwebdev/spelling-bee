import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Item } from "@radix-ui/react-toggle-group";

export const Root = (
  props: IntrinsicAttributes &
    ((ToggleGroupSingleProps | ToggleGroupMultipleProps) &
      RefAttributes<HTMLDivElement>),
) => (
  <ToggleGroup.Root
    {...props}
    className={classNames("ToggleGroup", props.className)}
  >
    {props.children}
  </ToggleGroup.Root>
);
