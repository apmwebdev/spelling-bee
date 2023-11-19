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

export type DefinitionPanelFormData = {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  showObscurity: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
};
export type DefinitionPanelData = DefinitionPanelFormData & {
  panelType: PanelTypes;
};

export function isDefinitionPanelData(a: any): a is DefinitionPanelData {
  return a.panelType === PanelTypes.Definition;
}
