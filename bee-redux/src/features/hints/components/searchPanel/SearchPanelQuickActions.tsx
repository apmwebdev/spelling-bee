import {
  PanelCurrentDisplayState,
  PanelTypes,
  SearchPanelData,
  SearchPanelLocationKeys,
} from "@/features/hints";
import { QuickActions } from "@/features/hints/components/shared/QuickActions";
import { HintLocationControl } from "@/features/hints/components/settings/HintLocationControl";
import { HintLettersOffsetControl } from "@/features/hints/components/settings/HintLettersOffsetControl";

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
