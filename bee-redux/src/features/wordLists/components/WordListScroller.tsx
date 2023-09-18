import * as ScrollArea from "@radix-ui/react-scroll-area";
import uniqid from "uniqid";
import { WordWithPopover } from "./WordWithPopover";
import { AnswerSpoiler } from "./answers/AnswerSpoiler";
import { useAppSelector } from "@/app/hooks";
import { selectRemainingAnswerWords } from "@/features/puzzle";

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

  const listItem = (word: string) => {
    if (useSpoilers && remainingAnswerWords.includes(word)) {
      return <AnswerSpoiler word={word} />;
    }
    if (allowPopovers) {
      return <WordWithPopover word={word} />;
    }
    return <span>{word}</span>;
  };

  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport>
        <ul className="sb-word-list has-content">
          {wordList.map((word) => (
            <li key={uniqid()}>{listItem(word)}</li>
          ))}
        </ul>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="ScrollAreaScrollbar"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
