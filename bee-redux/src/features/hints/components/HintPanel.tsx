import { setIsCollapsed } from "../hintProfilesSlice";
import { LetterHintPanel } from "./panels/LetterHintPanel";
import { SearchHintPanel } from "./panels/SearchHintPanel";
import { WordObscurityHintPanel } from "./panels/WordObscurityHintPanel";
import { DefinitionsHintPanel } from "./panels/DefinitionsHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "../../puzzle/puzzleSlice";
import { PanelHeader } from "./generalControls/PanelHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/utils/HeaderDisclosureWidget";
import { useDispatch } from "react-redux";
import { HintPanelData, PanelTypes } from "@/features/hints";

export interface HintPanelProps {
  panel: HintPanelData;
}

export function HintPanel({ panel }: HintPanelProps) {
  const dispatch = useDispatch();
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

  const toggleCollapsed = () => {
    dispatch(
      setIsCollapsed({ panelId: panel.id, isCollapsed: !panel.isCollapsed }),
    );
  };

  return (
    <Collapsible.Root className="HintPanel" open={!panel.isCollapsed}>
      <PanelHeader panelId={panel.id} isCollapsed={panel.isCollapsed}>
        <Collapsible.Trigger asChild>
          <button
            className="sb-hint-panel-header-collapse-button"
            onClick={toggleCollapsed}
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