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
import { selectAnswersListSettings } from "@/features/wordLists";
import {
  RailsGuessFormData,
  selectCurrentAttempt,
  useAddGuessMutation,
} from "@/features/guesses";

export function AnswerSpoiler({ word }: { word: string }) {
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const [addGuess] = useAddGuessMutation();
  const { remainingRevealFirstLetter, remainingRevealLength } = useAppSelector(
    selectAnswersListSettings,
  );

  const determineWidth = () => {
    const minWidth = 72;
    const widthMultiplier = 16;
    const maxWidth = 136;
    if (!remainingRevealLength) {
      return minWidth;
    }
    const customWidth = word.length * widthMultiplier + 8;
    if (maxWidth > customWidth && customWidth > minWidth) {
      return customWidth;
    }
    if (customWidth > maxWidth) return maxWidth;
    return minWidth;
  };

  const spoiler = (spoilerText: string) => {
    const spoilerData: RailsGuessFormData = {
      guess: {
        user_puzzle_attempt_id: currentAttempt.id,
        text: word,
        is_spoiled: true,
      },
    };

    return (
      <button
        className="Revealer"
        style={{ width: `${determineWidth()}px` }}
        onClick={() => addGuess(spoilerData)}
      >
        {spoilerText}
      </button>
    );
  };

  const content = () => {
    if (!remainingRevealFirstLetter && !remainingRevealLength) {
      return spoiler("...");
    }
    if (remainingRevealFirstLetter && !remainingRevealLength) {
      return spoiler(`${word[0].toUpperCase()}...`);
    }
    if (!remainingRevealFirstLetter && remainingRevealLength) {
      return spoiler(`${word.length}`);
    }
    if (remainingRevealFirstLetter && remainingRevealLength) {
      return spoiler(`${word[0].toUpperCase()}... ${word.length}`);
    }
  };

  return content();
}
