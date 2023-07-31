import { useAppSelector } from "../../../app/hooks";
import { GuessFormat, selectGuessesData } from "../guessesSlice";
import {
  WordListSettingsFormat,
  selectWordListSettings,
  SortOrder,
  SortType,
} from "./wordListSettingsSlice";
import { WordListScroller } from "./WordListScroller";
import { FoundWordsStatus } from "./FoundWordsStatus";
import { FoundWordsSettings } from "./FoundWordsSettings";

export function FoundWordsList() {
  const guessesData = useAppSelector(selectGuessesData);
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
      guessesData.guesses,
    );
    const wordsOnly = displayGuessList.map((guess) => guess.word);
    if (wordsOnly.length > 0) {
      return <WordListScroller wordList={wordsOnly} />;
    }
    return <div className="sb-word-list empty">No guesses</div>;
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
