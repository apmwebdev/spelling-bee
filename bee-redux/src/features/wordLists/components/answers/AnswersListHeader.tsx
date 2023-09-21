import {
  selectAnswersListSettings,
  setAnswersSortOrder,
  SortOrder,
} from "../../api/wordListSettingsSlice";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

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
          <ToggleGroup.Item value={SortOrder.Ascending}>Asc</ToggleGroup.Item>
          <ToggleGroup.Item value={SortOrder.Descending}>Desc</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </header>
  );
}