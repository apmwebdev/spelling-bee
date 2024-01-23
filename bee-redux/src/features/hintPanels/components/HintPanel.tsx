/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
  PanelTypes,
  selectPanelDisplayState,
  setPanelDisplayPropThunk,
} from "@/features/hintPanels";
import classNames from "classnames/dedupe";
import {
  LetterPanelData,
  LetterPanelQuickActions,
} from "@/features/letterPanel";
import {
  SearchPanelData,
  SearchPanelQuickActions,
} from "@/features/searchPanel";
import { WordInfoQuickActions } from "@/features/hintPanels/components/shared/WordInfoQuickActions";
import { ObscurityPanelData } from "@/features/obscurityPanel";
import { DefinitionPanelData } from "@/features/definitionPanel";

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
    const displayState = useAppSelector(selectPanelDisplayState(panel.uuid));

    const toggleExpanded = () => {
      dispatch(
        setPanelDisplayPropThunk({
          panelUuid: panel.uuid,
          property: PanelCurrentDisplayStateProperties.isExpanded,
          value: !displayState.isExpanded,
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

    const quickActionsRouter = {
      [PanelTypes.Letter]: (
        <LetterPanelQuickActions
          panelUuid={panel.uuid}
          displayState={displayState}
          typeData={panel.typeData as LetterPanelData}
        />
      ),
      [PanelTypes.Search]: (
        <SearchPanelQuickActions
          panelUuid={panel.uuid}
          displayState={displayState}
          typeData={panel.typeData as SearchPanelData}
        />
      ),
      [PanelTypes.Obscurity]: (
        <WordInfoQuickActions
          panelUuid={panel.uuid}
          displayState={displayState}
          typeData={panel.typeData as ObscurityPanelData}
        />
      ),
      [PanelTypes.Definition]: (
        <WordInfoQuickActions
          panelUuid={panel.uuid}
          displayState={displayState}
          typeData={panel.typeData as DefinitionPanelData}
        />
      ),
    };

    return (
      <Collapsible.Root
        ref={ref}
        style={style}
        className={cssClasses()}
        open={displayState.isExpanded}
      >
        <PanelHeader
          panelUuid={panel.uuid}
          isPanelExpanded={displayState.isExpanded}
          attributes={attributes}
          listeners={listeners}
        >
          <Collapsible.TitleTrigger
            className="HintPanelHeaderCollapseButton HintPanelHeaderButton"
            onClick={toggleExpanded}
            title={panel.name}
          />
        </PanelHeader>
        <Collapsible.Content className="HintPanelContent">
          {quickActionsRouter[panel.typeData.panelType]}
          {displayState.isSettingsExpanded ? (
            <HintPanelSettings panel={panel} />
          ) : null}
          <HintPanelContentContainer panel={panel} />
        </Collapsible.Content>
      </Collapsible.Root>
    );
  },
);
