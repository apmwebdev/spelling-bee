import {
  DefinitionPanelData,
  HintPanelData,
  LetterPanelData,
  ObscurityPanelData,
  PanelTypes,
  SearchPanelData,
} from "@/features/hints";
import { LetterHintPanel } from "@/features/hints/components/LetterHintPanel";
import { SearchHintPanel } from "@/features/hints/components/SearchHintPanel";
import { ObscurityHintPanel } from "@/features/hints/components/ObscurityHintPanel";
import { DefinitionHintPanel } from "@/features/hints/components/DefinitionHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle/puzzleSlice";
import { HintContentBlur } from "@/features/hints/components/shared/HintContentBlur";
import { HintContentBlurButton } from "@/features/hints/components/shared/HintContentBlurButton";
import { selectPanelDisplayState } from "@/features/hints/hintProfilesSlice";

export function HintPanelContentContainer({ panel }: { panel: HintPanelData }) {
  const answers = useAppSelector(selectAnswerWords);
  const displayState = useAppSelector(selectPanelDisplayState(panel.id));

  if (answers.length === 0) {
    return;
  }

  const typeRouter = {
    [PanelTypes.Letter]: () => (
      <LetterHintPanel
        letterData={panel.typeData as LetterPanelData}
        statusTracking={panel.statusTracking}
      />
    ),
    [PanelTypes.Search]: () => (
      <SearchHintPanel
        searchPanelData={panel.typeData as SearchPanelData}
        statusTracking={panel.statusTracking}
      />
    ),
    [PanelTypes.Obscurity]: () => (
      <ObscurityHintPanel
        obscurityPanelData={panel.typeData as ObscurityPanelData}
        statusTracking={panel.statusTracking}
      />
    ),
    [PanelTypes.Definition]: () => (
      <DefinitionHintPanel
        definitionPanelData={panel.typeData as DefinitionPanelData}
        statusTracking={panel.statusTracking}
      />
    ),
  };

  return (
    <div className="HintPanelContentContainer">
      <HintContentBlurButton
        panelId={panel.id}
        isBlurred={displayState.isBlurred}
      />
      <HintContentBlur isBlurred={displayState.isBlurred} />
      {typeRouter[panel.typeData.panelType]()}
    </div>
  );
}
