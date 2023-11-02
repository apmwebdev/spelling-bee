import React, { useContext, useState } from "react";
import { GuessInputContext } from "@/features/guesses/providers/GuessInputProvider";
import { GuessInputDisplay } from "./guessInput/GuessInputDisplay";

export function GuessInput() {
  const {
    guessValue,
    setGuessValue,
    guessBackspace,
    enterPressedEvent,
    clearGuessTimeout,
    clearGuess,
  } = useContext(GuessInputContext);
  const [guessCssClasses, setGuessCssClasses] = useState("");

  return (
    <GuessInputDisplay
      guessValue={guessValue}
      additionalCssClasses={guessCssClasses}
    />
  );
}
