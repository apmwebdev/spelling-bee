import { useAppSelector } from "../../../../app/hooks";
import { selectWrongGuesses } from "../../guessesSlice";
import {
  selectWrongGuessesListSettings,
  SortOrder,
  SortType,
} from "../wordListSettingsSlice";
import { WrongGuessesStatus } from "./WrongGuessesStatus";
import { WrongGuessesListContainer } from "./WrongGuessesListContainer";
import { WrongGuessesSettings } from "./WrongGuessesSettings";

export function WrongGuessesContainer() {
  const wrongGuesses = useAppSelector(selectWrongGuesses);
  const { wrongGuessesSortType, wrongGuessesSortOrder } = useAppSelector(
    selectWrongGuessesListSettings,
  );

  const generateDisplayGuessList = () => {
    if (wrongGuesses.length === 0) {
      return [];
    }

    const displayGuessList = [...wrongGuesses];
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

    return displayGuessList.map((guess) => guess.word);
  };

  return (
    <div className="sb-wrong-guesses-container">
      <WrongGuessesSettings />
      <WrongGuessesStatus />
      <WrongGuessesListContainer wordList={generateDisplayGuessList()} />
    </div>
  );
}
