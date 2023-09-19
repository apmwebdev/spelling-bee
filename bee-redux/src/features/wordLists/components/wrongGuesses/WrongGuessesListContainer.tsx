import { WrongGuessesListHeader } from "./WrongGuessesListHeader";
import { WordListScroller } from "../WordListScroller";

export function WrongGuessesListContainer({
  wordList,
}: {
  wordList: string[];
}) {
  const content = () => {
    if (wordList.length === 0) {
      return <div className="WordList empty">No incorrect guesses</div>;
    }
    return (
      <div className="WordListContainer">
        <WrongGuessesListHeader />
        <WordListScroller wordList={wordList} allowPopovers={false} />
      </div>
    );
  };
  return content();
}
