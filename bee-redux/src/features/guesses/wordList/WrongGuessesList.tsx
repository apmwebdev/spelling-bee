import { useAppSelector } from "../../../app/hooks";
import { selectGuessesData } from "../guessesSlice";
import {
  selectWordListSettings,
  SortOrder,
  SortType,
} from "./wordListSettingsSlice";
import { WordListScroller } from "./WordListScroller";

export function WrongGuessesList() {
  const guessesData = useAppSelector(selectGuessesData);
  const { wrongGuessesSortType, wrongGuessesSortOrder } = useAppSelector(
    selectWordListSettings,
  );

  const generateDisplayGuessList = () => {
    const displayGuessList = guessesData.guesses.filter(
      (guess) => !guess.isAnswer,
    );
    if (guessesData.guesses.length === 0) {
      return displayGuessList;
    }

    if (wrongGuessesSortType === SortType.Alphabetical) {
      displayGuessList.sort((a, b) => {
        if (a.word < b.word) {
          return wrongGuessesSortOrder === SortOrder.Ascending ? -1 : 1;
        }
        if (a.word > b.word) {
          return wrongGuessesSortOrder === SortOrder.Ascending ? 1 : -1;
        }
        return 0;
      });
    } else {
      displayGuessList.sort((a, b) => {
        if (wrongGuessesSortOrder === SortOrder.Ascending) {
          return a.timestamp - b.timestamp;
        }
        return b.timestamp - a.timestamp;
      });
    }

    return displayGuessList;
  };

  const guessListContent = () => {
    const displayGuessList = generateDisplayGuessList();
    if (displayGuessList.length > 0) {
      const wordsOnly = displayGuessList.map((guess) => guess.word);
      return <WordListScroller wordList={wordsOnly} allowPopovers={false} />;
    }
    return <div className="sb-word-list empty">No guesses</div>;
  };
  return guessListContent();
}
