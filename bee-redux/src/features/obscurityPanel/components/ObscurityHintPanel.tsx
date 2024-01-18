/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import {
  AnswerFormat,
  selectAnswerLengths,
  selectAnswers,
  selectKnownAnswers,
  selectKnownWords,
  selectRemainingAnswers,
} from "@/features/puzzle";
import { usageExplanation } from "src/features/obscurityPanel";
import { DefinitionPopover } from "./DefinitionPopover";
import { last } from "lodash";
import { ObscurityPanelData } from "../";
import { SortOrderKeys } from "@/types/globalTypes";

const sortByFrequency = (
  sortOrder: SortOrderKeys,
  ...answers: AnswerFormat[]
) => {
  return answers.sort((a, b) =>
    sortOrder === SortOrderKeys.asc
      ? b.frequency - a.frequency
      : a.frequency - b.frequency,
  );
};

const displayUnknownWord = ({
  answer,
  revealedLetters,
  revealLength,
}: {
  answer: AnswerFormat;
  revealedLetters: number;
  revealLength: boolean;
}) => {
  let returnStr = `${answer.word.slice(0, revealedLetters)}...`;
  if (revealLength) returnStr += ` ${answer.word.length}`;
  return returnStr;
};

export function ObscurityHintPanel({
  obscurityPanelData,
}: {
  obscurityPanelData: ObscurityPanelData;
}) {
  const allAnswers = useAppSelector(selectAnswers);
  const remainingAnswers = useAppSelector(selectRemainingAnswers);
  const knownAnswers = useAppSelector(selectKnownAnswers);
  const knownWords = useAppSelector(selectKnownWords);
  const answerLengths = useAppSelector(selectAnswerLengths);
  const {
    hideKnown,
    revealedLetters,
    separateKnown,
    clickToDefine,
    revealLength,
    sortOrder,
  } = obscurityPanelData;

  const content = () => {
    let answers: AnswerFormat[];
    if (hideKnown) {
      answers = sortByFrequency(sortOrder, ...remainingAnswers);
    } else if (!hideKnown && separateKnown) {
      answers = [
        ...sortByFrequency(sortOrder, ...remainingAnswers),
        ...sortByFrequency(sortOrder, ...knownAnswers),
      ];
    } else {
      answers = sortByFrequency(sortOrder, ...allAnswers);
    }

    return answers.map((answer) => {
      if (!hideKnown && knownWords.includes(answer.word)) {
        return (
          <tr key={answer.word}>
            <td className="capitalize">
              {clickToDefine ? (
                <DefinitionPopover answer={answer} />
              ) : (
                answer.word
              )}
            </td>
            <td>{answer.frequency}</td>
            <td>{usageExplanation(answer.frequency)}</td>
          </tr>
        );
      }
      return (
        <tr className="ErrorText" key={answer.word}>
          <td className="capitalize">
            {clickToDefine ? (
              <DefinitionPopover
                answer={answer}
                displayString={displayUnknownWord({
                  answer,
                  revealedLetters,
                  revealLength,
                })}
              />
            ) : (
              displayUnknownWord({ answer, revealedLetters, revealLength })
            )}
          </td>
          <td>{answer.frequency}</td>
          <td>{usageExplanation(answer.frequency)}</td>
        </tr>
      );
    });
  };

  return (
    <div className="ObscurityHintPanel">
      <table className="ObscurityPanelTable">
        <colgroup>
          <col style={{ width: `${(last(answerLengths) ?? 8) + 4}ch` }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Word</th>
            <th scope="col">Frequency</th>
            <th scope="col">Usage</th>
          </tr>
        </thead>
        <tbody>{content()}</tbody>
      </table>
    </div>
  );
}