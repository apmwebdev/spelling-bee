import { useAppSelector } from "../../../../app/hooks";
import { selectWrongGuesses } from "../../guessesSlice";

export function WrongGuessesStatus() {
  const wrongGuessesCount = useAppSelector(selectWrongGuesses).length;
  return (
    <div className="sb-wrong-guesses-status sb-word-list-status">
      You've made{" "}
      <span className="word-list-status-count">{wrongGuessesCount}</span>{" "}
      incorrect {wrongGuessesCount === 1 ? "guess" : "guesses"}.
    </div>
  );
}
