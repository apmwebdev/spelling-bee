/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  PanelCurrentDisplayStateProperties,
  selectPanelDisplayState,
  setPanelDisplayPropThunk,
} from "@/features/hintPanels";

import { Uuid } from "@/features/api";
import { SettingsToggle } from "@/components/SettingsToggle";

export function HintPanelSettingsToggle({ panelUuid }: { panelUuid: Uuid }) {
  const dispatch = useAppDispatch();
  const display = useAppSelector(selectPanelDisplayState(panelUuid));
  const toggleExpanded = () => {
    dispatch(
      setPanelDisplayPropThunk({
        panelUuid: panelUuid,
        property: PanelCurrentDisplayStateProperties.isSettingsExpanded,
        value: !display.isSettingsExpanded,
      }),
    );
  };
  return (
    <SettingsToggle
      isPressed={display.isSettingsExpanded}
      clickHandler={toggleExpanded}
    />
  );
}
