import {
  selectWrongGuessesListSettings,
  setWrongGuessesSortOrder,
  setWrongGuessesSortType,
  SortType,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SortOrderKeys } from "@/types";

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
