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

export type ObscurityPanelBaseData = {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  clickToDefine: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
};

export type ObscurityPanelFormData = ObscurityPanelBaseData & {
  uuid: Uuid;
};

export type ObscurityPanelData = ObscurityPanelBaseData & {
  panelType: PanelTypes;
};

export const isObscurityPanelData = createTypeGuard<ObscurityPanelData>(
  ["hideKnown", "boolean"],
  ["revealedLetters", "number"],
  ["separateKnown", "boolean"],
  ["clickToDefine", "boolean"],
  ["revealLength", "boolean"],
  ["sortOrder", isEnumValue(SortOrderKeys)],
  ["panelType", (prop) => prop === PanelTypes.Obscurity],
);

export type TObscurityPanel = THintPanel & { typeData: ObscurityPanelData };

export const isObscurityPanel = (toTest: any): toTest is TObscurityPanel => {
  return isHintPanel(toTest) && isObscurityPanelData(toTest.typeData);
};
