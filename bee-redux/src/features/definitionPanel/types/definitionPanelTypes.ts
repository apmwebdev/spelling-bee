/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { isHintPanel, PanelTypes, THintPanel } from "@/features/hintPanels";
import {
  createTypeGuard,
  isEnumValue,
  SortOrderKeys,
} from "@/types/globalTypes";
import { Uuid } from "@/features/api";

export type DefinitionPanelBaseData = {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  showObscurity: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
};

export type DefinitionPanelFormData = DefinitionPanelBaseData & {
  uuid: Uuid;
};

export type DefinitionPanelData = DefinitionPanelBaseData & {
  panelType: PanelTypes;
};

export const isDefinitionPanelData = createTypeGuard<DefinitionPanelData>(
  ["hideKnown", "boolean"],
  ["revealedLetters", "number"],
  ["separateKnown", "boolean"],
  ["showObscurity", "boolean"],
  ["revealLength", "boolean"],
  ["sortOrder", isEnumValue(SortOrderKeys)],
  ["panelType", (prop) => prop === PanelTypes.Definition],
);

export type TDefinitionPanel = THintPanel & { typeData: DefinitionPanelData };

export const isDefinitionPanel = (toTest: any): toTest is TDefinitionPanel => {
  return isHintPanel(toTest) && isDefinitionPanelData(toTest.typeData);
};
