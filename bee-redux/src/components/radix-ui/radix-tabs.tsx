import * as Tabs from "@radix-ui/react-tabs";
import {
  TabsContentProps,
  TabsListProps,
  TabsTriggerProps,
} from "@radix-ui/react-tabs";
import { RefAttributes } from "react";
import { composeClasses } from "@/util";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Root } from "@radix-ui/react-tabs";

export const List = (
  props: IntrinsicAttributes & TabsListProps & RefAttributes<HTMLDivElement>,
) => (
  <Tabs.List
    {...props}
    className={composeClasses("TabsList", props.className ?? "")}
  >
    {props.children}
  </Tabs.List>
);

export const Trigger = (
  props: IntrinsicAttributes &
    TabsTriggerProps &
    RefAttributes<HTMLButtonElement>,
) => (
  <Tabs.Trigger
    {...props}
    className={composeClasses("TabsTrigger", props.className ?? "")}
  >
    {props.children}
  </Tabs.Trigger>
);

export const Content = (
  props: IntrinsicAttributes & TabsContentProps & RefAttributes<HTMLDivElement>,
) => (
  <Tabs.Content
    {...props}
    className={composeClasses("TabsContent", props.className ?? "")}
  >
    {props.children}
  </Tabs.Content>
);
