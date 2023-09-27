import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
} from "@/features/hintPanels";
import { SearchResultProps } from "@/features/searchPanelSearches";

export function WordCount({ resultData, statusTracking }: SearchResultProps) {
  return (
    <div className="SearchResultWordCount">
      <span>Result:</span>
      <div
        className={getSubstringHintStatusClasses({
          baseClasses: "SearchHintResult_WC_Result",
          cell: resultData.total,
          statusTracking,
        })}
      >
        {StatusTrackingOptions[statusTracking].outputFn(resultData.total)}
      </div>
    </div>
  );
}
