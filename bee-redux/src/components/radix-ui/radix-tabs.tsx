/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Tabs from "@radix-ui/react-tabs";
import {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from "@radix-ui/react-tabs";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export const Root = (
  props: IntrinsicAttributes & TabsProps & RefAttributes<HTMLDivElement>,
) => (
  <Tabs.Root {...props} className={classNames("TabsRoot", props.className)}>
    {props.children}
  </Tabs.Root>
);

export const List = (
  props: IntrinsicAttributes & TabsListProps & RefAttributes<HTMLDivElement>,
) => (
  <Tabs.List {...props} className={classNames("TabsList", props.className)}>
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
    className={classNames("TabsTrigger", props.className)}
  >
    {props.children}
  </Tabs.Trigger>
);

export const Content = (
  props: IntrinsicAttributes & TabsContentProps & RefAttributes<HTMLDivElement>,
) => (
  <Tabs.Content
    {...props}
    className={classNames("TabsContent", props.className)}
  >
    {props.children}
  </Tabs.Content>
);
