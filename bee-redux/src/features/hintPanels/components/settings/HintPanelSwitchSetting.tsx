/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Switch } from "@/components/radix-ui/radix-switch";
import {
  HintPanelBooleanKeys,
  HintPanelBooleanSettings,
} from "@/features/hintPanels/types";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";
import classNames from "classnames/dedupe";

export function HintPanelSwitchSetting({
  panelUuid,
  settingKey,
  currentValue,
  disabled,
}: {
  panelUuid: string;
  settingKey: HintPanelBooleanKeys;
  currentValue: boolean;
  disabled?: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    updatePanel({
      uuid: panelUuid,
      debounceField: settingKey,
      typeData: {
        [settingKey]: !currentValue,
      },
    });
  };

  return (
    <div>
      <span
        className={classNames("HintPanelSwitchSetting", { disabled: disabled })}
      >
        {HintPanelBooleanSettings[settingKey].title}:
      </span>
      <Switch
        checked={currentValue}
        onCheckedChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
