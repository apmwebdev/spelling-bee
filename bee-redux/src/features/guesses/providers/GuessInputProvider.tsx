import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useRef,
  useState,
} from "react";
import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";

export type GuessInputContextType = {
  guessValue: string;
  setGuessValue: React.Dispatch<React.SetStateAction<string>>;
  guessBackspace: () => void;
  enterPressedEvent: Event;
  clearGuessTimeout: MutableRefObject<TimeoutId | null>;
  clearGuess: () => void;
};

export const GuessInputContext = createContext({} as GuessInputContextType);

export function GuessInputProvider({ children }: { children: ReactNode }) {
  const [guessValue, setGuessValue] = useState("");
  const clearGuessTimeout = useRef<TimeoutId | null>(null);

  const guessBackspace = () => {
    setGuessValue((current) => current.substring(0, current.length - 1));
  };

  const clearGuess = () => {
    setGuessValue("");
    clearGuessTimeout.current = null;
  };

  const enterPressedEvent = new Event("enterPressed");

  return (
    <GuessInputContext.Provider
      value={{
        guessValue,
        setGuessValue,
        guessBackspace,
        enterPressedEvent,
        clearGuessTimeout,
        clearGuess,
      }}
    >
      {children}
    </GuessInputContext.Provider>
  );
}
