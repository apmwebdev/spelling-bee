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
  toggleAnswersSettingsCollapsed,
} from "../wordListSettingsSlice";
import answerSorter from "./answerSorter";
import { selectRevealedWords } from "../../guessesSlice";
import { AnswersSettings } from "./AnswersSettings";

export function AnswersContainer() {
  const dispatch = useAppDispatch();
  const answerWords = useAppSelector(selectAnswerWords);
  const remainingWords = useAppSelector(selectRemainingAnswerWords);
  const revealedWords = useAppSelector(selectRevealedWords);
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
    remainingWords: [...remainingWords],
    revealedWords: [...revealedWords].sort(),
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
        <AnswersSettings />
      </SettingsCollapsible>
      <div className="sb-answers-status sb-word-list-status">
        There are{" "}
        <span className="word-list-status-count">{answerWords.length}</span>{" "}
        answers for this puzzle.
      </div>
      <div className="sb-word-list-container">
        <WordListScroller
          wordList={displayList}
          allowPopovers={true}
          useSpoilers={true}
        />
      </div>
    </div>
  );
}
