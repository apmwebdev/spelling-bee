import {
  selectAnswersListSettings,
  setAnswersSortOrder,
  SortOrder,
} from "../wordListSettingsSlice";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
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
          className="ToggleGroup"
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
