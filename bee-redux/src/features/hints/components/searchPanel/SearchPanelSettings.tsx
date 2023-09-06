import {
  PanelTypes,
  SearchPanelData,
  SearchPanelLocationKeys,
} from "@/features/hints";
import { HintOutputTypeControl } from "@/features/hints/components/settings/HintOutputTypeControl";
import { HintLocationControl } from "@/features/hints/components/settings/HintLocationControl";
import { HintLettersOffsetControl } from "@/features/hints/components/settings/HintLettersOffsetControl";

export function SearchPanelSettings({
  panelId,
  typeData,
}: {
  panelId: number;
  typeData: SearchPanelData;
}) {
  const { outputType, location, lettersOffset } = typeData;
  return (
    <div className="SearchPanelSettings">
      <HintOutputTypeControl panelId={panelId} outputType={outputType} />
      <HintLocationControl
        panelId={panelId}
        location={location}
        panelType={PanelTypes.Search}
        style={{ gridRow: "2/3", gridColumn: "1/2" }}
      />
      <HintLettersOffsetControl
        panelId={panelId}
        lettersOffset={lettersOffset}
        disabled={location === SearchPanelLocationKeys.Anywhere}
        disabledTooltip="Can't use Offset with 'Location' set to 'Anywhere'"
        style={{ gridRow: "2/3", gridColumn: "2/3" }}
      />
    </div>
  );
}
