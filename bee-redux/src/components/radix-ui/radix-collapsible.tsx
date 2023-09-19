import * as Collapsible from "@radix-ui/react-collapsible";
import { CollapsibleTriggerProps } from "@radix-ui/react-collapsible";
import { RefAttributes } from "react";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Root, Content } from "@radix-ui/react-collapsible";

export const Trigger = (
  props: IntrinsicAttributes &
    CollapsibleTriggerProps &
    RefAttributes<HTMLButtonElement> & { title: string },
) => (
  <Collapsible.Trigger asChild>
    <button {...props}>
      <HeaderDisclosureWidget title={props.title} />
    </button>
  </Collapsible.Trigger>
);
