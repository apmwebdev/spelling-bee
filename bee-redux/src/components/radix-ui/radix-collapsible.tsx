/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Collapsible from "@radix-ui/react-collapsible";
import {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "@radix-ui/react-collapsible";
import { forwardRef, Ref, RefAttributes } from "react";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = forwardRef(
  (
    props: IntrinsicAttributes &
      CollapsibleProps &
      RefAttributes<HTMLDivElement>,
    ref: Ref<HTMLDivElement>,
  ) => (
    <Collapsible.Root
      {...props}
      className={classNames("CollapsibleRoot", props.className)}
      ref={ref}
    >
      {props.children}
    </Collapsible.Root>
  ),
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
