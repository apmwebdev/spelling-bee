/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Select from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";
import {
  StatusTrackingKeys,
  StatusTrackingOptions,
} from "@/features/hintPanels/types";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function PanelStatusTrackingControl({
  panelId,
  statusTracking,
}: {
  panelId: number;
  statusTracking: StatusTrackingKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: StatusTrackingKeys) => {
    updatePanel({
      id: panelId,
      debounceField: "statusTracking",
      statusTracking: value,
    });
  };

  return (
    <div className="GeneralPanelSettingsStatusTracking">
      <span>Display:</span>
      <Select.Root value={statusTracking} onValueChange={handleChange}>
        <Select.Trigger className="SmallSelect" />
        <Select.ContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(StatusTrackingOptions).map((key) => {
              return (
                <Select.Item
                  key={uniqid()}
                  value={key}
                  itemText={StatusTrackingOptions[key].compactTitle}
                />
              );
            })}
          </Select.Viewport>
        </Select.ContentWithPortal>
      </Select.Root>
    </div>
  );
}
