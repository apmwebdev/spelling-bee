import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { GuessFormat, selectCorrectGuesses } from "../../guessesSlice";
import {
  SortOrder,
  SortType,
  selectFoundWordsListSettings,
  toggleFoundWordsSettingsCollapsed,
} from "../wordListSettingsSlice";
import { WordListScroller } from "../WordListScroller";
import { FoundWordsStatus } from "./FoundWordsStatus";
import { FoundWordsListHeader } from "./FoundWordsListHeader";
import { SettingsCollapsible } from "../SettingsCollapsible";
import { FoundWordsSettings } from "./FoundWordsSettings";

export function FoundWordsContainer() {
  const dispatch = useAppDispatch();
  const correctGuesses = useAppSelector(selectCorrectGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectFoundWordsListSettings,
  );

  const generateDisplayGuessList = () => {
    let displayGuessList: GuessFormat[] = [];
    if (correctGuesses.length === 0) {
      return displayGuessList;
    }

    displayGuessList = [...correctGuesses];

    if (sortType === SortType.Alphabetical) {
      displayGuessList.sort((a, b) => {
        if (a.word < b.word) {
          return sortOrder === SortOrder.Ascending ? -1 : 1;
        }
        if (a.word > b.word) {
          return sortOrder === SortOrder.Ascending ? 1 : -1;
        }
        return 0;
      });
    } else {
      displayGuessList.sort((a, b) => {
        if (sortOrder === SortOrder.Ascending) {
          return a.timestamp - b.timestamp;
        }
        return b.timestamp - a.timestamp;
      });
    }

    return displayGuessList;
  };

  const guessListContent = () => {
    const displayGuessList = generateDisplayGuessList();
    const wordsOnly = displayGuessList.map((guess) => guess.word);
    if (wordsOnly.length > 0) {
      return (
        <div className="sb-word-list-container">
          <FoundWordsListHeader />
          <WordListScroller wordList={wordsOnly} allowPopovers={true} />
        </div>
      );
    }
    return <div className="sb-word-list empty">No found words</div>;
  };
  return (
    <div className="sb-found-words-container">
      <SettingsCollapsible
        isCollapsed={settingsCollapsed}
        toggleIsCollapsed={() => dispatch(toggleFoundWordsSettingsCollapsed())}
      >
        <FoundWordsSettings />
      </SettingsCollapsible>
      <FoundWordsStatus />
      {guessListContent()}
    </div>
  );
}
