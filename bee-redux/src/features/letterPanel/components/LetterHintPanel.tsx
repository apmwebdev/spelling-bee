/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { WordCountList } from "./WordCountList";
import { WordLengthGridContainer } from "./WordLengthGridContainer";
import { LettersPresent } from "./LettersPresent";
import {
  isLetterPanelData,
  LetterHintSubsectionProps,
  LetterPanelData,
} from "../types/letterPanelTypes";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle";
import {
  StatusTrackingKeys,
  SubstringHintOutputKeys,
} from "@/features/hintPanels";
import { selectKnownAnswerWords } from "@/features/progress/api/progressSelectors";

export function LetterHintPanel({
  letterData,
  statusTracking,
}: {
  letterData: LetterPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const answers = useAppSelector(selectAnswerWords);
  const knownWords = useAppSelector(selectKnownAnswerWords);

  if (!isLetterPanelData(letterData)) return;

  const { numberOfLetters, location, lettersOffset, outputType, hideKnown } =
    letterData;

  const subsectionProps: LetterHintSubsectionProps = {
    answers,
    knownWords,
    numberOfLetters,
    location,
    lettersOffset,
    hideKnown,
    statusTracking,
  };

  const content = () => {
    if (outputType === SubstringHintOutputKeys.WordLengthGrid) {
      return <WordLengthGridContainer {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputKeys.WordCountList) {
      return <WordCountList {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputKeys.LettersPresent) {
      return <LettersPresent {...subsectionProps} />;
    }
  };

  return <div className="LetterHintPanel">{content()}</div>;
}
