import { PanelHeader } from "././shared/PanelHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { HintPanelData } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { HintPanelSettings } from "@/features/hints/components/settings/HintPanelSettings";
import { HintPanelContentContainer } from "@/features/hints/components/HintPanelContentContainer";

export function HintPanel({ panel }: { panel: HintPanelData }) {
  const [updatePanel] = useUpdateHintPanelMutation();

  const toggleExpanded = () => {
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
      <Collapsible.Content className="HintPanelContent">
        <HintPanelSettings panel={panel} />
        <HintPanelContentContainer panel={panel} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
