/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { PanelTypes } from "@/features/hintPanels";
import { SortOrderKeys } from "@/types";

export type ObscurityPanelFormData = {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  clickToDefine: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
};
export type ObscurityPanelData = ObscurityPanelFormData & {
  panelType: PanelTypes;
};

export function isObscurityPanelData(a: any): a is ObscurityPanelData {
  return a.panelType === PanelTypes.Obscurity;
}
