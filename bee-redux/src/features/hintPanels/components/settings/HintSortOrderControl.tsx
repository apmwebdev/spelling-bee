/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { SortOrderKeys, Uuid } from "@/types";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function HintSortOrderControl({
  panelUuid,
  sortOrder,
}: {
  panelUuid: Uuid;
  sortOrder: SortOrderKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: SortOrderKeys) => {
    updatePanel({
      uuid: panelUuid,
      debounceField: "sortOrder",
      typeData: {
        sortOrder: value,
      },
    });
  };

  return (
    <div className="HintSortOrderControl">
      <span>Sort Order:</span>
      <ToggleGroup.Root
        type="single"
        value={sortOrder}
        onValueChange={handleChange}
      >
        <ToggleGroup.Item value={SortOrderKeys.asc}>Asc</ToggleGroup.Item>
        <ToggleGroup.Item value={SortOrderKeys.desc}>Desc</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
}
