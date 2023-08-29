import * as Select from "@radix-ui/react-select";
import { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { composeClasses } from "@/utils";

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
      <div className="SelectIcon">
        <Icon icon="mdi:chevron-down" />
      </div>
    </Select.Icon>
  </Select.Trigger>
);

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
      <Select.ScrollUpButton>
        <div className="SelectScrollButton up">
          <Icon icon="mdi:chevron-up" />
        </div>
      </Select.ScrollUpButton>
      {children}
      <Select.ScrollUpButton className="SelectScrollButton down">
        <Icon icon="mdi:chevron-down" />
      </Select.ScrollUpButton>
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
    value={value}
    className={composeClasses("SelectItem", className ?? "")}
    {...otherProps}
  >
    <Select.ItemIndicator asChild>
      <Icon className="SelectItemIndicator" icon="mdi:check" />
    </Select.ItemIndicator>
    {itemText ? (
      <Select.ItemText className="SelectItemText">{itemText}</Select.ItemText>
    ) : null}
    {children}
  </Select.Item>
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
