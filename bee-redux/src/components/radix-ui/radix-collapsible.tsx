import * as Collapsible from "@radix-ui/react-collapsible";
import {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "@radix-ui/react-collapsible";
import { RefAttributes } from "react";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { composeClasses } from "@/util";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes & CollapsibleProps & RefAttributes<HTMLDivElement>,
) => (
  <Collapsible.Root
    {...props}
    className={composeClasses("CollapsibleRoot", props.className)}
  >
    {props.children}
  </Collapsible.Root>
);

export const Trigger = (
  props: IntrinsicAttributes &
    CollapsibleTriggerProps &
    RefAttributes<HTMLButtonElement> & { title: string },
) => {
  const { title, className, ...rest } = props;
  return (
    <Collapsible.Trigger asChild>
      <button {...rest} className={classNames("CollapsibleTrigger", className)}>
        <HeaderDisclosureWidget title={title} />
      </button>
    </Collapsible.Trigger>
  );
};

export const Content = (
  props: IntrinsicAttributes &
    CollapsibleContentProps &
    RefAttributes<HTMLDivElement>,
) => {
  return (
    <Collapsible.Content
      {...props}
      className={classNames("CollapsibleContent", props.className)}
    >
      {props.children}
    </Collapsible.Content>
  );
};
