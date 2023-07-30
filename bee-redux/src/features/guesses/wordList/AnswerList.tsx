import { useAppSelector } from "../../../app/hooks";
import { selectAnswerWords } from "../../puzzle/puzzleSlice";
import uniqid from "uniqid";
import { WordListScroller } from "./WordListScroller";

export function AnswerList() {
  const answerWords = useAppSelector(selectAnswerWords);
  const content = () => {
    if (answerWords) {
      return <WordListScroller wordList={answerWords} />;
    }
    return <div className="sb-word-list empty">No puzzle</div>;
  };
  return content();
}
