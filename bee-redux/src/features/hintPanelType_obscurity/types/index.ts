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
