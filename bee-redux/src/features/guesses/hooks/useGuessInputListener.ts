import { useContext, useEffect } from "react";
import { GuessInputContext } from "@/features/guesses/providers/GuessInputProvider";

const interactiveElementFocus = (e: KeyboardEvent) => {
  return (
    document.activeElement?.tagName === "INPUT" ||
    document.activeElement?.tagName === "BUTTON" ||
    document.activeElement?.tagName === "SELECT"
  );
};

/**
 * This hook exists to encapsulate the keyboard listener aspect of guess input.
 * Guess input does not use an actual text input, but instead listens for
 * `keydown` events. If the keydown event is for a letter and the focus on the
 * page is not on an element that can do something with letter input, then the
 * letter is added to the current `guessValue`.
 *
 * The purpose of this design is twofold:
 *   1. It allows for a much richer display of the guess value than would be
 *      possible with a text input field. Invalid letters can be highlighted
 *      individually, for example.
 *   2. It allows mobile users to simply click the letter cells in the
 *      hive to input letters, without the possibility of clicking on an
 *      unnecessary text input that will then cause a virtual keyboard to pop
 *      up, hiding part of the screen.
 *
 * This design also copies the New York Times' design, which doesn't use an
 * actual text input for guesses.
 */
export const useGuessInputListener = () => {
  const {
    guessValue,
    setGuessValue,
    guessBackspace,
    enterPressedEvent,
    clearGuessTimeout,
    clearGuess,
  } = useContext(GuessInputContext);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }
      if (interactiveElementFocus(e) && !e.key.match(/^[A-Za-z]$/)) {
        return;
      }
      if (clearGuessTimeout.current) {
        clearTimeout(clearGuessTimeout.current);
        clearGuess();
      }
      if (
        document.activeElement?.tagName === "BUTTON" &&
        e.key.match(/^[A-Za-z]$/)
      ) {
        (document.activeElement as HTMLElement).blur();
      }
      if (e.key === "Backspace") {
        guessBackspace();
        return;
      }
      if (e.key === "Enter") {
        window.dispatchEvent(enterPressedEvent);
        return;
      }
      if (!e.key.match(/^[A-Za-z]$/)) {
        return;
      }
      if (guessValue.length >= 15) {
        return;
      }
      setGuessValue((current) => current + e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
