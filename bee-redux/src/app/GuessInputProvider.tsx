import React, { createContext, ReactNode, useState } from "react";

export type GuessInputContextType = {
  guessValue: string;
  setGuessValue: React.Dispatch<React.SetStateAction<string>>;
  guessBackspace: () => void;
  enterPressedEvent: Event;
};

export const GuessInputContext = createContext({} as GuessInputContextType);

export function GuessInputProvider({ children }: { children: ReactNode }) {
  const [guessValue, setGuessValue] = useState("");

  const guessBackspace = () => {
    setGuessValue((current) => current.substring(0, current.length - 1));
  };

  const enterPressedEvent = new Event("enterPressed");

  return (
    <GuessInputContext.Provider
      value={{
        guessValue,
        setGuessValue,
        guessBackspace,
        enterPressedEvent,
      }}
    >
      {children}
    </GuessInputContext.Provider>
  );
}
