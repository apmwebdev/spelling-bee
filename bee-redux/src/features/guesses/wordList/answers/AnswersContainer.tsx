import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectAnswerWords,
  selectRemainingAnswerWords,
  selectValidLetters,
} from "../../../puzzle/puzzleSlice";
import { WordListScroller } from "../WordListScroller";
import { SettingsCollapsible } from "../SettingsCollapsible";
import {
  selectAnswersListSettings,
  SortOrder,
  toggleAnswersSettingsCollapsed,
} from "../wordListSettingsSlice";
import answerSorter from "./answerSorter";
import { selectCorrectGuessWords } from "../../guessesSlice";

export function AnswersContainer() {
  const dispatch = useAppDispatch();
  const answerWords = useAppSelector(selectAnswerWords);
  const remainingWords = useAppSelector(selectRemainingAnswerWords);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);
  const validLetters = useAppSelector(selectValidLetters);
  const {
    settingsCollapsed,
    sortOrder,
    remainingOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  } = useAppSelector(selectAnswersListSettings);

  const displayList = answerSorter({
    answerWords: [...answerWords],
    remainingWords: [...remainingWords],
    correctGuessWords: [...correctGuessWords].sort(),
    validLetters: [...validLetters],
    sortOrder,
    remainingOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  });

  return (
    <div className="sb-answers-container">
      <SettingsCollapsible
        isCollapsed={settingsCollapsed}
        toggleIsCollapsed={() => dispatch(toggleAnswersSettingsCollapsed())}
      >
        blah
      </SettingsCollapsible>
      <div className="sb-answers-status sb-word-list-status">
        There are{" "}
        <span className="word-list-status-count">{answerWords.length}</span>{" "}
        answers for this puzzle.
      </div>
      <div className="sb-word-list-container">
        <div>remainingOnly: {remainingOnly ? "true" : "false"}</div>
        <div>
          remainingGroupWithLetter:{" "}
          {remainingGroupWithLetter ? "true" : "false"}
        </div>
        <div>
          remainingRevealFirstLetter:{" "}
          {remainingRevealFirstLetter ? "true" : "false"}
        </div>
        <div>
          remainingRevealLength: {remainingRevealLength ? "true" : "false"}
        </div>
        <div>remainingLocation: {remainingLocation}</div>
        <div>sortOrder: {sortOrder}</div>
        <WordListScroller
          wordList={displayList}
          allowPopovers={true}
          useSpoilers={true}
        />
      </div>
    </div>
  );
}
