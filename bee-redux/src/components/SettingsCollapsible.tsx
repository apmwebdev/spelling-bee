/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Collapsible from "@/components/radix-ui/radix-collapsible";
import { SettingsHeader } from "./SettingsHeader";
import React from "react";

export function SettingsCollapsible({
  isExpanded,
  toggleIsExpanded,
  children,
}: {
  isExpanded: boolean;
  toggleIsExpanded: Function;
  children: React.ReactNode;
}) {
  return (
    <Collapsible.Root className="SettingsCollapsible" open={isExpanded}>
      <SettingsHeader>
        <Collapsible.Trigger
          className="SettingsCollapsibleHeaderButton"
          onClick={() => toggleIsExpanded()}
          title="Settings"
        />
      </SettingsHeader>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
