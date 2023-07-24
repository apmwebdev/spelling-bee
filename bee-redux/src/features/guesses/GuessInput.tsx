import React, { useEffect, useContext, useState, useRef } from "react";
import { GuessInputContext } from "../../app/GuessInputProvider";
import { GuessOutput } from "./GuessOutput";
import { addGuess, GuessFormat, selectGuesses } from "./guessesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAnswerWords,
  selectCenterLetter,
  selectValidLetters,
} from "../puzzle/puzzleSlice";
import { GuessAlerts } from "./GuessAlerts";
import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";

export function GuessInput() {
  const dispatch = useAppDispatch();
  const { guessValue, setGuessValue } = useContext(GuessInputContext);
  const answers = useAppSelector(selectAnswerWords);
  const validLetters = useAppSelector(selectValidLetters);
  const centerLetter = useAppSelector(selectCenterLetter);
  const guesses = useAppSelector(selectGuesses);
  const [messages, setMessages] = useState<string[]>([]);
  const [messagesType, setMessagesType] = useState<"" | "answer" | "error">("");
  const [guessCssClasses, setGuessCssClasses] = useState("");

  useEffect(() => {
    enum ErrorTypes {
      TooShort = "Must be at least 4 letters",
      InvalidLetter = "Contains invalid letter(s)",
      MissingCenterLetter = "Must contain center letter",
      AlreadyGuessed = "Already guessed",
      AlreadyFound = "Already found",
    }

    const interactiveElementFocus = (e: KeyboardEvent) => {
      return (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "BUTTON" ||
        document.activeElement?.tagName === "SELECT"
      );
    };

    const clearMessages = () => {
      setMessages([]);
      setMessagesType("");
      setGuessCssClasses("");
    };

    let clearMessagesTimeout: TimeoutId;
    let clearGuessTimeout: TimeoutId;
    const displayMessages = (
      newMessages: string[],
      newMessagesType: "" | "answer" | "error",
    ) => {
      clearMessagesTimeout = setTimeout(() => {
        clearMessages();
      }, 1000);

      clearGuessTimeout = setTimeout(() => {
        setGuessValue("");
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
      console.log("validateSubmission");
      const getMatchingGuess = (guesses: GuessFormat[], guessValue: string) => {
        let matchingGuess: GuessFormat | null = null;
        for (const guessObject of guesses) {
          if (guessObject.word === guessValue) {
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
      if (clearMessagesTimeout) {
        clearMessages();
        clearTimeout(clearGuessTimeout);
      }
      if (validateSubmission(guessValue, guesses, centerLetter)) {
        const isAnswer = answers.includes(guessValue);
        dispatch(
          addGuess({
            word: guessValue,
            isAnswer,
          }),
        );
        if (isAnswer) {
          displayMessages([guessValue], "answer");
          setGuessValue("");
        } else {
          displayMessages(["Not in word list"], "error");
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }
      if (interactiveElementFocus(e)) {
        return;
      }
      if (clearGuessTimeout) {
        setGuessValue("");
        clearTimeout(clearGuessTimeout);
      }
      if (e.key === "Backspace") {
        setGuessValue((current) => current.substring(0, current.length - 1));
        return;
      }
      if (e.key === "Enter") {
        handleSubmit();
        return;
      }
      if (!e.key.match(/^[A-Za-z]$/)) {
        return;
      }
      if (guessValue.length > 15) {
        return;
      }
      setGuessValue((current) => current + e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    answers,
    centerLetter,
    dispatch,
    guessValue,
    guesses,
    setGuessValue,
    validLetters,
  ]);

  return (
    <div className="sb-guess-input-container">
      <GuessAlerts messages={messages} messagesType={messagesType} />
      <GuessOutput
        guessValue={guessValue}
        additionalCssClasses={guessCssClasses}
      />
    </div>
  );
}
