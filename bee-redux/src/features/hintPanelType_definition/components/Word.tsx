/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { AnswerFormat } from "@/features/puzzle";
import { usageExplanation } from "@/features/hintPanelType_obscurity/util";
import { DefinitionPanelData } from "@/features/hintPanelType_definition/types";
import classNames from "classnames/dedupe";

export function Word({
  answer,
  definitionPanelData,
  isKnown,
}: {
  answer: AnswerFormat;
  definitionPanelData: DefinitionPanelData;
  isKnown: boolean;
}) {
  const { revealedLetters, showObscurity, revealLength } = definitionPanelData;

  const unknownWordDisplay = () => {
    let returnStr = `${answer.word.slice(0, revealedLetters)}...`;
    if (revealLength) {
      returnStr += ` ${answer.word.length}`;
    }
    return returnStr;
  };

  return (
    <div className="DefinitionPanelWord">
      <div
        className={classNames("DefinitionPanelTerm capitalize", {
          ErrorText: !isKnown,
        })}
      >
        {isKnown ? answer.word : unknownWordDisplay()}
      </div>
      {showObscurity ? (
        <div className="italic">
          Frequency: {answer.frequency} (
          {usageExplanation(answer.frequency).toLowerCase()})
        </div>
      ) : null}
      <div>{answer.definitions[0]}</div>
    </div>
  );
}
