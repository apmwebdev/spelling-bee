/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { HintPanelSwitchSetting } from "@/features/hintPanels/components/settings/HintPanelSwitchSetting";

import { HintPanelBooleanKeys } from "@/features/hintPanels/types";

export function HintSeparateKnownControl({
  panelId,
  separateKnown,
  disabled,
}: {
  panelId: number;
  separateKnown: boolean;
  disabled: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.separateKnown}
      currentValue={separateKnown}
      disabled={disabled}
    />
  );
}
