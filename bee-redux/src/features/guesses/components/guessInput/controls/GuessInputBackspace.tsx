import { useContext } from "react";
import { GuessInputContext } from "@/app/GuessInputProvider";

export function GuessInputBackspace() {
  const { guessBackspace } = useContext(GuessInputContext);

  return (
    <button type="button" className="standardButton" onClick={guessBackspace}>
      Delete
    </button>
  );
}
