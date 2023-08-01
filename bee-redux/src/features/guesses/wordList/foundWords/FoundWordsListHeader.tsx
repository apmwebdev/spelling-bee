import {
  selectFoundWordsListSettings,
  setFoundWordsSortOrder,
  setFoundWordsSortType,
  SortOrder,
  SortType,
} from "../wordListSettingsSlice";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";

export function FoundWordsListHeader() {
  const dispatch = useAppDispatch();
  const { sortType, sortOrder } = useAppSelector(selectFoundWordsListSettings);

  return (
    <header className="header">
      <div className="sort-type">
        <span>Sort</span>
        <ToggleGroup.Root
          type="single"
          className="sb-found-words-sort-order sb-word-list-toggle"
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
      <div className="sort-order">
        <span>Order</span>
        <ToggleGroup.Root
          type="single"
          className="sb-found-words-sort-type sb-word-list-toggle"
          value={sortOrder}
          onValueChange={(val) => dispatch(setFoundWordsSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrder.Ascending}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrder.Descending}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
