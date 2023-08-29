import { HintPanelData, PanelTypes } from "@/features/hints";
import { LetterHintPanel } from "@/features/hints/components/panels/LetterHintPanel";
import { SearchHintPanel } from "@/features/hints/components/panels/SearchHintPanel";
import { WordObscurityHintPanel } from "@/features/hints/components/panels/WordObscurityHintPanel";
import { DefinitionsHintPanel } from "@/features/hints/components/panels/DefinitionsHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle/puzzleSlice";
import { HintContentBlur } from "@/features/hints/components/shared/HintContentBlur";
import { HintContentBlurButton } from "@/features/hints/components/shared/HintContentBlurButton";

export function HintPanelContentContainer({ panel }: { panel: HintPanelData }) {
  const answers = useAppSelector(selectAnswerWords);

  const panelContent = () => {
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

  return (
    <div className="HintPanelContentContainer">
      <HintContentBlurButton
        panelId={panel.id}
        isBlurred={panel.currentDisplayState.isBlurred}
      />
      <HintContentBlur isBlurred={panel.currentDisplayState.isBlurred} />
      {panelContent()}
    </div>
  );
}
