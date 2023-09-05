import { PanelHeader } from "././shared/PanelHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { HintPanelData } from "@/features/hints";
import { HintPanelSettings } from "@/features/hints/components/settings/HintPanelSettings";
import { HintPanelContentContainer } from "@/features/hints/components/HintPanelContentContainer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  PanelCurrentDisplayStateProperties,
  selectPanelsDisplayState,
  setPanelDisplayPropThunk,
} from "@/features/hints/hintProfilesSlice";

export function HintPanel({ panel }: { panel: HintPanelData }) {
  const dispatch = useAppDispatch();
  const display = useAppSelector(selectPanelsDisplayState)[panel.id];

  const toggleExpanded = () => {
    dispatch(
      setPanelDisplayPropThunk({
        panelId: panel.id,
        property: PanelCurrentDisplayStateProperties.isExpanded,
        value: !display.isExpanded,
      }),
    );
  };

  return (
    <Collapsible.Root className="HintPanel" open={display.isExpanded}>
      <PanelHeader panelId={panel.id} isPanelExpanded={display.isExpanded}>
        <Collapsible.Trigger asChild>
          <button
            className="HintPanelHeaderCollapseButton"
            onClick={toggleExpanded}
          >
            <HeaderDisclosureWidget title={panel.name} />
          </button>
        </Collapsible.Trigger>
      </PanelHeader>
      <Collapsible.Content className="HintPanelContent">
        <HintPanelSettings panel={panel} />
        <HintPanelContentContainer panel={panel} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
