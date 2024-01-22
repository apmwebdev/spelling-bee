/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ReactNode } from "react";
import { HintContentBlurButton } from "@/features/hintPanels/components/shared/HintContentBlurButton";
import { PanelCurrentDisplayState } from "@/features/hintPanels";

import { Uuid } from "@/features/api";
import { SettingsToggle } from "@/features/hintPanels/components/shared/SettingsToggle";

export function QuickActions({
  panelUuid,
  displayState,
  children,
}: {
  panelUuid: Uuid;
  displayState: PanelCurrentDisplayState;
  children: ReactNode;
}) {
  return (
    <div className="HintPanelQuickActions">
      <div className="HintPanelQuickActions_buttons">
        <SettingsToggle panelUuid={panelUuid} />
        <HintContentBlurButton
          panelUuid={panelUuid}
          isBlurred={displayState.isBlurred}
        />
      </div>
      {displayState.isSettingsExpanded ? null : children}
    </div>
  );
}
