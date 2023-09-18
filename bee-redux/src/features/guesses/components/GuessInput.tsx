import React, { useContext, useEffect, useRef, useState } from "react";
import { GuessInputContext } from "@/app/GuessInputProvider";
import { GuessInputDisplay } from "./guessInput/GuessInputDisplay";
import {
  GuessFormat,
  selectCurrentAttempt,
  selectGuesses,
  useAddGuessMutation,
} from "@/features/guesses";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAnswerWords,
  selectCenterLetter,
  selectExcludedWords,
  selectValidLetters,
} from "@/features/puzzle";
import { GuessAlerts } from "./guessInput/GuessAlerts";
import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";

export function GuessInput() {
  const dispatch = useAppDispatch();
  const { guessValue, setGuessValue, guessBackspace, enterPressedEvent } =
    useContext(GuessInputContext);
  const answers = useAppSelector(selectAnswerWords);
  const excludedWords = useAppSelector(selectExcludedWords);
  const validLetters = useAppSelector(selectValidLetters);
  const centerLetter = useAppSelector(selectCenterLetter);
  const guesses = useAppSelector(selectGuesses);
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const [messages, setMessages] = useState<string[]>([]);
  const [messagesType, setMessagesType] = useState<"" | "answer" | "error">("");
  const [guessCssClasses, setGuessCssClasses] = useState("");
  const clearMessagesTimeout = useRef<TimeoutId | null>(null);
  const clearGuessTimeout = useRef<TimeoutId | null>(null);
  const [addGuess] = useAddGuessMutation();

  useEffect(() => {
    enum ErrorTypes {
      TooShort = "Must be at least 4 letters",
      InvalidLetter = "Contains invalid letter(s)",
      MissingCenterLetter = "Must contain center letter",
      AlreadyGuessed = "Already guessed",
      AlreadyFound = "Already found",
      AlreadySpoiled = "Already spoiled",
    }

    const interactiveElementFocus = (e: KeyboardEvent) => {
      return (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "BUTTON" ||
        document.activeElement?.tagName === "SELECT"
      );
    };

    // let clearMessagesTimeout: TimeoutId | null;
    // let clearGuessTimeout: TimeoutId | null;

    const clearMessages = () => {
      setMessages([]);
      setMessagesType("");
      setGuessCssClasses("");
      clearMessagesTimeout.current = null;
    };

    const clearGuess = () => {
      setGuessValue("");
      clearGuessTimeout.current = null;
    };

    const displayMessages = (
      newMessages: string[],
      newMessagesType: "" | "answer" | "error",
    ) => {
      clearMessagesTimeout.current = setTimeout(() => {
        clearMessages();
      }, 1000);

      clearGuessTimeout.current = setTimeout(() => {
        clearGuess();
      }, 1000);

      setMessages(() => newMessages);
      setMessagesType(newMessagesType);
      if (newMessagesType === "error") {
        setGuessCssClasses("error");
      }
    };

    const validateSubmission = (
      guessValue: string,
      guesses: GuessFormat[],
      centerLetter: string,
    ) => {
      const getMatchingGuess = (guesses: GuessFormat[], guessValue: string) => {
        let matchingGuess: GuessFormat | null = null;
        for (const guessObject of guesses) {
          if (guessObject.text === guessValue) {
            matchingGuess = guessObject;
            break;
          }
        }
        return matchingGuess;
      };

      const errorMessages: ErrorTypes[] = [];

      if (guessValue.length < 4) {
        errorMessages.push(ErrorTypes.TooShort);
      }
      if (!guessValue.includes(centerLetter)) {
        errorMessages.push(ErrorTypes.MissingCenterLetter);
      }
      if (
        guessValue !== "" &&
        !guessValue.match(new RegExp(`^[${validLetters.join("")}]+$`))
      ) {
        errorMessages.push(ErrorTypes.InvalidLetter);
      }
      const matchingGuess = getMatchingGuess(guesses, guessValue);
      if (matchingGuess) {
        if (matchingGuess.isAnswer) {
          errorMessages.push(ErrorTypes.AlreadyFound);
        } else if (matchingGuess.isSpoiled) {
          errorMessages.push(ErrorTypes.AlreadySpoiled);
        } else {
          errorMessages.push(ErrorTypes.AlreadyGuessed);
        }
      }
      if (errorMessages.length > 0) {
        displayMessages(errorMessages, "error");
      }
      return errorMessages.length === 0;
    };

    const handleSubmit = () => {
      if (clearMessagesTimeout.current) {
        clearTimeout(clearMessagesTimeout.current);
        clearMessages();
      }
      if (clearGuessTimeout.current) {
        clearTimeout(clearGuessTimeout.current);
        clearGuess();
      }
      if (validateSubmission(guessValue, guesses, centerLetter)) {
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
          displayMessages([guessValue], "answer");
          setGuessValue("");
        } else if (isExcluded) {
          displayMessages(["Excluded from word list"], "error");
        } else {
          displayMessages(["Not in word list"], "error");
        }
      }
    };

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

    const handleEnterPressed = () => {
      handleSubmit();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("enterPressed", handleEnterPressed);
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("enterPressed", handleEnterPressed);
    };
  }, [
    answers,
    centerLetter,
    dispatch,
    enterPressedEvent,
    excludedWords,
    guessBackspace,
    guessValue,
    guesses,
    setGuessValue,
    validLetters,
  ]);

  return (
    <div className="GuessInputContainer">
      <GuessAlerts messages={messages} messagesType={messagesType} />
      <GuessInputDisplay
        guessValue={guessValue}
        additionalCssClasses={guessCssClasses}
      />
    </div>
  );
}
