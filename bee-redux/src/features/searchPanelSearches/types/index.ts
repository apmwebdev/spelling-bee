import {
  GridRow,
  SearchPanelSearchData,
  SubstringHintDataCell,
} from "@/features/hints";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

export interface ResultData {
  searchObject: SearchPanelSearchData;
  results: GridRow;
  total: SubstringHintDataCell;
  excludedAnswers: number;
}

export interface SearchResultProps {
  panelId?: number;
  resultData: ResultData;
  statusTracking: StatusTrackingKeys;
}