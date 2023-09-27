import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectExcludedWords } from "@/features/puzzle";
import { WordListScroller } from "../WordListScroller";
import { ExcludedWordsListHeader } from "./ExcludedWordsListHeader";
import {
  selectExcludedWordsListSettings,
  toggleExcludedWordsSettingsCollapsed,
} from "@/features/wordLists";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { SortOrderKeys } from "@/types";

export function ExcludedWordsContainer() {
  const dispatch = useAppDispatch();
  const excludedWords = useAppSelector(selectExcludedWords);
  const { sortOrder, settingsCollapsed } = useAppSelector(
    selectExcludedWordsListSettings,
  );
  const displayList = [...excludedWords];

  return (
    <div className="ExcludedWordsContainer">
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() =>
          dispatch(toggleExcludedWordsSettingsCollapsed())
        }
      >
        blah
      </SettingsCollapsible>
      <div className="WordListStatus">
        There are{" "}
        <span className="WordListStatusCount">{excludedWords.length}</span>{" "}
        words excluded from this puzzle.
      </div>
      <div className="WordListContainer">
        <ExcludedWordsListHeader />
        <WordListScroller
          wordList={
            sortOrder === SortOrderKeys.asc
              ? displayList
              : displayList.reverse()
          }
          allowPopovers={false}
        />
      </div>
    </div>
  );
}
