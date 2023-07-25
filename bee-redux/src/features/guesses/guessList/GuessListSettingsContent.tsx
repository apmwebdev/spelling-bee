import {
  selectGuessListSettings,
  setSortOrder,
  setSortType,
  SortOrder,
  SortType,
  toggleShowWrongGuesses,
} from "./guessListSettingsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";

export function GuessListSettingsContent() {
  const dispatch = useDispatch();
  const { sortType, sortOrder, showWrongGuesses, separateWrongGuesses } =
    useAppSelector(selectGuessListSettings);
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
            checked={sortType === SortType.Alphabetical}
            onChange={(e) => dispatch(setSortType(e.target.value))}
          />
        </label>
        <label>
          Found Order
          <input
            type="radio"
            value={SortType.FoundOrder}
            name="sort-type"
            checked={sortType === SortType.FoundOrder}
            onChange={(e) => dispatch(setSortType(e.target.value))}
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
            name="sort-order"
            checked={sortOrder === SortOrder.Ascending}
            onChange={(e) => dispatch(setSortOrder(e.target.value))}
          />
        </label>
        <label>
          Descending
          <input
            type="radio"
            value={SortOrder.Descending}
            name="sort-order"
            checked={sortOrder === SortOrder.Descending}
            onChange={(e) => dispatch(setSortOrder(e.target.value))}
          />
        </label>
      </div>
      <div className="sb-show-wrong-guesses">
        <label>
          Show incorrect guesses
          <input
            type="checkbox"
            name="showWrongGuesses"
            value="blah"
            checked={showWrongGuesses}
            onChange={(e) => dispatch(toggleShowWrongGuesses())}
          />
        </label>
      </div>
    </>
  );
}
