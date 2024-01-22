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
} from "@/features/hintPanels/types/hintPanelTypes";

import { Uuid } from "@/features/api";

export function PanelInitialDisplayControls({
  panelUuid,
  initialDisplayState,
}: {
  panelUuid: Uuid;
  initialDisplayState: PanelDisplayState;
}) {
  const display = useAppSelector(selectPanelDisplayState(panelUuid));
  const [updatePanel] = useUpdateHintPanelMutation();
  return (
    <div className="PanelInitialDisplayControlsContainer">
      <span>Initial Panel Display</span>
      <div className="PanelInitialDisplayControls">
        <PanelInitDisplayCheckboxControl
          panelUuid={panelUuid}
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
              uuid: panelUuid,
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
          panelUuid={panelUuid}
          settingKey={PanelDisplayStateKeys.isExpanded}
          currentValue={initialDisplayState.isExpanded}
          disabled={initialDisplayState.isSticky}
          label="Expanded"
          helpBubbleContent={InitIsExpandedHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panelUuid={panelUuid}
          settingKey={PanelDisplayStateKeys.isBlurred}
          currentValue={initialDisplayState.isBlurred}
          disabled={initialDisplayState.isSticky}
          label="Blurred"
          helpBubbleContent={InitIsBlurredHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panelUuid={panelUuid}
          settingKey={PanelDisplayStateKeys.isSettingsSticky}
          currentValue={initialDisplayState.isSettingsSticky}
          label="Settings Sticky"
          helpBubbleContent={InitIsSettingsStickyHelpText()}
          customHandler={() => {
            const newValue = !initialDisplayState.isSettingsSticky;
            const shouldUpdateIsSettingsExpanded =
              newValue && !initialDisplayState.isSettingsExpanded;
            updatePanel({
              uuid: panelUuid,
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
          panelUuid={panelUuid}
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
