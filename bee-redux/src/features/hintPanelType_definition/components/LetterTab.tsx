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
