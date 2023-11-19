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

export function WordWithPopover({ word }: { word: string }) {
  const completeWord = useAppSelector(selectAnswers).find(
    (answer) => answer.word === word,
  );
  const pangrams = useAppSelector(selectPangrams);
  const isPangram = pangrams.includes(word);
  const isPerfect = isPangram && word.length === 7;
  let spanClasses = "hasPopover";
  if (isPerfect) {
    spanClasses += " perfect";
  } else if (isPangram) {
    spanClasses += " pangram";
  }
  return (
    <Popover.Root>
      <Popover.Trigger className="WordPopoverTrigger">
        <span className={spanClasses}>{word}</span>
      </Popover.Trigger>
      <Popover.ContentWithPortal>
        <span>{completeWord?.definitions[0]}</span>
        <Popover.Close />
      </Popover.ContentWithPortal>
    </Popover.Root>
  );
}
