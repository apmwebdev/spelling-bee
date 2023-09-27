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
