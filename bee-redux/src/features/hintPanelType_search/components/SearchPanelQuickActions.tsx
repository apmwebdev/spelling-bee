import { QuickActions } from "@/features/hintPanels/components/shared/QuickActions";
import { HintLocationControl } from "@/features/hintPanels/components/settings/HintLocationControl";
import { HintLettersOffsetControl } from "@/features/hintPanels/components/settings/HintLettersOffsetControl";
import { PanelCurrentDisplayState, PanelTypes } from "@/features/hintPanels";
import { SearchPanelData, SearchPanelLocationKeys } from "..";

export function SearchPanelQuickActions({
  panelId,
  displayState,
  typeData,
}: {
  panelId: number;
  displayState: PanelCurrentDisplayState;
  typeData: SearchPanelData;
}) {
  return (
    <QuickActions panelId={panelId} displayState={displayState}>
      <HintLocationControl
        panelId={panelId}
        location={typeData.location}
        panelType={PanelTypes.Search}
      />
      <HintLettersOffsetControl
        panelId={panelId}
        lettersOffset={typeData.lettersOffset}
        disabled={typeData.location === SearchPanelLocationKeys.Anywhere}
        disabledTooltip="Can't use Offset with 'Location' set to 'Anywhere'"
      />
    </QuickActions>
  );
}
