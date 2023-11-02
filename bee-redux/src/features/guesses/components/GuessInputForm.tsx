import {
  selectCurrentAttempt,
  selectGuesses,
  useAddGuessMutation,
} from "@/features/guesses";
import React, { useContext, useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useGuessMessages } from "@/features/guesses/hooks/useGuessMessages";
import { GuessInputContext } from "@/features/guesses/providers/GuessInputProvider";
import { GuessAlerts } from "@/features/guesses/components/guessInput/GuessAlerts";
import { selectAnswerWords, selectExcludedWords } from "@/features/puzzle";
import { GuessInputDisplay } from "@/features/guesses/components/guessInput/GuessInputDisplay";
import { useGuessInputListener } from "@/features/guesses/hooks/useGuessInputListener";
import { useGuessValidation } from "@/features/guesses/hooks/useGuessValidation";

export function GuessInputForm() {
  const { guessValue, setGuessValue, clearGuessTimeout, clearGuess } =
    useContext(GuessInputContext);
  const answers = useAppSelector(selectAnswerWords);
  const guesses = useAppSelector(selectGuesses);
  const excludedWords = useAppSelector(selectExcludedWords);
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const [guessCssClasses, setGuessCssClasses] = useState("");
  const messages = useGuessMessages({
    setGuessCssClasses,
    clearGuessTimeout,
    clearGuess,
  });
  const validator = useGuessValidation(messages);
  const [addGuess] = useAddGuessMutation();
  useGuessInputListener();

  useEffect(() => {
    const handleSubmit = () => {
      if (messages.clearMessagesTimeout.current) {
        clearTimeout(messages.clearMessagesTimeout.current);
        messages.clear();
      }
      if (clearGuessTimeout.current) {
        clearTimeout(clearGuessTimeout.current);
        clearGuess();
      }
      if (validator.validate(guessValue, guesses)) {
        const isAnswer = answers.includes(guessValue);
        const isExcluded = excludedWords.includes(guessValue);
        addGuess({
          guess: {
            user_puzzle_attempt_id: currentAttempt.id,
            text: guessValue,
            is_spoiled: false,
          },
        });
        if (isAnswer) {
          messages.update([guessValue], "answer");
          setGuessValue("");
        } else if (isExcluded) {
          messages.update(["Excluded from word list"], "error");
        } else {
          messages.update(["Not in word list"], "error");
        }
      }
    };

    const handleEnterPressed = () => {
      handleSubmit();
    };

    window.addEventListener("enterPressed", handleEnterPressed);
    return () => {
      window.removeEventListener("enterPressed", handleEnterPressed);
    };
  }, [guessValue, guesses]);

  return (
    <div className="GuessInputContainer">
      <GuessAlerts messages={messages.value} messagesType={messages.status} />
      <GuessInputDisplay
        guessValue={guessValue}
        additionalCssClasses={guessCssClasses}
      />
    </div>
  );
}
