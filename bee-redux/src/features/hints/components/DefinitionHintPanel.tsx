import { DefinitionPanelData, StatusTrackingKeys } from "@/features/hints";
import * as Tabs from "@radix-ui/react-tabs";
import { useAppSelector } from "@/app/hooks";
import {
  selectAnswersByLetter,
  selectValidLetters,
} from "@/features/puzzle/puzzleSlice";
import { selectKnownWords } from "@/features/guesses/guessesSlice";

export function DefinitionHintPanel({
  definitionPanelData,
  statusTracking,
}: {
  definitionPanelData: DefinitionPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const validLetters = useAppSelector(selectValidLetters);
  const answersByLetter = useAppSelector(selectAnswersByLetter);
  const knownWords = useAppSelector(selectKnownWords);

  return (
    <div className="DefinitionHintPanel">
      <Tabs.Root className="DefinitionPanelTabs" defaultValue={validLetters[0]}>
        <Tabs.List
          className="TabsList"
          style={{ gridTemplateColumns: "repeat(7, 1fr" }}
        >
          {validLetters.map((letter) => (
            <Tabs.Trigger className="TabsTrigger" value={letter} key={letter}>
              {letter.toUpperCase()}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {Object.keys(answersByLetter).map((letter) => (
          <Tabs.Content className="TabsContent" value={letter} key={letter}>
            {answersByLetter[letter].map((answer) => (
              <div>
                <div>{answer.word}</div>
                <div>{answer.definitions[0]}</div>
              </div>
            ))}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}
