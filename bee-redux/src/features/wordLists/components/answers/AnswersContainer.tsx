import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAnswerWords,
  selectKnownWords,
  selectRemainingAnswerWords,
  selectValidLetters,
} from "@/features/puzzle";
import { WordListScroller } from "../WordListScroller";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import {
  selectAnswersListSettings,
  toggleAnswersSettingsCollapsed,
} from "@/features/wordLists";
import answerSorter from "./answerSorter";
import { selectSpoiledWords } from "@/features/guesses";
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
      <div className="WordListContainer">
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
