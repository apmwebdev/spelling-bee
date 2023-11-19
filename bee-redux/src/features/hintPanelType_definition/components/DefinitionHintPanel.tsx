/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Tabs from "@/components/radix-ui/radix-tabs";
import { useAppSelector } from "@/app/hooks";
import { selectAnswersByLetter } from "@/features/puzzle";
import { LetterTab } from "./LetterTab";
import { DefinitionPanelData } from "../";

export function DefinitionHintPanel({
  definitionPanelData,
}: {
  definitionPanelData: DefinitionPanelData;
}) {
  const answersByLetter = useAppSelector(selectAnswersByLetter);
  const usedLetters = Object.keys(answersByLetter.asc);

  return (
    <div className="DefinitionHintPanel">
      <Tabs.Root className="DefinitionPanelTabs" defaultValue={usedLetters[0]}>
        <Tabs.List
          style={{ gridTemplateColumns: `repeat(${usedLetters.length}, 1fr` }}
        >
          {usedLetters.map((letter) => (
            <Tabs.Trigger value={letter} key={letter}>
              {letter.toUpperCase()}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {usedLetters.map((letter) => (
          <LetterTab
            letter={letter}
            letterAnswers={
              answersByLetter[definitionPanelData.sortOrder][letter]
            }
            definitionPanelData={definitionPanelData}
            key={letter}
          />
        ))}
      </Tabs.Root>
    </div>
  );
}
