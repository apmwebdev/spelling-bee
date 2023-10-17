import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { RefAttributes } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Checkbox = (
  props: IntrinsicAttributes & CheckboxProps & RefAttributes<HTMLButtonElement>,
) => (
  <RadixCheckbox.Root
    {...props}
    className={classNames("CheckboxRoot", props.className)}
  >
    <RadixCheckbox.Indicator className="CheckboxIndicator">
      <Icon icon="mdi:check-bold" />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
);
