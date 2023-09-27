import { PanelTypes, SubstringHintOutputKeys } from "@/features/hintPanels";
import { EnumeratedOptions } from "@/types";

/**
 * For search panels, should it search for the search string at the start,
 * end, or anywhere in the puzzle words?
 */
export enum SearchPanelLocationKeys {
  Start = "start",
  End = "end",
  Anywhere = "anywhere",
}

export const SearchPanelLocationOptions: EnumeratedOptions = {
  start: { title: "Start of Word" },
  end: { title: "End of Word" },
  anywhere: { title: "Anywhere in Word" },
};
export type SearchPanelBaseData = {
  searchString: string;
  location: SearchPanelLocationKeys;
  lettersOffset: number;
  outputType: SubstringHintOutputKeys;
};
export type SearchPanelData = SearchPanelBaseData & {
  panelType: PanelTypes;
  // ID is necessary for search panels so that searches know which panel they
  // belong to
  id: number;
};

export function isSearchPanelData(a: any): a is SearchPanelData {
  return a.panelType === PanelTypes.Search;
}
