import { PanelTypes, SearchPanelData } from "@/features/hints";
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
  const { outputType, location, lettersOffset } = typeData
  return (
    <div className="SearchPanelSettings">
      <HintOutputTypeControl panelId={panelId} outputType={outputType} />
      <HintLettersOffsetControl
        panelId={panelId}
        lettersOffset={lettersOffset}
      />
      <HintLocationControl
        panelId={panelId}
        location={location}
        panelType={PanelTypes.Search}
      />
    </div>
  );
}
