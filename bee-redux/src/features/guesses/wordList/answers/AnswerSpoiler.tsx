import { useAppSelector } from "../../../../app/hooks";
import { selectCorrectGuessWords } from "../../guessesSlice";
import { WordWithPopover } from "../WordWithPopover";

export function AnswerSpoiler({ word }: { word: string }) {
  const correctGuesses = useAppSelector(selectCorrectGuessWords);
  if (correctGuesses.includes(word)) {
    return <WordWithPopover word={word} />;
  }

  return (
    <div>
      {word} spoiler
    </div>
  );
}
