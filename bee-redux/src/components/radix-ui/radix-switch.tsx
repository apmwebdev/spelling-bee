import * as RadixSwitch from "@radix-ui/react-switch";
import { SwitchProps } from "@radix-ui/react-switch";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Switch = (
  props: IntrinsicAttributes & SwitchProps & RefAttributes<HTMLButtonElement>,
) => {
  return (
    <RadixSwitch.Root
      {...props}
      className={classNames("SwitchRoot", props.className)}
    >
      <RadixSwitch.Thumb className="SwitchThumb" />
    </RadixSwitch.Root>
  );
};
