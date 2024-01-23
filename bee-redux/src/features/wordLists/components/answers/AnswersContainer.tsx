/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAnswerWords,
  selectKnownWords,
  selectRemainingAnswerWords,
  selectValidLetters,
} from "@/features/puzzle";
import {
  selectAnswersListSettings,
  setAnswersSortOrder,
  toggleAnswersSettingsCollapsed,
} from "@/features/wordLists";
import answerSorter from "./answerSorter";
import { selectSpoiledWords } from "@/features/guesses";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { AnswersSettings } from "@/features/wordLists/components/answers/AnswersSettings";
import { WordListContainer } from "@/features/wordLists/components/WordListContainer";

export function AnswersContainer() {
  const dispatch = useAppDispatch();
  const answerWords = useAppSelector(selectAnswerWords);
  const remainingWords = useAppSelector(selectRemainingAnswerWords);
  const knownWords = useAppSelector(selectKnownWords);
  const spoiledWords = useAppSelector(selectSpoiledWords);
  const validLetters = useAppSelector(selectValidLetters);
  const {
    settingsCollapsed,
    sortType,
    sortOrder,
    remainingAndSpoiledOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  } = useAppSelector(selectAnswersListSettings);

  const displayList = answerSorter({
    remainingWords: [...remainingWords],
    knownWords: [...knownWords].sort(),
    spoiledWords: [...spoiledWords].sort(),
    validLetters: [...validLetters],
    sortOrder,
    remainingAndSpoiledOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  });

  return (
    <div className="AnswersContainer">
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() => dispatch(toggleAnswersSettingsCollapsed())}
      >
        <AnswersSettings />
      </SettingsCollapsible>
      <div className="AnswersStatus WordListStatus">
        There are{" "}
        <span className="WordListStatusCount">{answerWords.length}</span>{" "}
        answers for this puzzle.
      </div>
      <WordListContainer
        wordList={displayList}
        sortType={sortType}
        sortOrder={sortOrder}
        setSortOrder={setAnswersSortOrder}
        emptyListMessage="No answers"
        allowPopovers={true}
        useSpoilers={true}
      />
    </div>
  );
}
