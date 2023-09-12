import { LetterGuesses } from "@/features/puzzle/puzzleSlice";
import { DefinitionPanelData } from "@/features/hints";
import * as Tabs from "@/components/radix-ui/radix-tabs";

export function LetterTab({
  letter,
  letterAnswers,
  definitionPanelData,
}: {
  letter: string;
  letterAnswers: LetterGuesses;
  definitionPanelData: DefinitionPanelData;
}) {
  return (
    <Tabs.Content className="LetterTab" value={letter}>
      <div className="LetterTabUnknown">
        {letterAnswers.unknown
          .sort((a, b) => a.word.length - b.word.length)
          .map((answer) => (
            <div className="DefinitionPanelItem" key={answer.word}>
              <div className="DefinitionPanelTerm HintNotStarted capitalize">
                {answer.word.slice(0, definitionPanelData.revealedLetters)}...{" "}
                {definitionPanelData.revealLength ? answer.word.length : null}
              </div>
              {definitionPanelData.showObscurity ? (
                <div className="italic">Frequency: {answer.frequency}</div>
              ) : null}
              <div>{answer.definitions[0]}</div>
            </div>
          ))}
      </div>
      <hr />
      <div className="LetterTabKnown">
        {letterAnswers.known.map((answer) => (
          <div className="DefinitionPanelItem" key={answer.word}>
            <div className="DefinitionPanelTerm HintCompleted capitalize">
              {answer.word}
            </div>
            <div className="italic">Frequency: {answer.frequency}</div>
            <div>{answer.definitions[0]}</div>
          </div>
        ))}
      </div>
    </Tabs.Content>
  );
}
