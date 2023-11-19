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
  selectExcludedWordsListSettings,
  setExcludedWordsSortOrder,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SortOrderKeys } from "@/types";

export function ExcludedWordsListHeader() {
  const dispatch = useAppDispatch();
  const { sortOrder } = useAppSelector(selectExcludedWordsListSettings);

  return (
    <header>
      <div>
        <span>Order</span>
        <ToggleGroup.Root
          type="single"
          value={sortOrder}
          onValueChange={(val) => dispatch(setExcludedWordsSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrderKeys.asc}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrderKeys.desc}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
