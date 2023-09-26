import {
  GridRow,
  SearchPanelSearchData,
  SubstringHintDataCell,
} from "@/features/hints";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

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
