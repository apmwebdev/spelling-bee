import {
  selectWordListSettings,
  setFoundWordsSortOrder,
  setFoundWordsSortType,
  SortOrder,
  SortType,
} from "../wordListSettingsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/hooks";

export function FoundWordsSettingsContent() {
  const dispatch = useDispatch();
  const { foundWordsSortType, foundWordsSortOrder } = useAppSelector(
    selectWordListSettings,
  );
  return (
    <>
      <div className="sb-guess-list-sort-type">
        Sort:&nbsp;
        <label>
          Alphabetical
          <input
            type="radio"
            value={SortType.Alphabetical}
            name="sort-type"
            checked={foundWordsSortType === SortType.Alphabetical}
            onChange={(e) => dispatch(setFoundWordsSortType(e.target.value))}
          />
        </label>
        <label>
          Found Order
          <input
            type="radio"
            value={SortType.FoundOrder}
            name="sort-type"
            checked={foundWordsSortType === SortType.FoundOrder}
            onChange={(e) => dispatch(setFoundWordsSortType(e.target.value))}
          />
        </label>
      </div>
      <div className="sb-guess-list-sort-order">
        Sort order:&nbsp;
        <label>
          Ascending
          <input
            type="radio"
            value={SortOrder.Ascending}
            name="found-words-sort-order"
            checked={foundWordsSortOrder === SortOrder.Ascending}
            onChange={(e) => dispatch(setFoundWordsSortOrder(e.target.value))}
          />
        </label>
        <label>
          Descending
          <input
            type="radio"
            value={SortOrder.Descending}
            name="found-words-sort-order"
            checked={foundWordsSortOrder === SortOrder.Descending}
            onChange={(e) => dispatch(setFoundWordsSortOrder(e.target.value))}
          />
        </label>
      </div>
    </>
  );
}
