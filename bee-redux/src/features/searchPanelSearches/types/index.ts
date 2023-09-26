import {
  GridRow,
  SearchPanelBaseData,
  SubstringHintDataCell,
} from "@/features/hints";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

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
