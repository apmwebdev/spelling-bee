import * as Toggle from "@radix-ui/react-toggle";
import { ToggleProps } from "@radix-ui/react-toggle";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes & ToggleProps & RefAttributes<HTMLButtonElement>,
) => (
  <Toggle.Root {...props} className={classNames("ToggleRoot", props.className)}>
    {props.children}
  </Toggle.Root>
);
