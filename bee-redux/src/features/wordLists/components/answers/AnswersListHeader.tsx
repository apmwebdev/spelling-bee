import {
  selectAnswersListSettings,
  setAnswersSortOrder,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SortOrderKeys } from "@/types";

export function AnswersListHeader() {
  const dispatch = useAppDispatch();
  const { sortOrder } = useAppSelector(selectAnswersListSettings);

  return (
    <header className="header">
      <div className="sort-order">
        <span>Order</span>
        <ToggleGroup.Root
          type="single"
          value={sortOrder}
          onValueChange={(val) => dispatch(setAnswersSortOrder(val))}
        >
          <ToggleGroup.Item value={SortOrderKeys.asc}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrderKeys.desc}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}
