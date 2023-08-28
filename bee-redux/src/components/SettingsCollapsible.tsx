import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "./SettingsHeader";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
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
        <Collapsible.Trigger asChild>
          <button
            className="SettingsCollapsibleHeaderButton"
            onClick={() => toggleIsExpanded()}
          >
            <HeaderDisclosureWidget title="Settings" />
          </button>
        </Collapsible.Trigger>
      </SettingsHeader>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
