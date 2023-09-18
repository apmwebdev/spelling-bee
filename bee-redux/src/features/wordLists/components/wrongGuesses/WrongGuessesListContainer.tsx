import { WrongGuessesListHeader } from "./WrongGuessesListHeader";
import { WordListScroller } from "../WordListScroller";

export function WrongGuessesListContainer({
  wordList,
}: {
  wordList: string[];
}) {
  const content = () => {
    if (wordList.length === 0) {
      return <div className="sb-word-list empty">No incorrect guesses</div>;
    }
    return (
      <div className="sb-word-list-container">
        <WrongGuessesListHeader />
        <WordListScroller wordList={wordList} allowPopovers={false} />
      </div>
    );
  };
  return content();
}
