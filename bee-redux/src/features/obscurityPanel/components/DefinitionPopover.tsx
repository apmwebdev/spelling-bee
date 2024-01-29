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
import { TAnswer } from "@/features/puzzle";

export function DefinitionPopover({
  answer,
  displayString,
}: {
  answer: TAnswer;
  displayString?: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger className="DefinitionPopoverTrigger capitalize">
        {displayString ?? answer.word}
      </Popover.Trigger>
      <Popover.ContentWithPortal>
        <span>{answer.definitions[0]}</span>
      </Popover.ContentWithPortal>
    </Popover.Root>
  );
}
