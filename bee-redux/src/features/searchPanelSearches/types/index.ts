import {
  GridRow,
  StatusTrackingKeys,
  SubstringHintDataCell,
} from "@/features/hintPanels";
import { SearchPanelBaseData } from "@/features/hintPanelType_search";

export type SearchPanelSearchData = SearchPanelBaseData & {
  //includes searchString, location, lettersOffset, and outputType through inheritance
  attemptId: number;
  searchPanelId: number;
  createdAt: number;
  id?: number;
};

export type ResultData = {
  searchObject: SearchPanelSearchData;
  results: GridRow;
  total: SubstringHintDataCell;
  excludedAnswers: number;
};

export type SearchResultProps = {
  panelId?: number;
  resultData: ResultData;
  statusTracking: StatusTrackingKeys;
};

export type SpsDeleteArgs = { id?: number; createdAt: number };
