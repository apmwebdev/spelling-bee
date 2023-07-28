import {
  selectGuessListSettings,
  setFoundWordsSortOrder,
  setFoundWordsSortType,
  SortOrder,
  SortType,
  toggleWrongGuessesShow,
} from "./guessListSettingsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";

export function GuessListSettingsContent() {
  const dispatch = useDispatch();
  const {
    foundWordsSortType,
    foundWordsSortOrder,
    wrongGuessesShow,
    wrongGuessesSeparate,
  } = useAppSelector(selectGuessListSettings);
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
      <div className="sb-show-wrong-guesses">
        <label>
          Show incorrect guesses
          <input
            type="checkbox"
            name="wrongGuessesShow"
            value="blah"
            checked={wrongGuessesShow}
            onChange={(e) => dispatch(toggleWrongGuessesShow())}
          />
        </label>
      </div>
    </>
  );
}