import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAnswerWords,
  selectRemainingAnswerWords,
  selectValidLetters,
} from "../../puzzle/puzzleSlice";
import { WordListScroller } from "../WordListScroller";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import {
  selectAnswersListSettings,
  toggleAnswersSettingsCollapsed,
} from "../wordListSettingsSlice";
import answerSorter from "./answerSorter";
import {
  selectKnownWords,
  selectSpoiledWords,
} from "../../guesses/guessesSlice";
import { AnswersSettings } from "./AnswersSettings";
import { AnswersListHeader } from "./AnswersListHeader";

export function AnswersContainer() {
  const dispatch = useAppDispatch();
  const answerWords = useAppSelector(selectAnswerWords);
  const remainingWords = useAppSelector(selectRemainingAnswerWords);
  const knownWords = useAppSelector(selectKnownWords);
  const spoiledWords = useAppSelector(selectSpoiledWords);
  const validLetters = useAppSelector(selectValidLetters);
  const {
    settingsCollapsed,
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
    <div className="sb-answers-container">
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() => dispatch(toggleAnswersSettingsCollapsed())}
      >
        <AnswersSettings />
      </SettingsCollapsible>
      <div className="sb-answers-status sb-word-list-status">
        There are{" "}
        <span className="word-list-status-count">{answerWords.length}</span>{" "}
        answers for this puzzle.
      </div>
      <div className="sb-word-list-container">
        <AnswersListHeader />
        <WordListScroller
          wordList={displayList}
          allowPopovers={true}
          useSpoilers={true}
        />
      </div>
    </div>
  );
}
