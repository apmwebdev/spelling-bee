import { useAppSelector } from "../../../../app/hooks";
import { GuessFormat, selectCorrectGuesses } from "../../guessesSlice";
import {
  SortOrder,
  SortType,
  selectFoundWordsListSettings,
  FoundWordsSettingsFormat,
} from "../wordListSettingsSlice";
import { WordListScroller } from "../WordListScroller";
import { FoundWordsStatus } from "./FoundWordsStatus";
import { FoundWordsSettings } from "./FoundWordsSettings";
import { FoundWordsListHeader } from "./FoundWordsListHeader";

export function FoundWordsContainer() {
  const correctGuesses = useAppSelector(selectCorrectGuesses);
  const foundWordsSettings = useAppSelector(selectFoundWordsListSettings);

  const generateDisplayGuessList = (
    { foundWordsSortType, foundWordsSortOrder }: FoundWordsSettingsFormat,
    guesses: GuessFormat[],
  ) => {
    let displayGuessList: GuessFormat[] = [];
    if (guesses.length === 0) {
      return displayGuessList;
    }

    displayGuessList = [...guesses];

    if (foundWordsSortType === SortType.Alphabetical) {
      displayGuessList.sort((a, b) => {
        if (a.word < b.word) {
          return foundWordsSortOrder === SortOrder.Ascending ? -1 : 1;
        }
        if (a.word > b.word) {
          return foundWordsSortOrder === SortOrder.Ascending ? 1 : -1;
        }
        return 0;
      });
    } else {
      displayGuessList.sort((a, b) => {
        if (foundWordsSortOrder === SortOrder.Ascending) {
          return a.timestamp - b.timestamp;
        }
        return b.timestamp - a.timestamp;
      });
    }

    return displayGuessList;
  };

  const guessListContent = () => {
    const displayGuessList = generateDisplayGuessList(
      foundWordsSettings,
      correctGuesses,
    );
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
      <FoundWordsSettings />
      <FoundWordsStatus
        foundWordsIncludeTotal={foundWordsSettings.foundWordsIncludeTotal}
        pangramsIncludeTotal={foundWordsSettings.pangramsIncludeTotal}
        includePerfectPangrams={foundWordsSettings.includePerfectPangrams}
        perfectPangramsIncludeTotal={
          foundWordsSettings.perfectPangramsIncludeTotal
        }
      />
      {guessListContent()}
    </div>
  );
}
