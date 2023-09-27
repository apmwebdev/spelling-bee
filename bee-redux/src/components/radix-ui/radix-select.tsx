import * as Select from "@radix-ui/react-select";
import {
  SelectContentProps,
  SelectLabelProps,
  SelectTriggerProps,
} from "@radix-ui/react-select";
import { RefAttributes } from "react";
import { Icon } from "@iconify/react";
import { composeClasses } from "@/util";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Group, Root, Viewport } from "@radix-ui/react-select";
export const Trigger = (
  props: IntrinsicAttributes &
    SelectTriggerProps &
    RefAttributes<HTMLButtonElement>,
) => (
  <Select.Trigger
    {...props}
    className={composeClasses("SelectTrigger", props.className ?? "")}
  >
    <Select.Value />
    <Select.Icon asChild>
      <div className="SelectIcon">
        <Icon icon="mdi:chevron-down" />
      </div>
    </Select.Icon>
  </Select.Trigger>
);

export const ContentWithPortal = (
  props: IntrinsicAttributes &
    SelectContentProps &
    RefAttributes<HTMLDivElement>,
) => (
  <Select.Portal>
    <Select.Content
      {...props}
      className={composeClasses("SelectContent", props.className ?? "")}
    >
      <Select.ScrollUpButton>
        <div className="SelectScrollButton up">
          <Icon icon="mdi:chevron-up" />
        </div>
      </Select.ScrollUpButton>
      {props.children}
      <Select.ScrollUpButton className="SelectScrollButton down">
        <Icon icon="mdi:chevron-down" />
      </Select.ScrollUpButton>
    </Select.Content>
  </Select.Portal>
);

type SelectItemPropsExtended = Select.SelectItemProps & {
  itemText?: string;
};

export const Item = ({
  itemText,
  ...props
}: IntrinsicAttributes &
  SelectItemPropsExtended &
  RefAttributes<HTMLDivElement>) => (
  <Select.Item
    {...props}
    className={composeClasses("SelectItem", props.className ?? "")}
  >
    <Select.ItemIndicator asChild>
      <Icon className="SelectItemIndicator" icon="mdi:check" />
    </Select.ItemIndicator>
    {itemText ? (
      <Select.ItemText className="SelectItemText">{itemText}</Select.ItemText>
    ) : null}
    {props.children}
  </Select.Item>
);

export const Label = (
  props: IntrinsicAttributes & SelectLabelProps & RefAttributes<HTMLDivElement>,
) => (
  <Select.Label
    {...props}
    className={composeClasses("SelectLabel", props.className ?? "")}
  >
    {props.children}
  </Select.Label>
);
