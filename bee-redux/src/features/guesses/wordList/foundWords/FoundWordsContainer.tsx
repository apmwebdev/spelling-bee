import { useAppSelector } from "../../../../app/hooks";
import { GuessFormat, selectCorrectGuesses } from "../../guessesSlice";
import {
  WordListSettingsFormat,
  selectWordListSettings,
  SortOrder,
  SortType,
} from "../wordListSettingsSlice";
import { WordListScroller } from "../WordListScroller";
import { FoundWordsStatus } from "./FoundWordsStatus";
import { FoundWordsSettings } from "./FoundWordsSettings";
import { FoundWordsListHeader } from "./FoundWordsListHeader";

export function FoundWordsContainer() {
  const correctGuesses = useAppSelector(selectCorrectGuesses);
  const wordListSettings = useAppSelector(selectWordListSettings);

  const generateDisplayGuessList = (
    { foundWordsSortType, foundWordsSortOrder }: WordListSettingsFormat,
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
      wordListSettings,
      correctGuesses,
    );
    const wordsOnly = displayGuessList.map((guess) => guess.word);
    if (wordsOnly.length > 0) {
      return (
        <div className="sb-word-list-container">
          <FoundWordsListHeader
            sortType={wordListSettings.foundWordsSortType}
            sortOrder={wordListSettings.foundWordsSortOrder}
          />
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
        foundWordsIncludeTotal={wordListSettings.foundWordsIncludeTotal}
        pangramsIncludeTotal={wordListSettings.pangramsIncludeTotal}
        includePerfectPangrams={wordListSettings.includePerfectPangrams}
        perfectPangramsIncludeTotal={
          wordListSettings.perfectPangramsIncludeTotal
        }
      />
      {guessListContent()}
    </div>
  );
}
