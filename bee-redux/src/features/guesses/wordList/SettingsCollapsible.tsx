import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "../../hints/components/generalControls/SettingsHeader";
import { HeaderDisclosureWidget } from "@/utils/HeaderDisclosureWidget";
import React from "react";

export function SettingsCollapsible({
  isCollapsed,
  toggleIsCollapsed,
  children,
}: {
  isCollapsed: boolean;
  toggleIsCollapsed: Function;
  children: React.ReactNode;
}) {
  return (
    <Collapsible.Root className="collapsible-settings" open={!isCollapsed}>
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="collapsible-settings-header-button"
            onClick={() => toggleIsCollapsed()}
          >
            <HeaderDisclosureWidget title="Settings" />
          </button>
        </Collapsible.Trigger>
      </SettingsHeader>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
