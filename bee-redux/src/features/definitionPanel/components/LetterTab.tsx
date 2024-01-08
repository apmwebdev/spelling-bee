/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { LetterAnswers } from "@/features/puzzle";
import * as Tabs from "@/components/radix-ui/radix-tabs";
import { Word } from "./Word";
import { DefinitionPanelData } from "../";

export function LetterTab({
  letter,
  letterAnswers,
  definitionPanelData,
}: {
  letter: string;
  letterAnswers: LetterAnswers;
  definitionPanelData: DefinitionPanelData;
}) {
  const { hideKnown, separateKnown } = definitionPanelData;

  const unknownAnswers = () => (
    <div className="LetterTabUnknown">
      {letterAnswers.unknown.map((answer) => (
        <Word
          answer={answer}
          definitionPanelData={definitionPanelData}
          isKnown={false}
          key={answer.word}
        />
      ))}
    </div>
  );

  const content = () => {
    if (hideKnown) {
      return unknownAnswers();
    }
    if (!hideKnown && !separateKnown) {
      return (
        <div className="LetterTabAll">
          {letterAnswers.all.map((answer) => (
            <Word
              answer={answer}
              definitionPanelData={definitionPanelData}
              isKnown={letterAnswers.known.includes(answer)}
              key={answer.word}
            />
          ))}
        </div>
      );
    }
    return (
      <>
        {unknownAnswers()}
        <hr />
        <div className="LetterTabKnown">
          {letterAnswers.known.map((answer) => (
            <Word
              answer={answer}
              definitionPanelData={definitionPanelData}
              isKnown={true}
              key={answer.word}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <Tabs.Content className="LetterTab" value={letter}>
      {content()}
    </Tabs.Content>
  );
}
