import {
  DefinitionPanelData,
  HintPanelData,
  LetterPanelData,
  ObscurityPanelData,
  PanelTypes,
  SearchPanelData,
  selectPanelDisplayState,
} from "@/features/hints";
import { LetterHintPanel } from "@/features/hints/components/LetterHintPanel";
import { SearchHintPanel } from "@/features/hints/components/SearchHintPanel";
import { ObscurityHintPanel } from "@/features/hints/components/ObscurityHintPanel";
import { DefinitionHintPanel } from "@/features/hints/components/DefinitionHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle";
import { HintContentBlur } from "@/features/hints/components/shared/HintContentBlur";
import { WordInfoQuickActions } from "@/features/hints/components/shared/WordInfoQuickActions";
import { LetterPanelQuickActions } from "@/features/hints/components/letterPanel/LetterPanelQuickActions";
import { SearchPanelQuickActions } from "@/features/hints/components/searchPanel/SearchPanelQuickActions";

export function HintPanelContentContainer({ panel }: { panel: HintPanelData }) {
  const answers = useAppSelector(selectAnswerWords);
  const displayState = useAppSelector(selectPanelDisplayState(panel.id));

  if (answers.length === 0) {
    return;
  }

  const panelTypeRouter = {
    [PanelTypes.Letter]: {
      content: (
        <LetterHintPanel
          letterData={panel.typeData as LetterPanelData}
          statusTracking={panel.statusTracking}
        />
      ),
      quickActions: (
        <LetterPanelQuickActions
          panelId={panel.id}
          displayState={displayState}
          typeData={panel.typeData as LetterPanelData}
        />
      ),
    },
    [PanelTypes.Search]: {
      content: (
        <SearchHintPanel
          searchPanelData={panel.typeData as SearchPanelData}
          statusTracking={panel.statusTracking}
        />
      ),
      quickActions: (
        <SearchPanelQuickActions
          panelId={panel.id}
          displayState={displayState}
          typeData={panel.typeData as SearchPanelData}
        />
      ),
    },
    [PanelTypes.Obscurity]: {
      content: (
        <ObscurityHintPanel
          obscurityPanelData={panel.typeData as ObscurityPanelData}
        />
      ),
      quickActions: (
        <WordInfoQuickActions
          panelId={panel.id}
          displayState={displayState}
          typeData={panel.typeData as ObscurityPanelData}
        />
      ),
    },
    [PanelTypes.Definition]: {
      content: (
        <DefinitionHintPanel
          definitionPanelData={panel.typeData as DefinitionPanelData}
        />
      ),
      quickActions: (
        <WordInfoQuickActions
          panelId={panel.id}
          displayState={displayState}
          typeData={panel.typeData as DefinitionPanelData}
        />
      ),
    },
  };

  return (
    <div className="HintPanelContentContainer">
      {panelTypeRouter[panel.typeData.panelType].quickActions}
      <HintContentBlur isBlurred={displayState.isBlurred} />
      {panelTypeRouter[panel.typeData.panelType].content}
    </div>
  );
}
