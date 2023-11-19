/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  selectFoundWordsListSettings,
  setFoundWordsSortOrder,
  setFoundWordsSortType,
  SortType,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SortOrderKeys } from "@/types";

export function FoundWordsListHeader() {
  const dispatch = useAppDispatch();
  const { sortType, sortOrder } = useAppSelector(selectFoundWordsListSettings);

  return (
    <header>
      <div>
        <span>Sort</span>
        <ToggleGroup.Root
          type="single"
          value={sortType}
          onValueChange={(val) => dispatch(setFoundWordsSortType(val))}
        >
          <ToggleGroup.Item value={SortType.Alphabetical}>
            Alphabetical
          </ToggleGroup.Item>
          <ToggleGroup.Item value={SortType.FoundOrder}>
            Found Order
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div>
        <span>Order</span>
        <ToggleGroup.Root
          type="single"
          value={sortOrder}
          onValueChange={(val) => dispatch(setFoundWordsSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrderKeys.asc}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrderKeys.desc}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
