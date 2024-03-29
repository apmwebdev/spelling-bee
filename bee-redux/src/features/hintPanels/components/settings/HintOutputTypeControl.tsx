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
  SubstringHintOutputKeys,
  SubstringHintOutputOptions,
  useUpdateHintPanelMutation,
} from "@/features/hintPanels";

import { Uuid } from "@/features/api";

export function HintOutputTypeControl({
  panelUuid,
  outputType,
}: {
  panelUuid: Uuid;
  outputType: SubstringHintOutputKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: SubstringHintOutputKeys) => {
    updatePanel({
      uuid: panelUuid,
      debounceField: "outputType",
      typeData: {
        outputType: value,
      },
    });
  };
  return (
    <div className="HintOutputTypeControl">
      <span>Output:</span>
      <Select.Root value={outputType} onValueChange={handleChange}>
        <Select.Trigger className="SmallSelect" style={{ width: "12em" }} />
        <Select.ContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(SubstringHintOutputOptions).map((key) => (
              <Select.Item
                key={uniqid()}
                value={key}
                itemText={SubstringHintOutputOptions[key].title}
              />
            ))}
          </Select.Viewport>
        </Select.ContentWithPortal>
      </Select.Root>
    </div>
  );
}
