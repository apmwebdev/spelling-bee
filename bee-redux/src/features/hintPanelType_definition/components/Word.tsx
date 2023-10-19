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