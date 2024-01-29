/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as ScrollArea from "@/components/radix-ui/radix-scroll-area";
import uniqid from "uniqid";
import { WordWithPopover } from "./WordWithPopover";
import { AnswerSpoiler } from "./answers/AnswerSpoiler";
import { useAppSelector } from "@/app/hooks";
import { selectRemainingAnswerWords } from "@/features/progress/api/progressSlice";
import { isGuess, TGuess } from "@/features/guesses";

export function WordListScroller({
  wordList,
  allowPopovers,
  useSpoilers,
}: {
  wordList: string[] | TGuess[];
  allowPopovers: boolean;
  useSpoilers?: boolean;
}) {
  const remainingAnswerWords = useAppSelector(selectRemainingAnswerWords);

  const listItem = (item: string | TGuess) => {
    let word = "";
    if (isGuess(item)) {
      word = item.text;
    } else {
      word = item;
    }

    if (useSpoilers && remainingAnswerWords.includes(word)) {
      return <AnswerSpoiler word={word} />;
    }
    if (allowPopovers) {
      return <WordWithPopover item={item} />;
    }
    return <span>{word}</span>;
  };

  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport>
        <ul className="WordList hasContent">
          {wordList.map((item) => (
            <li key={uniqid()}>{listItem(item)}</li>
          ))}
        </ul>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
    </ScrollArea.Root>
  );
}
