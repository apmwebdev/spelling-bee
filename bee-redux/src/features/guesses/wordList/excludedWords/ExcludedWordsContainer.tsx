import { useAppSelector } from "../../../../app/hooks";
import { selectExcludedWords } from "../../../puzzle/puzzleSlice";
import { WordListScroller } from "../WordListScroller";
import { ExcludedWordsSettings } from "./ExcludedWordsSettings";
import { ExcludedWordsListHeader } from "./ExcludedWordsListHeader";
import {
  selectExcludedWordsListSettings,
  SortOrder,
} from "../wordListSettingsSlice";

export function ExcludedWordsContainer() {
  const excludedWords = useAppSelector(selectExcludedWords);
  const { sortOrder } = useAppSelector(selectExcludedWordsListSettings);
  const displayList = [...excludedWords];

  return (
    <div className="sb-excluded-words-container">
      <ExcludedWordsSettings />
      <div className="sb-excluded-words-status sb-word-list-status">
        There are{" "}
        <span className="word-list-status-count">{excludedWords.length}</span>{" "}
        words excluded from this puzzle.
      </div>
      <div className="sb-word-list-container">
        <ExcludedWordsListHeader />
        <WordListScroller
          wordList={
            sortOrder === SortOrder.Ascending
              ? displayList
              : displayList.reverse()
          }
          allowPopovers={false}
        />
      </div>
    </div>
  );
}
