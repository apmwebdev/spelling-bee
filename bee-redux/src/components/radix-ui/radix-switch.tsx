import * as RadixSwitch from "@radix-ui/react-switch";
import { SwitchProps } from "@radix-ui/react-switch";
import { RefAttributes } from "react";
import { composeClasses } from "@/util";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Switch = (
  props: IntrinsicAttributes & SwitchProps & RefAttributes<HTMLButtonElement>,
) => {
  return (
    <RadixSwitch.Root
      {...props}
      className={composeClasses("SwitchRoot", props.className ?? "")}
    >
      <RadixSwitch.Thumb className="SwitchThumb" />
    </RadixSwitch.Root>
  );
};
