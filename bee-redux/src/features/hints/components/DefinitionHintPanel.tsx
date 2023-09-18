import { DefinitionPanelData } from "@/features/hints";
import * as Tabs from "@/components/radix-ui/radix-tabs";
import { useAppSelector } from "@/app/hooks";
import { selectAnswersByLetter } from "@/features/puzzle";
import { LetterTab } from "./definitionPanel/LetterTab";

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
