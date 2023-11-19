/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { PanelInitDisplayCheckboxControl } from "@/features/hintPanels/components/settings/PanelInitDisplayCheckboxControl";
import {
  InitIsBlurredHelpText,
  InitIsExpandedHelpText,
  InitIsSettingsExpandedHelpText,
  InitIsSettingsStickyHelpText,
  InitIsStickyHelpText,
} from "@/features/hintPanels/components/settings/helpText";
import { useAppSelector } from "@/app/hooks";
import {
  selectPanelDisplayState,
  useUpdateHintPanelMutation,
} from "@/features/hintPanels";
import {
  PanelDisplayState,
  PanelDisplayStateKeys,
} from "@/features/hintPanels/types";

export function PanelInitialDisplayControls({
  panelId,
  initialDisplayState,
}: {
  panelId: number;
  initialDisplayState: PanelDisplayState;
}) {
  const display = useAppSelector(selectPanelDisplayState(panelId));
  const [updatePanel] = useUpdateHintPanelMutation();
  return (
    <div
      className="PanelInitialDisplayControlsContainer"
      style={{ gridColumn: "1/3" }}
    >
      <span>Initial Panel Display</span>
      <div className="PanelInitialDisplayControls">
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isSticky}
          currentValue={initialDisplayState.isSticky}
          label="Sticky"
          helpBubbleContent={InitIsStickyHelpText()}
          customHandler={() => {
            const newValue = !initialDisplayState.isSticky;
            const shouldUpdateIsExpanded =
              newValue && !initialDisplayState.isExpanded;
            const shouldUpdateIsBlurred =
              newValue && display.isBlurred !== initialDisplayState.isBlurred;
            updatePanel({
              id: panelId,
              debounceField: "initDisplayIsSticky",
              initialDisplayState: {
                isSticky: newValue,
                isExpanded: shouldUpdateIsExpanded ? true : undefined,
                isBlurred: shouldUpdateIsBlurred
                  ? display.isBlurred
                  : undefined,
              },
            });
          }}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isExpanded}
          currentValue={initialDisplayState.isExpanded}
          disabled={initialDisplayState.isSticky}
          label="Expanded"
          helpBubbleContent={InitIsExpandedHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isBlurred}
          currentValue={initialDisplayState.isBlurred}
          disabled={initialDisplayState.isSticky}
          label="Blurred"
          helpBubbleContent={InitIsBlurredHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isSettingsSticky}
          currentValue={initialDisplayState.isSettingsSticky}
          label="Settings Sticky"
          helpBubbleContent={InitIsSettingsStickyHelpText()}
          customHandler={() => {
            const newValue = !initialDisplayState.isSettingsSticky;
            const shouldUpdateIsSettingsExpanded =
              newValue && !initialDisplayState.isSettingsExpanded;
            updatePanel({
              id: panelId,
              debounceField: "initDisplayIsSettingsSticky",
              initialDisplayState: {
                isSettingsSticky: newValue,
                isSettingsExpanded: shouldUpdateIsSettingsExpanded
                  ? true
                  : undefined,
              },
            });
          }}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isSettingsExpanded}
          currentValue={initialDisplayState.isSettingsExpanded}
          disabled={initialDisplayState.isSettingsSticky}
          label="Settings Expanded"
          helpBubbleContent={InitIsSettingsExpandedHelpText()}
        />
      </div>
    </div>
  );
}
