import {
  LetterHintPanel,
  LetterPanelData,
  LetterPanelQuickActions,
} from "@/features/hintPanelType_letter";
import {
  SearchHintPanel,
  SearchPanelData,
  SearchPanelQuickActions,
} from "@/features/hintPanelType_search";
import {
  ObscurityHintPanel,
  ObscurityPanelData,
} from "@/features/hintPanelType_obscurity";
import {
  DefinitionHintPanel,
  DefinitionPanelData,
} from "@/features/hintPanelType_definition";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle";
import { HintContentBlur } from "@/features/hintPanels/components/shared/HintContentBlur";
import { WordInfoQuickActions } from "@/features/hintPanels/components/shared/WordInfoQuickActions";
import {
  HintPanelData,
  PanelTypes,
  selectPanelDisplayState,
} from "@/features/hintPanels";

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
