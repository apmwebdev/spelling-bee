import { useContext } from "react";
import { GuessInputContext } from "../../../../app/GuessInputProvider";

export function GuessInputBackspace() {
  const { guessBackspace } = useContext(GuessInputContext);

  return (
    <button
      type="button"
      className="sb-guess-input-backspace standard-button"
      onClick={guessBackspace}
    >
      Delete
    </button>
  );
}
