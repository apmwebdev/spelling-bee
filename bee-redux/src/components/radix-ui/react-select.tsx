import * as Select from "@radix-ui/react-select";
import uniqid from "uniqid";
import { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { composeClasses } from "@/utils/utils";

interface SelectContentProps extends Select.SelectContentProps {
  children: ReactNode;
  className?: string;
}

export const SelectContentWithPortal = ({
  children,
  className,
  ...otherProps
}: SelectContentProps) => (
  <Select.Portal>
    <Select.Content
      className={composeClasses("SelectContent", className ?? "")}
      {...otherProps}
    >
      {children}
    </Select.Content>
  </Select.Portal>
);

interface SelectItemProps extends Select.SelectItemProps {
  value: string;
  className?: string;
  itemText?: string;
  children?: ReactNode;
}

export const SelectItem = ({
  value,
  className,
  itemText,
  children,
  ...otherProps
}: SelectItemProps) => (
  <Select.Item
    key={uniqid()}
    value={value}
    className={composeClasses("SelectItem", className ?? "")}
    {...otherProps}
  >
    <Select.ItemIndicator asChild>
      <Icon className="SelectItemIndicator" icon="mdi:check" />
    </Select.ItemIndicator>
    {itemText ? <Select.ItemText>{itemText}</Select.ItemText> : null}
    {children}
  </Select.Item>
);

interface SelectTriggerProps extends Select.SelectTriggerProps {
  className?: string;
}

export const SelectTrigger = ({
  className,
  ...otherProps
}: SelectTriggerProps) => (
  <Select.Trigger
    className={composeClasses("SelectTrigger", className ?? "")}
    {...otherProps}
  >
    <Select.Value />
    <Select.Icon asChild>
      <Icon icon="mdi:chevron-down" />
    </Select.Icon>
  </Select.Trigger>
);

interface SelectLabelProps extends Select.SelectLabelProps {
  className?: string;
}

export const SelectLabel = ({
  className,
  children,
  ...otherProps
}: SelectLabelProps) => (
  <Select.Label
    className={composeClasses("SelectLabel", className ?? "")}
    {...otherProps}
  >
    {children}
  </Select.Label>
);
