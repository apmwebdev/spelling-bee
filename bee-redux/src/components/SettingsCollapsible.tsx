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
