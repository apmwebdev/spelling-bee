import { PanelHeader } from "././shared/PanelHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { HintPanelData } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { HintPanelSettings } from "@/features/hints/components/settings/HintPanelSettings";
import { HintPanelContentContainer } from "@/features/hints/components/HintPanelContentContainer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
// import { selectPanelsDisplayState, setPanelIsExpanded } from "@/features/hints/hintProfilesSlice";

export function HintPanel({ panel }: { panel: HintPanelData }) {
  // const dispatch = useAppDispatch();
  // const display = useAppSelector(selectPanelsDisplayState)[panel.id];
  if (true) return null;

  // const toggleExpanded = () => {
  //   dispatch(
  //     setPanelIsExpanded({
  //       panelId: panel.id,
  //       value: !display.isExpanded,
  //     }),
  //   );
  // };

  return (
    <Collapsible.Root className="HintPanel" open={display.isExpanded}>
      <PanelHeader panelId={panel.id} isPanelExpanded={display.isExpanded}>
        <Collapsible.Trigger asChild>
          <button
            className="HintPanelHeaderCollapseButton"
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
