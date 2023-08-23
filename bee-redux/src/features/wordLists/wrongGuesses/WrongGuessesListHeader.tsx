import {
  selectWrongGuessesListSettings,
  setWrongGuessesSortOrder,
  setWrongGuessesSortType,
  SortOrder,
  SortType,
} from "../wordListSettingsSlice";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

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
          className="sb-wrong-guesses-sort-type ToggleGroup"
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
          className="sb-wrong-guesses-sort-order ToggleGroup"
          value={sortOrder}
          onValueChange={(val) => dispatch(setWrongGuessesSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrder.Ascending}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrder.Descending}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
