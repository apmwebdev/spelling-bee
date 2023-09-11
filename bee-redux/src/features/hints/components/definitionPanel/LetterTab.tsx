import { LetterGuesses } from "@/features/puzzle/puzzleSlice";
import { DefinitionPanelData, StatusTrackingKeys } from "@/features/hints";
import * as Tabs from "@/components/radix-ui/radix-tabs";
import { capitalizeFirstLetter } from "@/utils";

export function LetterTab({
  letter,
  letterAnswers,
  definitionPanelData,
  statusTracking,
}: {
  letter: string;
  letterAnswers: LetterGuesses;
  definitionPanelData: DefinitionPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  return (
    <Tabs.Content className="LetterTab" value={letter}>
      <div className="LetterTabUnknown">
        {letterAnswers.unknown
          .sort((a, b) => a.word.length - b.word.length)
          .map((answer) => (
            <div className="DefinitionPanelItem">
              <div className="DefinitionPanelTerm HintNotStarted">
                {answer.word[0]}... {answer.word.length}
              </div>
              <div>{answer.definitions[0]}</div>
            </div>
          ))}
      </div>
      <hr />
      <div className="LetterTabKnown">
        {letterAnswers.known.map((answer) => (
          <div className="DefinitionPanelItem">
            <div className="DefinitionPanelTerm HintCompleted">
              {capitalizeFirstLetter(answer.word)}
            </div>
            <div>{answer.definitions[0]}</div>
          </div>
        ))}
      </div>
    </Tabs.Content>
  );
}
