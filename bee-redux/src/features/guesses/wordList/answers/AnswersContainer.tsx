import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectAnswerWords } from "../../../puzzle/puzzleSlice";
import { WordListScroller } from "../WordListScroller";
import { SettingsCollapsible } from "../SettingsCollapsible";
import {
  selectAnswersListSettings,
  toggleAnswersSettingsCollapsed,
} from "../wordListSettingsSlice";

export function AnswersContainer() {
  const dispatch = useAppDispatch();
  const answerWords = useAppSelector(selectAnswerWords);
  const { settingsCollapsed } = useAppSelector(selectAnswersListSettings);
  const content = () => {
    if (answerWords) {
      return <WordListScroller wordList={answerWords} allowPopovers={true} />;
    }
    return <div className="sb-word-list empty">No puzzle</div>;
  };

  return (
    <div className="sb-answers-container">
      <SettingsCollapsible
        isCollapsed={settingsCollapsed}
        toggleIsCollapsed={() => dispatch(toggleAnswersSettingsCollapsed())}
      >
        blah
      </SettingsCollapsible>
    </div>
  );
}
