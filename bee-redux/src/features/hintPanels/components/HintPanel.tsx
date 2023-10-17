import { PanelHeader } from "./shared/PanelHeader";
import * as Collapsible from "@/components/radix-ui/radix-collapsible";
import { HintPanelSettings } from "@/features/hintPanels/components/settings/HintPanelSettings";
import { HintPanelContentContainer } from "@/features/hintPanels/components/shared/HintPanelContentContainer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { CSSProperties, forwardRef, Ref } from "react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  HintPanelData,
  PanelCurrentDisplayStateProperties,
  selectPanelDisplayState,
  setPanelDisplayPropThunk,
} from "@/features/hintPanels";
import classNames from "classnames/dedupe";

export const HintPanel = forwardRef(
  (
    {
      panel,
      isOverlay,
      isDragging,
      isSorting,
      style,
      attributes,
      listeners,
    }: {
      panel: HintPanelData;
      isOverlay: boolean;
      isDragging: boolean;
      isSorting?: boolean;
      style?: CSSProperties;
      attributes?: DraggableAttributes;
      listeners?: SyntheticListenerMap | undefined;
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    const dispatch = useAppDispatch();
    const display = useAppSelector(selectPanelDisplayState(panel.id));

    const toggleExpanded = () => {
      dispatch(
        setPanelDisplayPropThunk({
          panelId: panel.id,
          property: PanelCurrentDisplayStateProperties.isExpanded,
          value: !display.isExpanded,
        }),
      );
    };

    const cssClasses = () => {
      let classes = "HintPanel";
      if (isDragging && !isOverlay) {
        classes = classNames(classes, "Dragging");
      } else if (isOverlay) {
        classes = classNames(classes, "Overlay");
      }
      if (isSorting) {
        classes = classNames(classes, "Sorting");
      }
      return classes;
    };

    return (
      <Collapsible.Root
        ref={ref}
        style={style}
        className={cssClasses()}
        open={display.isExpanded}
      >
        <PanelHeader
          panelId={panel.id}
          isPanelExpanded={display.isExpanded}
          attributes={attributes}
          listeners={listeners}
        >
          <Collapsible.Trigger
            className="HintPanelHeaderCollapseButton HintPanelHeaderButton"
            onClick={toggleExpanded}
            title={panel.name}
          />
        </PanelHeader>
        <Collapsible.Content className="HintPanelContent">
          {display.isSettingsExpanded ? (
            <HintPanelSettings panel={panel} />
          ) : null}
          <HintPanelContentContainer panel={panel} />
        </Collapsible.Content>
      </Collapsible.Root>
    );
  },
);
