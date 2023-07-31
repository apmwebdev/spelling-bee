import { useAppSelector } from "../../../app/hooks";
import { selectExcludedWords } from "../../puzzle/puzzleSlice";
import { WordListScroller } from "./WordListScroller";

export function ExcludedWordsList() {
  const excludedWords = useAppSelector(selectExcludedWords);

  const content = () => {
    if (excludedWords) {
      return <WordListScroller wordList={excludedWords} />;
    }
    return <div className="sb-word-list empty">No puzzle</div>;
  };
  return content();
}
