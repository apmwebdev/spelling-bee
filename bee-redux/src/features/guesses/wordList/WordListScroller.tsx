import * as ScrollArea from "@radix-ui/react-scroll-area";
import uniqid from "uniqid";
import { WordWithPopover } from "./WordWithPopover";

export function WordListScroller({
  wordList,
  allowPopovers,
}: {
  wordList: string[];
  allowPopovers: boolean;
}) {
  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport>
        <ul className="sb-word-list has-content">
          {wordList.map((word) => {
            if (allowPopovers) {
              return <WordWithPopover key={uniqid()} word={word} />;
            }
            return <li key={uniqid()}>{word}</li>;
          })}
        </ul>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" className="scrollbar">
        <ScrollArea.Thumb className="scrollbar-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
