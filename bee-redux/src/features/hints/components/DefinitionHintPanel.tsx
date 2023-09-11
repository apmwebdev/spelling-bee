import { DefinitionPanelData, StatusTrackingKeys } from "@/features/hints";
import * as Tabs from "@/components/radix-ui/radix-tabs";
import { useAppSelector } from "@/app/hooks";
import {
  selectAnswersByLetter,
  selectAnswersByLetterProcessed,
} from "@/features/puzzle/puzzleSlice";
import { LetterTab } from "@/features/hints/components/definitionPanel/LetterTab";

export function DefinitionHintPanel({
  definitionPanelData,
  statusTracking,
}: {
  definitionPanelData: DefinitionPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const answersProcessed = useAppSelector(selectAnswersByLetterProcessed);
  const usedLetters = Object.keys(answersProcessed);

  return (
    <div className="DefinitionHintPanel">
      <Tabs.Root className="DefinitionPanelTabs" defaultValue={usedLetters[0]}>
        <Tabs.List
          style={{ gridTemplateColumns: `repeat(${usedLetters.length}, 1fr` }}
        >
          {Object.keys(answersProcessed).map((letter) => (
            <Tabs.Trigger value={letter} key={letter}>
              {letter.toUpperCase()}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {Object.keys(answersProcessed).map((letter) => (
          <LetterTab
            letter={letter}
            letterAnswers={answersProcessed[letter]}
            definitionPanelData={definitionPanelData}
            statusTracking={statusTracking}
            key={letter}
          />
        ))}
      </Tabs.Root>
    </div>
  );
}
