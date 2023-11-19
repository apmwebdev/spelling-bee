/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { RemoveButton } from "./RemoveButton";
import { DuplicateButton } from "./DuplicateButton";
import { ReactNode } from "react";
import { DragHandle } from "@/features/hintPanels/components/shared/DragHandle";
import { SettingsToggle } from "@/features/hintPanels/components/shared/SettingsToggle";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type PanelHeaderProps = {
  panelId: number;
  isPanelExpanded: boolean;
  children: ReactNode;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
};

export function PanelHeader({
  panelId,
  isPanelExpanded,
  children,
  attributes,
  listeners,
}: PanelHeaderProps) {
  const cssClasses = () => {
    let classList = "HintPanelHeader";
    if (isPanelExpanded) {
      classList += " expanded";
    } else {
      classList += " collapsed";
    }
    return classList;
  };

  return (
    <header className={cssClasses()}>
      <div className="PanelHeaderButtonGroup">
        <DragHandle attributes={attributes} listeners={listeners} />
        <SettingsToggle panelId={panelId} />
      </div>
      {children}
      <div className="PanelHeaderButtonGroup">
        <DuplicateButton panelId={panelId} />
        <RemoveButton panelId={panelId} />
      </div>
    </header>
  );
}
