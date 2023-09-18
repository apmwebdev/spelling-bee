import * as Toggle from "@radix-ui/react-toggle";
import { ToggleProps } from "@radix-ui/react-toggle";
import { RefAttributes } from "react";
import { composeClasses } from "@/util";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes & ToggleProps & RefAttributes<HTMLButtonElement>,
) => (
  <Toggle.Root
    {...props}
    className={composeClasses("ToggleRoot", props.className ?? "")}
  >
    {props.children}
  </Toggle.Root>
);
