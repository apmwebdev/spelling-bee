import { LetterHintPanel } from "./panels/LetterHintPanel";
import { SearchHintPanel } from "./panels/SearchHintPanel";
import { WordObscurityHintPanel } from "./panels/WordObscurityHintPanel";
import { DefinitionsHintPanel } from "./panels/DefinitionsHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "../../puzzle/puzzleSlice";
import { PanelHeader } from "./generalControls/PanelHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { HintPanelData, PanelTypes } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export interface HintPanelProps {
  panel: HintPanelData;
}

export function HintPanel({ panel }: HintPanelProps) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const answers = useAppSelector(selectAnswerWords);
  const panelContent = (panel: HintPanelData) => {
    if (answers.length === 0) {
      return;
    }
    switch (panel.typeData.panelType) {
      case PanelTypes.Letter:
        return <LetterHintPanel panel={panel} />;
      case PanelTypes.Search:
        return <SearchHintPanel panel={panel} />;
      case PanelTypes.Obscurity:
        return <WordObscurityHintPanel panel={panel} />;
      case PanelTypes.Definition:
        return <DefinitionsHintPanel panel={panel} />;
      default:
        return null;
    }
  };

  const toggleExpanded = () => {
    console.log("toggleExpanded");
    updatePanel({
      id: panel.id,
      debounceField: "currentIsExpanded",
      currentDisplayState: {
        isExpanded: !panel.currentDisplayState.isExpanded,
      },
    });
  };

  return (
    <Collapsible.Root
      className="HintPanel"
      open={panel.currentDisplayState.isExpanded}
    >
      <PanelHeader
        panelId={panel.id}
        isPanelExpanded={panel.currentDisplayState.isExpanded}
      >
        <Collapsible.Trigger asChild>
          <button
            className="HintPanelHeaderCollapseButton"
            onClick={toggleExpanded}
          >
            <HeaderDisclosureWidget title={panel.name} />
          </button>
        </Collapsible.Trigger>
      </PanelHeader>
      <Collapsible.Content className="sb-hint-panel-content">
        {panelContent(panel)}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
