import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectExcludedWords } from "../../puzzle/puzzleSlice";
import { WordListScroller } from "../WordListScroller";
import { ExcludedWordsListHeader } from "./ExcludedWordsListHeader";
import {
  selectExcludedWordsListSettings,
  SortOrder,
  toggleExcludedWordsSettingsCollapsed,
} from "../wordListSettingsSlice";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";

export function ExcludedWordsContainer() {
  const dispatch = useAppDispatch();
  const excludedWords = useAppSelector(selectExcludedWords);
  const { sortOrder, settingsCollapsed } = useAppSelector(
    selectExcludedWordsListSettings,
  );
  const displayList = [...excludedWords];

  return (
    <div className="sb-excluded-words-container">
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() =>
          dispatch(toggleExcludedWordsSettingsCollapsed())
        }
      >
        blah
      </SettingsCollapsible>
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
