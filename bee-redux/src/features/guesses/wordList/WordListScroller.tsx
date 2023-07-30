import * as ScrollArea from "@radix-ui/react-scroll-area";
import uniqid from "uniqid";

export function WordListScroller({ wordList }: { wordList: string[] }) {
  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport>
        <ul className="sb-word-list has-content">
          {wordList.map((word) => {
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
