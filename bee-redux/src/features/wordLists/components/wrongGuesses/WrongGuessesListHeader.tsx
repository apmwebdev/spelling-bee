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
  selectWrongGuessesListSettings,
  setWrongGuessesSortOrder,
  setWrongGuessesSortType,
  SortType,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SortOrderKeys } from "@/types/globalTypes";

export function WrongGuessesListHeader() {
  const dispatch = useAppDispatch();
  const { sortType, sortOrder } = useAppSelector(
    selectWrongGuessesListSettings,
  );

  return (
    <header className="header">
      <div className="sort-type">
        <span>Sort</span>
        <ToggleGroup.Root
          type="single"
          value={sortType}
          onValueChange={(val) => dispatch(setWrongGuessesSortType(val))}
        >
          <ToggleGroup.Item value={SortType.Alphabetical}>
            Alphabetical
          </ToggleGroup.Item>
          <ToggleGroup.Item value={SortType.FoundOrder}>
            Guess Order
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div className="sort-order">
        <span>Order</span>
        <ToggleGroup.Root
          type="single"
          value={sortOrder}
          onValueChange={(val) => dispatch(setWrongGuessesSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrderKeys.asc}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrderKeys.desc}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
