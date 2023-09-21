import {
  selectFoundWordsListSettings,
  setFoundWordsSortOrder,
  setFoundWordsSortType,
  SortOrder,
  SortType,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

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
          <ToggleGroup.Item value={SortOrder.Ascending}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrder.Descending}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}