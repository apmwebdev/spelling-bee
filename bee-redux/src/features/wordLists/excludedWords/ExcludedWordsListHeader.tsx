import {
  selectExcludedWordsListSettings,
  setExcludedWordsSortOrder,
  SortOrder,
} from "../wordListSettingsSlice";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export function ExcludedWordsListHeader() {
  const dispatch = useAppDispatch();
  const { sortOrder } = useAppSelector(selectExcludedWordsListSettings);

  return (
    <header className="header">
      <div className="sort-order">
        <span>Order</span>
        <ToggleGroup.Root
          type="single"
          className="sb-wrong-guesses-sort-order ToggleGroup"
          value={sortOrder}
          onValueChange={(val) => dispatch(setExcludedWordsSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrder.Ascending}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrder.Descending}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
