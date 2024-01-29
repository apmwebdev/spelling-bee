/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Popover from "@/components/radix-ui/radix-popover";
import { useAppSelector } from "@/app/hooks";
import { selectAnswers, selectPangrams } from "@/features/puzzle";
import { isGuess, TGuess } from "@/features/guesses";
import classNames from "classnames/dedupe";

export function WordWithPopover({ item }: { item: string | TGuess }) {
  let word = "";
  let isSpoiled = false;
  if (isGuess(item)) {
    word = item.text;
    if (item.isSpoiled) isSpoiled = true;
  } else {
    word = item;
  }

  const completeWord = useAppSelector(selectAnswers).find(
    (answer) => answer.word === word,
  );
  const pangrams = useAppSelector(selectPangrams);
  const isPangram = pangrams.includes(word);
  const wordClasses = classNames("WordPopover_word", {
    WordPopover_word___pangram: isPangram,
    WordPopover_word___perfect: isPangram && word.length === 7,
    WordPopover_word___spoiled: isSpoiled,
  });

  return (
    <Popover.Root>
      <Popover.Trigger className="WordPopoverTrigger">
        <span className={wordClasses}>{word}</span>
      </Popover.Trigger>
      <Popover.ContentWithPortal>
        <span>{completeWord?.definitions[0]}</span>
        <Popover.Close />
      </Popover.ContentWithPortal>
    </Popover.Root>
  );
}
