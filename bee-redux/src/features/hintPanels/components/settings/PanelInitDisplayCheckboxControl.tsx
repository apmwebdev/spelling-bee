/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Checkbox } from "@/components/radix-ui/radix-checkbox";
import { ReactNode } from "react";
import { HelpBubble } from "@/components/HelpBubble";
import { capitalizeFirstLetter } from "@/util";
import { PanelDisplayStateKeys } from "@/features/hintPanels/types";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function PanelInitDisplayCheckboxControl({
  panelUuid,
  settingKey,
  currentValue,
  disabled,
  label,
  helpBubbleContent,
  customHandler,
}: {
  panelUuid: string;
  settingKey: PanelDisplayStateKeys;
  currentValue: boolean;
  disabled?: boolean;
  label: string;
  helpBubbleContent: ReactNode;
  customHandler?: () => void;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    if (customHandler) {
      customHandler();
    } else {
      updatePanel({
        uuid: panelUuid,
        debounceField: `initDisplay${capitalizeFirstLetter(settingKey)}`,
        initialDisplayState: {
          [settingKey]: !currentValue,
        },
      });
    }
  };
  return (
    <div className="PanelInitDisplayControl">
      <label>
        <Checkbox
          checked={currentValue}
          disabled={disabled}
          onCheckedChange={handleChange}
        />
        <div className="PanelInitDisplayControlInfo">
          <HelpBubble>{helpBubbleContent}</HelpBubble>
          <span>{label}</span>
        </div>
      </label>
    </div>
  );
}
