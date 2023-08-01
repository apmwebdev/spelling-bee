import * as ScrollArea from "@radix-ui/react-scroll-area";
import uniqid from "uniqid";
import { WordWithPopover } from "./WordWithPopover";
import { AnswerSpoiler } from "./answers/AnswerSpoiler";
import { useAppSelector } from "../../../app/hooks";
import { selectRemainingAnswerWords } from "../../puzzle/puzzleSlice";

export function WordListScroller({
  wordList,
  allowPopovers,
  useSpoilers,
}: {
  wordList: string[];
  allowPopovers: boolean;
  useSpoilers?: boolean;
}) {
  const remainingAnswerWords = useAppSelector(selectRemainingAnswerWords);

  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport>
        <ul className="sb-word-list has-content">
          {wordList.map((word) => {
            if (useSpoilers && remainingAnswerWords.includes(word)) {
              return <AnswerSpoiler key={uniqid()} word={word} />;
            }
            if (allowPopovers) {
              return <WordWithPopover key={uniqid()} word={word} />;
            }
            return (
              <li key={uniqid()}>
                <span>{word}</span>
              </li>
            );
          })}
        </ul>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" className="scrollbar">
        <ScrollArea.Thumb className="scrollbar-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
