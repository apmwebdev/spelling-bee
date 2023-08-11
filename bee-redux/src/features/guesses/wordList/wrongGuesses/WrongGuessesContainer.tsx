import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectWrongGuesses } from "../../guessesSlice";
import {
  selectWrongGuessesListSettings,
  SortOrder,
  SortType,
  toggleWrongGuessesSettingsCollapsed,
} from "../wordListSettingsSlice";
import { WrongGuessesListContainer } from "./WrongGuessesListContainer";
import { SettingsCollapsible } from "../SettingsCollapsible";

export function WrongGuessesContainer() {
  const dispatch = useAppDispatch();
  const wrongGuesses = useAppSelector(selectWrongGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectWrongGuessesListSettings,
  );

  const generateDisplayGuessList = () => {
    if (wrongGuesses.length === 0) {
      return [];
    }

    const displayGuessList = [...wrongGuesses];
    if (sortType === SortType.Alphabetical) {
      displayGuessList.sort((a, b) => {
        if (a.text < b.text) {
          return sortOrder === SortOrder.Ascending ? -1 : 1;
        }
        if (a.text > b.text) {
          return sortOrder === SortOrder.Ascending ? 1 : -1;
        }
        return 0;
      });
    } else {
      displayGuessList.sort((a, b) => {
        if (sortOrder === SortOrder.Ascending) {
          return a.createdAt - b.createdAt;
        }
        return b.createdAt - a.createdAt;
      });
    }

    return displayGuessList.map((guess) => guess.text);
  };

  return (
    <div className="sb-wrong-guesses-container">
      <SettingsCollapsible
        isCollapsed={settingsCollapsed}
        toggleIsCollapsed={() =>
          dispatch(toggleWrongGuessesSettingsCollapsed())
        }
      >
        No content
      </SettingsCollapsible>
      <div className="sb-wrong-guesses-status sb-word-list-status">
        You've made{" "}
        <span className="word-list-status-count">{wrongGuesses.length}</span>{" "}
        incorrect {wrongGuesses.length === 1 ? "guess" : "guesses"}.
      </div>
      <WrongGuessesListContainer wordList={generateDisplayGuessList()} />
    </div>
  );
}
