import { useAppSelector } from "../../app/hooks";
import { GuessFormat, selectGuessesData } from "./guessesSlice";
import { GuessListSettings } from "./guessList/GuessListSettings";
import {
  GuessListSettingsFormat,
  selectGuessListSettings,
  SortOrder,
  SortType,
} from "./guessList/guessListSettingsSlice";
import uniqid from "uniqid";
import { Progress } from "../status/Progress";
import { GuessListStatus } from "./guessList/GuessListStatus";

export function GuessList() {
  const guessesData = useAppSelector(selectGuessesData);
  const guestListSettings = useAppSelector(selectGuessListSettings);

  const generateDisplayGuessList = (
    {
      foundWordsSortType,
      foundWordsSortOrder,
      wrongGuessesShow,
    }: GuessListSettingsFormat,
    guesses: GuessFormat[],
  ) => {
    let displayGuessList: GuessFormat[] = [];
    if (guesses.length === 0) {
      return displayGuessList;
    }

    if (!wrongGuessesShow) {
      displayGuessList = guesses.filter((guess) => guess.isAnswer);
    } else {
      displayGuessList = [...guesses];
    }

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
      guestListSettings,
      guessesData.guesses,
    );
    if (displayGuessList.length > 0) {
      return (
        <ul className="sb-guess-list has-content">
          {displayGuessList.map((guess) => {
            return <li key={uniqid()}>{guess.word}</li>;
          })}
        </ul>
      );
    }
    return <div className="sb-guess-list empty">No guesses</div>;
  };
  return (
    <div className="sb-guess-list-container">
      <GuessListSettings />
      <GuessListStatus />
      {guessListContent()}
    </div>
  );
}
