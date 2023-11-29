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
import { CSSProperties } from "react";
import {
  LetterPanelLocationKeys,
  LetterPanelLocationOptions,
} from "@/features/hintPanelType_letter";
import {
  SearchPanelLocationKeys,
  SearchPanelLocationOptions,
} from "@/features/hintPanelType_search";
import { PanelTypes, useUpdateHintPanelMutation } from "@/features/hintPanels";
import { Uuid } from "@/types";

export function HintLocationControl({
  panelUuid,
  location,
  panelType,
  style,
}: {
  panelUuid: Uuid;
  location: LetterPanelLocationKeys | SearchPanelLocationKeys;
  panelType: PanelTypes;
  style?: CSSProperties;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();

  const handleChange = (
    newLocation: LetterPanelLocationKeys | SearchPanelLocationKeys,
  ) => {
    updatePanel({
      uuid: panelUuid,
      debounceField: "location",
      typeData: {
        location: newLocation,
      },
    });
  };

  return (
    <div className="LetterPanelLocationControl" style={style}>
      <span>Location:</span>
      <Select.Root value={location} onValueChange={handleChange}>
        <Select.Trigger className="SmallSelect" style={{ width: "12em" }} />
        <Select.ContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(
              panelType === PanelTypes.Letter
                ? LetterPanelLocationOptions
                : SearchPanelLocationOptions,
            ).map((key) => (
              <Select.Item
                key={uniqid()}
                value={key}
                itemText={
                  panelType === PanelTypes.Letter
                    ? LetterPanelLocationOptions[key].title
                    : SearchPanelLocationOptions[key].title
                }
              />
            ))}
          </Select.Viewport>
        </Select.ContentWithPortal>
      </Select.Root>
    </div>
  );
}
