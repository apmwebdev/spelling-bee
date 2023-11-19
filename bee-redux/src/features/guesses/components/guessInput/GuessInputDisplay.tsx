/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import { selectCenterLetter, selectValidLetters } from "@/features/puzzle";
import uniqid from "uniqid";

export function GuessInputDisplay({
  guessValue,
  additionalCssClasses,
}: {
  guessValue: string;
  additionalCssClasses: string;
}) {
  const validLetters = useAppSelector(selectValidLetters);
  const centerLetter = useAppSelector(selectCenterLetter);

  const letterClasses = (letter: string) => {
    let classList = "GuessInputLetter";
    if (centerLetter === letter) {
      return (classList += " centerLetter");
    }
    if (validLetters.includes(letter)) {
      return (classList += " valid");
    }
    return (classList += " invalid");
  };

  const containerClasses = (
    guessValue: string,
    additionalCssClasses: string,
  ) => {
    let classList = `GuessInput ${additionalCssClasses}`;
    if (guessValue.length > 0) {
      classList += " nonEmpty";
    }
    return classList;
  };

  const content = (guessValue: string) => {
    const guessArr = guessValue.split("");
    return guessArr.map((letter) => (
      <span key={uniqid()} className={letterClasses(letter)}>
        {letter}
      </span>
    ));
  };

  return (
    <div
      id="GuessInput"
      className={containerClasses(guessValue, additionalCssClasses)}
    >
      {content(guessValue)}
    </div>
  );
}
