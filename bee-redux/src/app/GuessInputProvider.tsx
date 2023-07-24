import React, { createContext, ReactNode, useState } from "react";

export interface GuessInputContextType {
  guessValue: string;
  setGuessValue: React.Dispatch<React.SetStateAction<string>>;
}

export const GuessInputContext = createContext({} as GuessInputContextType);

export function GuessInputProvider({ children }: { children: ReactNode }) {
  const [guessValue, setGuessValue] = useState("");

  return (
    <GuessInputContext.Provider value={{ guessValue, setGuessValue }}>
      {children}
    </GuessInputContext.Provider>
  );
}
