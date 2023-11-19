/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Toggle from "@/components/radix-ui/radix-toggle";
import { Icon } from "@iconify/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  PanelCurrentDisplayStateProperties,
  selectPanelDisplayState,
  setPanelDisplayPropThunk,
} from "@/features/hintPanels";

export function SettingsToggle({ panelId }: { panelId: number }) {
  const dispatch = useAppDispatch();
  const display = useAppSelector(selectPanelDisplayState(panelId));
  const toggleExpanded = () => {
    dispatch(
      setPanelDisplayPropThunk({
        panelId: panelId,
        property: PanelCurrentDisplayStateProperties.isSettingsExpanded,
        value: !display.isSettingsExpanded,
      }),
    );
  };
  return (
    <Toggle.Root
      className="PanelSettingsToggle HintPanelHeaderButton IconButton"
      pressed={display.isSettingsExpanded}
      onPressedChange={toggleExpanded}
    >
      <Icon icon="mdi:cog" />
    </Toggle.Root>
  );
}
